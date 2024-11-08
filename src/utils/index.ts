import { build } from "node-xlsx";
import { writeFileSync } from "fs";
import { field_qmetry, list_testcase } from "./request";
import { fields } from "./fields";
import { IFeatureToJSON } from "@testmanlabs/testman-feature";
import testcasefields from "../data/field_testcase.json";
import { const_fields_testcase } from "..";

export async function procesar_field(doc: IFeatureToJSON) {
    console.log('🔄 Procesando Campos...');
    doc.fields = {
        ...doc.fields,
        ...await fields.testcase('feature', doc.description)
    };
    doc.description = "";

    for (const e of doc.elements) {
        const field = await fields.testcase('scenario', e.scenario.description);
        e.scenario.fields = { ...e.scenario.fields, ...doc.fields, ...field };
        e.scenario.description = "";
    }

    console.table(doc.fields);
    return doc;
}

export async function procesar_field_qmetry(jwt: string, projectId: string, fileImport: any) {
    console.log('🔄 Obteniendo Campos Personalizados Qmetry...');
    const field = await field_qmetry(jwt, projectId);
    const customFields = field.projectConfigurations.testcaseCustomFields || [];
    
    console.table(customFields.map((customField: any) => ({ id: customField.id, name: customField.name })));

    const fieldSystem = testcasefields;
    if (const_fields_testcase.length > 0) { fieldSystem.push(...const_fields_testcase); }

    console.log('🔄 Enlace de Campos...');
    const fieldMappings = new Map<string, { qmetryHeader: string, xlsHeader: string }>();

    fieldSystem.forEach(e => {
        fieldMappings.set(e.xlsHeader!, { qmetryHeader: e.qmetryHeader!, xlsHeader: e.xlsHeader! });
    });

    customFields.forEach((customField: any) => {
        fieldMappings.set(customField.name, { qmetryHeader: customField.id, xlsHeader: customField.name });
    });

    const xlsxHeaders = fileImport?.data.sheets[0].headers ?? [];
    const mappedFields = xlsxHeaders.map((header: any) => {
        const mapping = fieldMappings.get(header);
        return mapping ? { qmetryHeader: mapping.qmetryHeader, xlsHeader: mapping.xlsHeader } : null;
    }).filter(Boolean);

    console.table(mappedFields);
    return mappedFields;
}

export async function generate_blob(document: IFeatureToJSON, generateFile: boolean) {
    console.log('📄 Generando archivo blob...');
    const fieldSystem = testcasefields;
    if (const_fields_testcase.length > 0) { fieldSystem.push(...const_fields_testcase); }
    
    const doc = [];
    const cols: string[] = [];
    for (const column of fieldSystem) {
        cols.push(column.xlsHeader!);
    }
    doc.push(cols);

    for (const element of document.elements) {
        let fields: string[] = [];
        for (const column of fieldSystem) {
            const key = column.name;
            if (key === 'summary') {
                fields.push(element.scenario.fields?.['summary'] as string || '');
            } 
            else if (key === 'steps') {
                fields.push(element.scenario.fields?.['stepSummary'] as string || '');
            } else if (key === 'data') {
                fields.push(element.scenario.fields?.['testData'] as string || '');
            } 
            else {
                fields.push(element.scenario.fields?.[key] as string || '');
            }
        }
        doc.push(fields);
    }

    const hoja = { name: "Datos", data: doc, options: {} };
    const libro = [hoja];
    const buffer = build(libro);

    if (!generateFile) {
        const blobFile = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        return blobFile;
    } else {
        writeFileSync('data.xlsx', buffer);
        return null;
    }
}

export async function procesar_testcase(jwt: string, projectId: string) {
    let total_test = [];
    const list_tc = await list_testcase(jwt!, 0, projectId);
    const per_page = Math.ceil(list_tc?.total / 100);
    const startAt = list_tc?.startAt;
    total_test.push(...list_tc?.data.map((tc: any) => ({ key: tc.key, summary: tc.summary })));

    for (let i = 1; i < per_page; i++) {
        const list_tc = await list_testcase(jwt!, startAt + i, projectId);
        total_test.push(...list_tc?.data.map((tc: any) => ({ key: tc.key, summary: tc.summary })));
    }

    console.log("📋 Total de TestCases: ", total_test.length);
    console.table(total_test);
    return total_test;
}

export async function validar_existencias(document: IFeatureToJSON, total_test: any[]) {
    const elements = document.elements;

    const elements_delete: any[] = [];
    const filteredElements = elements.filter((element: any) => {
        const existsInTotalTest = total_test.some((test: any) => test.summary === element.scenario.name);
        if (existsInTotalTest) {
            elements_delete.push(element.scenario.name);
        }
        return !existsInTotalTest;
    });

    console.log("📋 Total de TestCases a eliminar: ", elements_delete.length);
    console.table(elements_delete);
    document.elements = filteredElements;

    console.log("📋 Total de TestCases a importar: ", document.elements.length);
    console.table(document.elements.map((e: any) => e.scenario.name));
    return document;
}