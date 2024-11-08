# Testman for Qmetry

Support tool to automate qmetry process.

- Mass import of test cases
- Generate matrix of test cases.
- Generate test cycle report.

**Test on Local**
1. Replace vars ${{ REPLACE_HERE }}
2. act workflow_dispatch -j import_testcase -e ./.act/import_testcase.json

## Install for TestCase
1. Create a folder called testman-qmetry inside .github
2. Copy or the .env to configure JIRABASE_URL inside testman-qmetry 
3. Copy the resources default fields field_testcase.json to the testman-qmetry folder
4. Add the custom fields from your qmetry configuration to the field_testcase.json in the testcase table
   
## Commands
1. Test Case Import
```yaml
    execute: import-testcase
    username: example@example.com
    secretkey: ************
    feature_path: ./
    projectId: 10329:Example
    tcsync: true | false
```
