"use strict";
exports.__esModule = true;
exports.actionSchema = void 0;
var mongoose_1 = require("mongoose");
exports.actionSchema = new mongoose_1.Schema({
    command: { type: String, required: true, unique: true, maxLength: 15 },
    output: { type: String, maxLength: 500 },
    description: { type: String, maxLength: 500 },
    events: { type: [mongoose_1.Schema.Types.ObjectId], ref: 'ActionEvent', required: true },
    itemsneeded: { type: [mongoose_1.Schema.Types.ObjectId], ref: 'Item' }
});
var action = (0, mongoose_1.model)('Action', exports.actionSchema);
exports["default"] = action;
