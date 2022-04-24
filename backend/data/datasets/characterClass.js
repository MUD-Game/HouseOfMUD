"use strict";
exports.__esModule = true;
exports.characterClassSchema = void 0;
var mongoose_1 = require("mongoose");
exports.characterClassSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String },
    description: { type: String },
    maxStats: { type: mongoose_1.Schema.Types.Mixed },
    startStats: { type: mongoose_1.Schema.Types.Mixed }
});
