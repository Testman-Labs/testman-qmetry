import { IFieldMaps } from "@testmanlabs/testman-feature";
import testcasefields from "../data/field_testcase.json";
import { const_fields_testcase } from "..";

const fields = {
    testcase: async (type: 'feature' | 'scenario', description: string) => {
        const fieldSystem = testcasefields.filter(e => e.type === 'public');
        if (const_fields_testcase.length > 0) { fieldSystem.push(...const_fields_testcase); }
        const fieldArray = fieldSystem.map(e => e.name);

        const fieldMap: IFieldMaps = {};
        const fieldsSplit = description.trim().split("[");
        for (const field of fieldsSplit) {
            const [key, value] = field.split("=");
            const trimmedKey = key.trim().replace("]", "");
            if (fieldArray.includes(trimmedKey) && trimmedKey && value) {

                if (trimmedKey === 'assignee' && value!) {
                    fieldMap["reporter"] = value.trim();
                }

                if (trimmedKey === 'reporter' && value!) {
                    fieldMap["assignee"] = value.trim();
                }

                fieldMap[trimmedKey] = value.trim();
            }
        }

        if (type === 'scenario') { return fieldMap; }

        for (const e of fieldSystem) {
            if (!fieldMap.hasOwnProperty(e.name)) {
                fieldMap[e.name] = e.value ?? ''; 
            }
        }
        return fieldMap;
    }
};
export { fields };