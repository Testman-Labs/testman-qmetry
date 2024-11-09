## Import Test Case

To use the actions of **import_testcase.yml** some configurations are required.

### Actions

Values ​​required for the actions to function.

```yaml
execute: import-testcase
settings: "./tests/loader_settings/settings.json"
username: ${{ HERE_YOUR_SECRET_KEY }}
secretkey: ${{ HERE_YOUR_SECRET_KEY }}
filepath: ${{ inputs.featurepath }}
project: ${{ inputs.project }}
exists: ${{ inputs.validate }}
```

### Supported Fields

Only fields of type public can be declared as fields in the .feature file.

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

**Important**

- Private type fields cannot be declared.
- Private type fields are obtained by functions that use GWT.
- If the *assignee* field is filled, the *reporter* field will be filled automatically. The same will happen if the reporter field is completed.
- Qmetry's “Estimated time” field is not supported due to compatibility issues

### Add new field

To add a new custom field registered in Qmetry, you need to follow a few simple steps:

Edit the settings.json file you configured in your working repository in **.github/settings/settings.json**

In the **fields.testcase** property add the following

```json
{
    "type": "public",              //Default value
    "name": "automate",            //Call field
    "value": "No",                 //Default value
    "xlsHeader": "Automate",       //Referent field in Qmetry
    "qmetryHeader": null           //Default value
}
```

After adding the field to invoke it in the feature or scenario

```gherkin
Feature: Example Invoce Field
    [automate] = Yes
    
    Scenario: New Fields 1
        [automate] = No

    Scenario: New Fields 2
        # Takes the default value of Yes

```
**Note:**  If the fields were defined in the feature, the same values ​​apply to all scenarios

### Example of use

First you need to work with feature type files

- The rule is simple and easy if all the fields were defined in Feature they will be inherited in the scenario.
- If a field is defined in the Scenario it is not inherited to the feature
- If no field was defined in Feature or Scenario by default, status and priority will be returned with their default values.
- 
#### Case 1: Feature a Scenario

A practical example is presented for this case.

```gherkin
Feature: TEST-2208: (LOGIN) - Login con usuario y contraseña
    [description]=Lorem ipsum description
    [precondition]=Lorem ipsum precondition
    [status]=To Do
    [priority]=High
    [assignee]=818189:ed07188a-d0dd-46d9-adb7-2549rs452327
    [labels]=Manual,Regression,Smoke
    [story]=TEST-2208
    [fix]=ULTRA-Sprint01,Reggue-Sprint01
    [components]=API-TEST1,API-TEST2
    [sprint]=Board Pruebas/Board Sprint 1
    [folder]=/FolderTest
 
    Scenario: Happy Path - Login Success
        Given that I find myself on the page
        When I enter a valid email "user@example.com"
        And enter a valid password "my_secret_password"
        And I click "next"
        Then the login is done successfully
        And I am redirected to the main screen of the app

    Scenario: Happy Path - Login Fail
        Given that I find myself on the page
        When I enter a valid email "user@example.com"
        And enter a valid password "my_secret_password2"
        And I click "next"
        Then the login is done failed
        And I am redirected to the main login of the app 
```

The output of the fields for the scenarios would be the same

```json
//Scenario Out Fields
{
    "description": "Lorem ipsum description",
    "precondition": "Lorem ipsum precondition",
    "status": "To Do",
    "priority": "High",
    "assignee": "818189:ed07188a-d0dd-46d9-adb7-2549rs452327",
    "labels": "Manual,Regression,Smoke",
    "story": "TEST-2208",
    "fix": "ULTRA-Sprint01,Reggue-Sprint01",
    "components": "API-TEST1,API-TEST2",
    "sprint": "Board Pruebas/Board Sprint 1",
    "folder": "/FolderTest"
}
```

### Case 2: Scenario defines fields

The example is presented if you add fields to the scenario. The feature fields are optional for this case

```gherkin
Feature: TEST-2208: (LOGIN) - Login con usuario y contraseña
    [description]=Lorem ipsum description
    [precondition]=Lorem ipsum precondition
    [status]=To Do
    [priority]=High
    [assignee]=818189:ed07188a-d0dd-46d9-adb7-2549rs452327
    [labels]=Manual,Regression,Smoke
    [story]=TEST-2208
    [fix]=ULTRA-Sprint01,Reggue-Sprint01
 
    Scenario: Happy Path - Login Success
        [components]=API-TEST1
        [sprint]=Board Pruebas/Board Sprint 1
        [folder]=/FolderTestSuccess
 
        Given that I find myself on the page
        When I enter a valid email "user@example.com"
        And enter a valid password "my_secret_password"
        And I click "next"
        Then the login is done successfully
        And I am redirected to the main screen of the app

    Scenario: Happy Path - Login Fail
        [components]=API-TEST2
        [sprint]=Board Pruebas/Board Sprint 2
        [folder]=/FolderTestFailed

        Given that I find myself on the page
        When I enter a valid email "user@example.com"
        And enter a valid password "my_secret_password2"
        And I click "next"
        Then the login is done failed
        And I am redirected to the main login of the app 
```

The output fields for the scenarios are different

```json
//Scenario Out Fields - Login Success
{
    "description": "Lorem ipsum description",
    "precondition": "Lorem ipsum precondition",
    "status": "To Do",
    "priority": "High",
    "assignee": "818189:ed07188a-d0dd-46d9-adb7-2549rs452327",
    "labels": "Manual,Regression,Smoke",
    "story": "TEST-2208",
    "fix": "ULTRA-Sprint01,Reggue-Sprint01",
    "components": "API-TEST1",
    "sprint": "Board Pruebas/Board Sprint 1",
    "folder": "/FolderTestSuccess"
}

//Scenario Out Fields - Login Failes
{
    "description": "Lorem ipsum description",
    "precondition": "Lorem ipsum precondition",
    "status": "To Do",
    "priority": "High",
    "assignee": "818189:ed07188a-d0dd-46d9-adb7-2549rs452327",
    "labels": "Manual,Regression,Smoke",
    "story": "TEST-2208",
    "fix": "ULTRA-Sprint01,Reggue-Sprint01",
    "components": "API-TEST2",
    "sprint": "Board Pruebas/Board Sprint 2",
    "folder": "/FolderTestFailed"
}
```

**Note:** You can define the fields as much as the feature and scenario complement each other. Just remembering that each field defined in the scenario will be unique to those test cases.