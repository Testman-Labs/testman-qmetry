"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate_auth = validate_auth;
const __1 = require("..");
async function validate_auth({ jira_email, jira_token }) {
    const jira = {
        email: jira_email,
        token: jira_token,
        host: __1.const_jirabase_url
    };
    const jwt = await oauth_context(jira);
    return jwt;
}
;
async function oauth_context(user) {
    console.log('🔐 Autenticando...');
    const userAuth = `${user.email}:${user.token}`;
    const basicAuth = `Basic ${btoa(userAuth)}`;
    const host = new URL("/plugins/servlet/ac/com.infostretch.QmetryTestManager/qtm4j-test-management", user.host);
    const response = await fetch(host, {
        method: 'GET',
        headers: {
            'Authorization': basicAuth
        }
    });
    const responseText = await response.text();
    if (!response.ok) {
        console.error("❌ Error al obtener el token de autenticación");
        console.error(responseText);
        return;
    }
    const context = searchJwt(responseText);
    if (context === '') {
        console.error("❌ Error al obtener el token de autenticación");
        return;
    }
    return 'jwt ' + context;
}
function searchJwt(text) {
    const regex = /"contextJwt":"(.*?)"/;
    const match = regex.exec(text);
    return match ? match[1] : '';
}
