import { file_import, testcase_import, validate_upload } from '../utils/request';
import { generate_blob, procesar_field, procesar_field_qmetry, procesar_testcase, validar_existencias } from '../utils';
import { FeatureToJSON, IFeatureToJSON } from '@testmanlabs/testman-feature';
import { IImportTestcase } from '../types';
import { existsSync } from 'fs';
export { import_testcase };

async function import_testcase({ jwt, featurePath, project, validate }: IImportTestcase) {
    try {
        console.log({
            featurePath,
            project,
            validate
        })
        if (!featurePath || !featurePath.endsWith(".feature") ) {
            throw new Error("❌ El archivo debe ser un archivo .feature");
        }

        if (!existsSync(featurePath)) {
            throw new Error("❌ El archivo no existe");
        }

        console.log("✅ Archivo .feature válido. Procesando...");
        const projectId = project.split(":")[0];
        if (validate) {
            const total_test = await procesar_testcase(jwt, projectId);

            let document = FeatureToJSON(featurePath);
            document = await validar_existencias(document, total_test);

            if (document.elements.length > 0) {
                await procesar_import(jwt, projectId, document);
            } else {
                throw new Error("❌ No se encontraron testcases para importar");
            }
        } else {
            let document = FeatureToJSON(featurePath);
            await procesar_import(jwt!, projectId, document);
        }   
    } catch (error) {
        console.error("❌ Error al importar el caso de prueba:", error);
        throw error;
    }
}

async function procesar_import(jwt: string, projectId: string, document: IFeatureToJSON) {
    document = await procesar_field(document);
    const fileBlob = await generate_blob(document, false);

    const fileImport = await file_import(jwt, projectId, fileBlob!);
    const fields = await procesar_field_qmetry(jwt, projectId, fileImport);
    const importTC = await testcase_import(jwt, fileImport?.data.fileId, projectId, fields);

    await validate_upload(jwt, importTC);
    console.log("✅ Importación completada con éxito.");
} 
