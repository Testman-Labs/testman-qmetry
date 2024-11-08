export interface IImportTestcase {
    jwt: string;
    featurePath: string;
    project: string;
    validate?: boolean;
}

export interface IValidateAuth {
    jira_email: string;
    jira_token: string;
}

export interface IJira {
    host: string;
    email: string;
    token: string;
}

export interface ISettigns {
    constanst: {
        jirabase_url: string;
    };
    fields: {
        testcase: IFieldTestcase[];
    };
}

export interface IFieldTestcase {
    type: string;
    name: string;
    value: string;
    xlsHeader: string;
    qmetryHeader: string;
}