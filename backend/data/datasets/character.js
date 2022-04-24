"use strict";
exports.__esModule = true;
exports.characterSchema = void 0;
var mongoose_1 = require("mongoose");
exports.characterSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String },
    userId: { type: String },
    dungeonId: { type: String },
    characterClass: { type: String },
    characterSpezies: { type: String },
    characterGender: { type: String },
    maxStats: { type: mongoose_1.Schema.Types.Mixed },
    currentStats: { type: mongoose_1.Schema.Types.Mixed },
    position: { type: String },
    inventory: [{ type: String }]
});
