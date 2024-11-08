export { search_import_tc, file_import, field_qmetry, testcase_import, validate_upload, list_testcase };
declare function file_import(jwt: string, projectId: string, fileBlob: Blob): Promise<any>;
declare function field_qmetry(jwt: string, projectId: string): Promise<any>;
declare function testcase_import(jwt: string, fileId: string, projectId: string, fields: []): Promise<any>;
declare function validate_upload(jwt: string, importTC: any): Promise<any>;
declare function search_import_tc(jwt: string, taskId: string): Promise<any>;
declare function list_testcase(jwt: string, startAt: number, projectId: string): Promise<any>;
//# sourceMappingURL=request.d.ts.map