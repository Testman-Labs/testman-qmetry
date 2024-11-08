"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.import_testcase = import_testcase;
const request_1 = require("../utils/request");
const utils_1 = require("../utils");
const testman_feature_1 = require("@testmanlabs/testman-feature");
const fs_1 = require("fs");
async function import_testcase({ jwt, featurePath, project, validate }) {
    try {
        console.log({
            featurePath,
            project,
            validate
        });
        if (!featurePath || !featurePath.endsWith(".feature")) {
            console.error("❌ El archivo debe ser un archivo .feature");
            return;
        }
        if (!(0, fs_1.existsSync)(featurePath)) {
            console.error("❌ El archivo no existe");
            return;
        }
        console.log("✅ Archivo .feature válido. Procesando...");
        const projectId = project.split(":")[0];
        if (validate) {
            const total_test = await (0, utils_1.procesar_testcase)(jwt, projectId);
            let document = (0, testman_feature_1.FeatureToJSON)(featurePath);
            document = await (0, utils_1.validar_existencias)(document, total_test);
            if (document.elements.length > 0) {
                await procesar_import(jwt, projectId, document);
            }
            else {
                console.log("❌ No se encontraron testcases para importar");
                return;
            }
        }
        else {
            let document = (0, testman_feature_1.FeatureToJSON)(featurePath);
            await procesar_import(jwt, projectId, document);
        }
    }
    catch (error) {
        console.error("❌ Error al importar el caso de prueba:", error);
        throw error;
    }
}
async function procesar_import(jwt, projectId, document) {
    document = await (0, utils_1.procesar_field)(document);
    const fileBlob = await (0, utils_1.generate_blob)(document, false);
    const fileImport = await (0, request_1.file_import)(jwt, projectId, fileBlob);
    const fields = await (0, utils_1.procesar_field_qmetry)(jwt, projectId, fileImport);
    const importTC = await (0, request_1.testcase_import)(jwt, fileImport?.data.fileId, projectId, fields);
    await (0, request_1.validate_upload)(jwt, importTC);
    console.log("✅ Importación completada con éxito.");
}
