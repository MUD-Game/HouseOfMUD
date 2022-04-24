"use strict";
exports.__esModule = true;
exports.itemSchema = void 0;
var mongoose_1 = require("mongoose");
exports.itemSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String },
    description: { type: String }
});
