"use strict";
exports.__esModule = true;
exports.characterGenderSchema = void 0;
var mongoose_1 = require("mongoose");
exports.characterGenderSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String },
    description: { type: String }
});
