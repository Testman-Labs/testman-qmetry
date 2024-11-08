import { const_jirabase_url } from "..";
import { IJira, IValidateAuth } from "../types";
export { validate_auth };

async function validate_auth({ jira_email, jira_token }: IValidateAuth) {
    const jira = {
        email: jira_email,
        token: jira_token,
        host: const_jirabase_url
    }
    const jwt = await oauth_context(jira);
    return jwt;
};

async function oauth_context(user: IJira) {
    console.log('🔐 Autenticando...');

    const userAuth = `${user.email}:${user.token}`;
    const basicAuth: string = `Basic ${btoa(userAuth)}`;
    const host = new URL("/plugins/servlet/ac/com.infostretch.QmetryTestManager/qtm4j-test-management", user.host);

    const response = await fetch(host, {
        method: 'GET',
        headers: {
            'Authorization': basicAuth
        }
    });

    const responseText = await response.text();
    if (!response.ok) {
        throw new Error("❌ Error al obtener el token de autenticación");
    }

    const context = searchJwt(responseText);
    if (context === '') {
        throw new Error("❌ Error al obtener el token de autenticación");
    }
    return 'jwt ' + context;
}

function searchJwt(text: string) {
    const regex = /"contextJwt":"(.*?)"/;
    const match = regex.exec(text);
    return match ? match[1] : '';
}