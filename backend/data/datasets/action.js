"use strict";
exports.__esModule = true;
exports.actionSchema = void 0;
var mongoose_1 = require("mongoose");
exports.actionSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    command: { type: String, required: true, unique: true },
    output: { type: String },
    description: { type: String },
    events: [{ type: mongoose_1.Schema.Types.Mixed }],
    itemsneeded: [{ type: String }]
});
