"use strict";
exports.__esModule = true;
exports.actionEventSchema = void 0;
var mongoose_1 = require("mongoose");
exports.actionEventSchema = new mongoose_1.Schema({
    eventType: { type: String, required: true },
    value: { type: String, required: true }
});
var actionEvent = (0, mongoose_1.model)('ActionEvent', exports.actionEventSchema);
exports["default"] = actionEvent;
