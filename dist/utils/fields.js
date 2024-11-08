"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fields = void 0;
const field_testcase_json_1 = __importDefault(require("../data/field_testcase.json"));
const __1 = require("..");
const fields = {
    testcase: async (type, description) => {
        const fieldSystem = field_testcase_json_1.default.filter(e => e.type === 'public');
        if (__1.const_fields_testcase.length > 0) {
            fieldSystem.push(...__1.const_fields_testcase);
        }
        const fieldArray = fieldSystem.map(e => e.name);
        const fieldMap = {};
        const fieldsSplit = description.trim().split("[");
        for (const field of fieldsSplit) {
            const [key, value] = field.split("=");
            const trimmedKey = key.trim().replace("]", "");
            if (fieldArray.includes(trimmedKey) && trimmedKey && value) {
                if (trimmedKey === 'assignee' && value) {
                    fieldMap["reporter"] = value.trim();
                }
                if (trimmedKey === 'reporter' && value) {
                    fieldMap["assignee"] = value.trim();
                }
                fieldMap[trimmedKey] = value.trim();
            }
        }
        if (type === 'scenario') {
            return fieldMap;
        }
        for (const e of fieldSystem) {
            if (!fieldMap.hasOwnProperty(e.name)) {
                fieldMap[e.name] = e.value ?? '';
            }
        }
        return fieldMap;
    }
};
exports.fields = fields;
