<p align="center">
    <a href="#">
        <img alt="testman-qmetry" src="https://repository-images.githubusercontent.com/885438589/0eb515aa-9df0-4ce4-922b-3498557c7b04">
    </a>
</p>

<p align="center">
    Next-gen tool to automate qmetry processes with BDD support
</p>

***

### Configure Testman

- Create a folder called settings inside .github in your test case management repository
- Copy the settings.json file from test/loader_settings to the .github/settings directory
- Configure your jirabase_url and test case custom fields in Qmetry
  
**NOTE:** Replace vars ${{ REPLACE_HERE }} in workflows

## Import TestCase Actions

Requerido en la configuración del actions use template **import_testcase.yml** 

```yaml
execute: import-testcase
settings: "./tests/loader_settings/settings.json"
username: ${{ HERE_YOUR_SECRET_KEY }}
secretkey: ${{ HERE_YOUR_SECRET_KEY }}
filepath: ${{ inputs.featurepath }}
project: ${{ inputs.project }}
exists: ${{ inputs.validate }}
```

### Feature Field Table
Public type content can be invoked in the feature

| Fields       | Default | Required | Type    |
| ------------ | ------- | -------- | ------- |
| summary      | -       | true     | private |
| steps        | -       | true     | private |
| data         | -       | true     | private |
| expect       | -       | true     | private |
| description  | -       | false    | public  |
| precondition | -       | false    | public  |
| status       | To Do   | false    | public  |
| priority     | Medium  | false    | public  |
| assignee     | -       | true     | public  |
| reporter     | -       | true     | public  |
| labels       | -       | false    | public  |
| story        | -       | false    | public  |
| fix          | -       | false    | public  |
| components   | -       | false    | public  |
| sprint       | -       | false    | public  |

**Note:** 
- Private type fields cannot be declared
- Private type fields are obtained from feature using the GWT
- If I just add assigne automatically reporter will be completed with the same value and vice versa
- There is no support for Qmetry's Estimated Time field
  
### Add new fields

If you want to add a new Qmetry custom field you must add the visual field or how it is displayed in the test cases.

Edit the settings.json you set in your working repository in .github/settings.

Add in **fields.testcase** property

```json
{
    "type": "public",
    "name": "automate",            //Invoke the field in the feature o scenario
    "value": "No",                 //Default value
    "xlsHeader": "Automate",       //Referent name by preference capitalizing the initial
    "qmetryHeader": null           //Not required but leave it null
}
```

After adding the field to invoke it in the feature or scenario

```gherkin
Feature: Example Invoce Field
    [Automate] = Yes
    
    Scenario: New Fields 1
        [Automate] = No

    Scenario: New Fields 2
        # Takes the default value of Yes

```

**Note:**  If the fields were defined in the feature, the same values ​​apply to all scenarios

### TestCase Feature Example
```gherkins
#[estimated]=00:10:05 
Feature: TEST-2208: (LOGIN) - Login con usuario y contraseña
    [description]=Es una descripcion
    [precondition]=Es una precondition
    [status]=To Do
    [priority]=High
    [assignee]=712020:de07066e-d0bd-46d7-add7-2847ec451521
    [labels]=Manual,Regression,Smoke
    [story]=TEST-2208
    [fix] = ULTRA-2024-Q2-Sprint01,SteelPulse-2024-Q2-Sprint01
    [components] = API-NE-GESTIONENDOSOS,API-NE-VIAJEHOGAR
    [sprint] = Board Pruebas DevSecOps/Board Sprint 1
    [automatizable]=No->No aplica
    [folder] = /FolderTest

    Scenario: Happy Path - Login NO ACTIVADO
        Given que me encuentro en la página
        When ingreso un correo válido "usuario@ejemplo.com"
        And ingreso una contraseña válida "mi_contraseña_secreta"
        And doy clic en "siguiente"
        Then se realiza el login exitosamente
        And soy redirigido a la pantalla principal de la app


    Scenario: Happy Path - Login VENCIDO
        Given que me encuentro en la página
        When ingreso un correo válido "usuario@ejemplo.com"
        And ingreso una contraseña válida "mi_contraseña_secreta"
        And doy clic en "siguiente"
        Then se realiza el login exitosamente
        And soy redirigido a la pantalla principal de la app

    Scenario Outline: Registro de Usuario Unico
        Given el usuario identificado como <username>,
        When se identifica en el portal,
        Then se acceso al recurso-<id>.
        Examples:
            | id | username |
            | 4  | user4    |
            | 5  | user5    |

    Scenario Outline: <id> Registro de Usuario
        Given el usuario identificado como <username>,
        When se identifica en el portal,
        Then se acceso al recurso-<id>.
        Examples:
            | id | username |
            | 1  | user1    |
            | 2  | user2    |
            | 3  | user3    |
```

## :page_facing_up: License

[MIT](/LICENSE.txt)

<p align="center">
    <a href="https://github.com/Testman-Labs/testman-qmetry">
        <img src="http://randojs.com/images/barsSmall.gif" alt="Animated footer bars" width="100%"/>
    </a>
</p>
<br/>