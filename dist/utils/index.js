"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.procesar_field = procesar_field;
exports.procesar_field_qmetry = procesar_field_qmetry;
exports.generate_blob = generate_blob;
exports.procesar_testcase = procesar_testcase;
exports.validar_existencias = validar_existencias;
const node_xlsx_1 = require("node-xlsx");
const fs_1 = require("fs");
const request_1 = require("./request");
const fields_1 = require("./fields");
const field_testcase_json_1 = __importDefault(require("../data/field_testcase.json"));
const __1 = require("..");
async function procesar_field(doc) {
    console.log('🔄 Procesando Campos...');
    doc.fields = {
        ...doc.fields,
        ...await fields_1.fields.testcase('feature', doc.description)
    };
    doc.description = "";
    for (const e of doc.elements) {
        const field = await fields_1.fields.testcase('scenario', e.scenario.description);
        e.scenario.fields = { ...e.scenario.fields, ...doc.fields, ...field };
        e.scenario.description = "";
    }
    console.table(doc.fields);
    return doc;
}
async function procesar_field_qmetry(jwt, projectId, fileImport) {
    console.log('🔄 Obteniendo Campos Personalizados Qmetry...');
    const field = await (0, request_1.field_qmetry)(jwt, projectId);
    const customFields = field.projectConfigurations.testcaseCustomFields || [];
    console.table(customFields.map((customField) => ({ id: customField.id, name: customField.name })));
    const fieldSystem = field_testcase_json_1.default;
    if (__1.const_fields_testcase.length > 0) {
        fieldSystem.push(...__1.const_fields_testcase);
    }
    console.log('🔄 Enlace de Campos...');
    const fieldMappings = new Map();
    fieldSystem.forEach(e => {
        fieldMappings.set(e.xlsHeader, { qmetryHeader: e.qmetryHeader, xlsHeader: e.xlsHeader });
    });
    customFields.forEach((customField) => {
        fieldMappings.set(customField.name, { qmetryHeader: customField.id, xlsHeader: customField.name });
    });
    const xlsxHeaders = fileImport?.data.sheets[0].headers ?? [];
    const mappedFields = xlsxHeaders.map((header) => {
        const mapping = fieldMappings.get(header);
        return mapping ? { qmetryHeader: mapping.qmetryHeader, xlsHeader: mapping.xlsHeader } : null;
    }).filter(Boolean);
    console.table(mappedFields);
    return mappedFields;
}
async function generate_blob(document, generateFile) {
    console.log('📄 Generando archivo blob...');
    const fieldSystem = field_testcase_json_1.default;
    if (__1.const_fields_testcase.length > 0) {
        fieldSystem.push(...__1.const_fields_testcase);
    }
    const doc = [];
    const cols = [];
    for (const column of fieldSystem) {
        cols.push(column.xlsHeader);
    }
    doc.push(cols);
    for (const element of document.elements) {
        let fields = [];
        for (const column of fieldSystem) {
            const key = column.name;
            if (key === 'summary') {
                fields.push(element.scenario.fields?.['summary'] || '');
            }
            else if (key === 'steps') {
                fields.push(element.scenario.fields?.['stepSummary'] || '');
            }
            else if (key === 'data') {
                fields.push(element.scenario.fields?.['testData'] || '');
            }
            else {
                fields.push(element.scenario.fields?.[key] || '');
            }
        }
        doc.push(fields);
    }
    const hoja = { name: "Datos", data: doc, options: {} };
    const libro = [hoja];
    const buffer = (0, node_xlsx_1.build)(libro);
    if (!generateFile) {
        const blobFile = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        return blobFile;
    }
    else {
        (0, fs_1.writeFileSync)('data.xlsx', buffer);
        return null;
    }
}
async function procesar_testcase(jwt, projectId) {
    let total_test = [];
    const list_tc = await (0, request_1.list_testcase)(jwt, 0, projectId);
    const per_page = Math.ceil(list_tc?.total / 100);
    const startAt = list_tc?.startAt;
    total_test.push(...list_tc?.data.map((tc) => ({ key: tc.key, summary: tc.summary })));
    for (let i = 1; i < per_page; i++) {
        const list_tc = await (0, request_1.list_testcase)(jwt, startAt + i, projectId);
        total_test.push(...list_tc?.data.map((tc) => ({ key: tc.key, summary: tc.summary })));
    }
    console.log("📋 Total de TestCases: ", total_test.length);
    console.table(total_test);
    return total_test;
}
async function validar_existencias(document, total_test) {
    const elements = document.elements;
    const elements_delete = [];
    const filteredElements = elements.filter((element) => {
        const existsInTotalTest = total_test.some((test) => test.summary === element.scenario.name);
        if (existsInTotalTest) {
            elements_delete.push(element.scenario.name);
        }
        return !existsInTotalTest;
    });
    console.log("📋 Total de TestCases a eliminar: ", elements_delete.length);
    console.table(elements_delete);
    document.elements = filteredElements;
    console.log("📋 Total de TestCases a importar: ", document.elements.length);
    console.table(document.elements.map((e) => e.scenario.name));
    return document;
}
