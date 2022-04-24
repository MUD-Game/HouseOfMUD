"use strict";
exports.__esModule = true;
exports.dungeonSchema = void 0;
var mongoose_1 = require("mongoose");
exports.dungeonSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, maxLength: 50 },
    description: { type: String },
    creatorId: { type: String },
    masterId: { type: String },
    maxPlayers: { type: Number },
    currentPlayers: { type: Number },
    characters: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Character" }],
    characterClasses: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "CharacterClass" }],
    characterSpecies: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "CharacterSpecies" }],
    characterGender: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "CharacterGender" }],
    rooms: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Room" }],
    items: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Item" }],
    npcs: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Npc" }],
    blacklist: [{ type: String }],
    actions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Action" }]
});
