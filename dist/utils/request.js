"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search_import_tc = search_import_tc;
exports.file_import = file_import;
exports.field_qmetry = field_qmetry;
exports.testcase_import = testcase_import;
exports.validate_upload = validate_upload;
exports.list_testcase = list_testcase;
async function file_import(jwt, projectId, fileBlob) {
    console.log('🌐 Subiendo archivo...');
    const host = `https://qtmcloud.qmetry.com/rest/api/ui/projects/${projectId}/import`;
    const url = new URL(host);
    const formData = new FormData();
    formData.append('file', fileBlob, 'data.xlsx');
    formData.append('separator', ',');
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': jwt
        },
        body: formData
    });
    if (!response.ok) {
        console.error("❌ Error al subir el archivo");
        return;
    }
    const json = await response.json();
    return json;
}
async function field_qmetry(jwt, projectId) {
    const url = new URL('https://qtmcloud.qmetry.com/rest/api/ui/ai/config');
    const data = {
        project: {
            jiraProjectId: projectId,
            configurations: ["testcaseCustomFields"]
        }
    };
    const request = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'Authorization': jwt
        },
        body: JSON.stringify(data)
    });
    if (!request.ok) {
        console.error("❌ Error al obtener los campos personalizados");
        return;
    }
    const responseJson = await request.json();
    return responseJson;
}
async function testcase_import(jwt, fileId, projectId, fields) {
    console.log('🚀 Importando Casos de Prueba...');
    const data = {
        uploadedFile: {},
        fileId: fileId,
        folderId: -1,
        sheetName: "Datos",
        createMetaData: true,
        updateExistingIssues: false,
        mapping: fields,
        projectId: projectId
    };
    const url = new URL('https://qtmcloud.qmetry.com/rest/api/ui/testcases/import');
    const request = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'Authorization': jwt
        },
        body: JSON.stringify(data)
    });
    if (!request.ok) {
        console.error("❌ Error al importar los casos de prueba");
        return;
    }
    const responseJson = await request.json();
    return responseJson;
}
async function validate_upload(jwt, importTC) {
    console.log("🔎 Validando Subida:", importTC.status);
    const response = await fetch(importTC.progressUrl, {
        method: 'GET',
        headers: {
            'Authorization': jwt
        }
    });
    if (!response.ok) {
        console.error("❌ Error al realizar la petición");
        return;
    }
    const json = await response.json();
    console.log(json);
    return json;
}
async function search_import_tc(jwt, taskId) {
    console.log('🔍 Buscando Task...');
    const response = await fetch('https://qtmcloud.qmetry.com/rest/api/ui/tasks/' + taskId, {
        method: 'GET',
        headers: {
            'Authorization': jwt
        }
    });
    if (!response.ok) {
        console.error("❌ Error al realizar la petición");
        return;
    }
    const json = await response.json();
    return json;
}
async function list_testcase(jwt, startAt, projectId) {
    console.log('📋 Obteniendo Casos de Prueba...');
    const data = {
        filter: {
            projectId: projectId,
            folderId: '-1',
            withChild: true
        }
    };
    const url = `https://qtmcloud.qmetry.com/rest/api/ui/testcases/search?startAt=${startAt}&maxResults=100&fields=summary`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        console.error("❌ Error al realizar la petición");
        return;
    }
    const json = await response.json();
    return json;
}
