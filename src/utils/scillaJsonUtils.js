/* eslint-disable lines-around-directive */
/* eslint-disable object-shorthand */
/* eslint-disable one-var */
/* eslint-disable camelcase */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-cond-assign */
/* eslint-disable no-void */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-multi-assign */
// eslint-disable-next-line strict
"use strict";
/*
 * Copyright (C) 2021 Zilliqa
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJSONParams = exports.getJSONValue = exports.extractTypes = void 0;
var extractTypes = (type) => {
    var count = 0;
    var startIndex = -1;
    var result = [];
    // eslint-disable-next-line no-plusplus
    for (var i = 0; i < type.length; i++) {
        var c = type[i];
        if (c === "(") {
            count += 1;
            if (count === 1 && startIndex === -1) {
                startIndex = i + 1;
            }
        }
        else if (c === ")") {
            count -= 1;
            if (count === 0) {
                result.push(type.slice(startIndex, i));
                // reset
                startIndex = -1;
            }
        }
    }
    return result;
};
exports.extractTypes = extractTypes;
var getJSONValue = (value, type) => {
    var _a;
    // User-defined ADT
    if (typeof type === "string" && type.startsWith("0x")) {
        var arr = type.split(".");
        var contractAddress = (_a = arr[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        var contructorName = arr[2];
        // eslint-disable-next-line prefer-arrow-callback
        var structIndex = arr.findIndex( (x) => x === "of");
        var values = [];
        if (structIndex !== -1) {
            var structTypes = arr.slice(structIndex + 1);
            values = structTypes.map((t, i) => (0, exports.getJSONValue)(value[i], t));
        }
        return {
            argtypes: [],
            arguments: values,
            constructor: "".concat(contractAddress, ".").concat(contructorName),
        };
    }
    if (typeof type === "string" && type.startsWith("Uint")) {
        return value.toString();
    }
    if (typeof type === "string" && type.startsWith("Int")) {
        return value.toString();
    }
    if (type === "String") {
        return value;
    }
    if (typeof type === "string" &&
        type.startsWith("ByStr") &&
        typeof value === "string") {
        return value.toLowerCase();
    }
    if (type === "BNum") {
        return value.toString();
    }
    if (typeof value === "boolean") {
        return {
            argtypes: [],
            arguments: [],
            constructor: value ? "True" : "False",
        };
    }
    if (typeof type === "string" && type.startsWith("Option")) {
        var types = (0, exports.extractTypes)(type);
        return {
            argtypes: types,
            arguments: value === undefined ? [] : [(0, exports.getJSONValue)(value, types[0])],
            constructor: value === undefined ? "None" : "Some",
        };
    }
    if (typeof type === "string" &&
        type.startsWith("List") &&
        Array.isArray(value)) {
        return value.map((x) => (0, exports.getJSONValue)(x, (0, exports.extractTypes)(type)[0]));
    }
    if (typeof type === "string" &&
        type.startsWith("Pair") &&
        Array.isArray(value)) {
        var types_1 = (0, exports.extractTypes)(type);
        return {
            argtypes: types_1,
            arguments: value.map((x, i) => (0, exports.getJSONValue)(x, types_1[i])),
            constructor: "Pair",
        };
    }
    return value;
};
exports.getJSONValue = getJSONValue;
var getJSONParams = (obj) => {
    var result = Object.keys(obj).map((vname) => {
        var _a;
        var _b = obj[vname], type = _b[0], value = _b[1];
        if (typeof type === "string" && type.startsWith("0x")) {
            var arr = type.split(".");
            var contractAddress = (_a = arr[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            var typeName = arr[1];
            return {
                type: "".concat(contractAddress, ".").concat(typeName),
                value: (0, exports.getJSONValue)(value, type),
                // eslint-disable-next-line object-shorthand
                vname: vname,
            };
        }
        return {
            type,
            value: (0, exports.getJSONValue)(value, type),
            vname: vname,
        };
    });
    return result;
};
exports.getJSONParams = getJSONParams;
