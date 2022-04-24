"use strict";
exports.__esModule = true;
exports.npcSchema = void 0;
var mongoose_1 = require("mongoose");
exports.npcSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, maxLength: 50 },
    description: { type: String, maxLength: 500 },
    species: { type: String, maxLength: 50 }
});
