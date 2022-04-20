"use strict";
exports.__esModule = true;
exports.itemSchema = void 0;
var mongoose_1 = require("mongoose");
exports.itemSchema = new mongoose_1.Schema({
    name: { type: String, maxLength: 50 },
    description: { type: String, maxLength: 500 }
});
var item = (0, mongoose_1.model)('Item', exports.itemSchema);
exports["default"] = item;
