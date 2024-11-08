import { IFeatureToJSON } from "@testmanlabs/testman-feature";
export declare function procesar_field(doc: IFeatureToJSON): Promise<IFeatureToJSON>;
export declare function procesar_field_qmetry(jwt: string, projectId: string, fileImport: any): Promise<any>;
export declare function generate_blob(document: IFeatureToJSON, generateFile: boolean): Promise<Blob | null>;
export declare function procesar_testcase(jwt: string, projectId: string): Promise<any[]>;
export declare function validar_existencias(document: IFeatureToJSON, total_test: any[]): Promise<IFeatureToJSON>;
//# sourceMappingURL=index.d.ts.map