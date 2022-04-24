"use strict";
exports.__esModule = true;
exports.roomSchema = void 0;
var mongoose_1 = require("mongoose");
exports.roomSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String },
    description: { type: String },
    npcs: [{ type: String }],
    items: [{ type: String }],
    connections: { type: mongoose_1.Schema.Types.Mixed },
    actions: [{ type: String }],
    xCoordinate: { type: Number },
    yCoordinate: { type: Number }
});
