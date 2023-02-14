"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBuilder = exports.updateBetweenBuilder = exports.updateBuilder = exports.insertBuilder = exports.selectBuilder = void 0;
var errorGenerator_1 = __importDefault(require("../utils/errorGenerator"));
var camelToUnderscore = function (key) {
    return key.replace(/([A-Z])/g, '_$1').toLowerCase();
};
var convertObjKeysToSnakeCase = function (obj) {
    var newObj = {};
    for (var camel in obj) {
        if (obj[camel] !== null) {
            newObj[camelToUnderscore(camel)] = obj[camel];
        }
    }
    return newObj;
};
var buildSqlParamsForSelect = function (inquiryColumn) {
    if (inquiryColumn[0] === 'all') {
        return '*';
    }
    return inquiryColumn.join(",");
};
var buildSqlParamsForInsert = function (obj) {
    var convertedObj = convertObjKeysToSnakeCase(obj);
    var setParams = [];
    var setValues = [];
    var entries = Object.entries(convertedObj);
    entries.forEach(function (entry) {
        setParams.push("".concat(entry[0]));
    });
    entries.forEach(function (entry) {
        setValues.push("\"".concat(entry[1], "\""));
    });
    setParams.join(",");
    setValues.join(",");
    return setParams + ') VALUES (' + setValues;
};
var buildSqlParamsForUpdate = function (obj) {
    var convertedObj = convertObjKeysToSnakeCase(obj);
    var resultArr = [];
    var entries = Object.entries(convertedObj);
    entries.forEach(function (entry) {
        resultArr.push("".concat(entry[0], " = \"").concat(entry[1], "\""));
    });
    return resultArr.join(', ');
};
var buildSqlParamsForDelete = function (obj, condition) {
    var convertedObj = convertObjKeysToSnakeCase(obj);
    var resultArr = [];
    var entries = Object.entries(convertedObj);
    entries.forEach(function (entry) {
        resultArr.push("".concat(entry[0], " = \"").concat(entry[1], "\""));
    });
    if (condition === 'AND' || condition === 'OR') {
        resultArr.join(" ".concat(condition, " "));
    }
    return resultArr;
};
var buildInquiryOpt = function (inquiryOpt, condition) {
    if (inquiryOpt === void 0) { inquiryOpt = {}; }
    if (condition === void 0) { condition = ''; }
    var inquiryOptQuery = '';
    if (Object.keys(inquiryOpt).length > 1 &&
        condition !== 'AND' &&
        condition !== 'OR') {
        (0, errorGenerator_1.default)({
            message: 'INVALID buildInquiryOpt Condition',
            statusCode: 400,
        });
    }
    if (Object.keys(inquiryOpt).length !== 0) {
        var convertedObj = convertObjKeysToSnakeCase(inquiryOpt);
        var resultArr_1 = [];
        var entries = Object.entries(convertedObj);
        entries.forEach(function (entry) {
            resultArr_1.push("".concat(entry[0], " = \"").concat(entry[1], "\""));
        });
        inquiryOptQuery = "\nWHERE " + "".concat(resultArr_1.join(" ".concat(condition, " ")));
    }
    return inquiryOptQuery;
};
var selectBuilder = function (inquiryColumn, table, inquiryOpt, optCondition) {
    if (inquiryOpt === void 0) { inquiryOpt = {}; }
    if (optCondition === void 0) { optCondition = ''; }
    var query = "SELECT ".concat(buildSqlParamsForSelect(inquiryColumn), "\nFROM ").concat(table) +
        "".concat(buildInquiryOpt(inquiryOpt, optCondition)) +
        ";";
    return query;
};
exports.selectBuilder = selectBuilder;
var insertBuilder = function (data, table) {
    var query = "\n    INSERT INTO ".concat(table, " (\n      ").concat(buildSqlParamsForInsert(data), "\n    );\n  ");
    return query;
};
exports.insertBuilder = insertBuilder;
var updateBuilder = function (inquiryId, data, table) {
    var query = "\n    UPDATE ".concat(table, " SET ").concat(buildSqlParamsForUpdate(data), " WHERE id = ").concat(inquiryId, ";");
    return query;
};
exports.updateBuilder = updateBuilder;
var updateBetweenBuilder = function (inquiryId, data, table) {
    var query = "\n    UPDATE ".concat(table, " SET ").concat(buildSqlParamsForUpdate(data), " \n    WHERE id = ").concat(inquiryId, "\n    AND\n    WHERE id BETWEEN \n  ;");
    return query;
};
exports.updateBetweenBuilder = updateBetweenBuilder;
var deleteBuilder = function (data, table, condition) {
    var query = "\n    DELETE FROM ".concat(table, " WHERE ").concat(buildSqlParamsForDelete(data, condition), ";\n  ");
    return query;
};
exports.deleteBuilder = deleteBuilder;
