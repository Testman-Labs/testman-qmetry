import { getInput, setFailed } from '@actions/core';
import { validate_auth } from "./commads/validate_auth";
import { import_testcase } from './commads/import_testcase';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { IFieldTestcase, ISettigns } from './types';

export let const_jirabase_url = "";
export let const_fields_testcase: IFieldTestcase[] = [];

async function runs() {
    try {
        const settingsData = await loadSettings();
        if (settingsData) {
            const_jirabase_url = settingsData.constanst.jirabase_url;
            const_fields_testcase = settingsData.fields.testcase;
        }

        const jwt = await authenticate();
        if (!jwt) {
            throw new Error("❌ Error al obtener el token de autenticación");
        }

        await executeCommand(jwt);

    } catch (error) {
        setFailed(error as string | Error);
    }
}

async function loadSettings() {
    const inputSettings = getInput('settings');
    const resolveSetting = resolve(inputSettings);

    if (inputSettings && existsSync(resolveSetting)) {
        const settingsData: ISettigns = require(resolveSetting);
        return settingsData;
    } else {
        throw new Error(`❌ El archivo de configuración no existe en la ruta: ${resolveSetting}`);
    }
}

async function authenticate(): Promise<string | null> {
    const jira_email = getInput('username');
    const jira_token = getInput('secretkey');

    if (!jira_email || !jira_token) {
        throw new Error("❌ Las credenciales de Jira no están completas");
    }

    const response = await validate_auth({ jira_email, jira_token })
    return response!;
}

async function executeCommand(jwt: string) {
    const execute = getInput('execute');

    switch (execute) {
        case 'import-testcase':
            await import_testcase({
                jwt,
                featurePath: getInput('filepath'),
                project: getInput('project'),
                validate: getInput('exists') === 'true'
            });
            break;
        default:
            throw new Error("❌ Comando no encontrado");
    }
}
runs();