"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.DatabaseAdapter = void 0;
var mongoose = require("mongoose");
var action_1 = require("./datasets/action");
var character_1 = require("./datasets/character");
var characterClass_1 = require("./datasets/characterClass");
var characterGender_1 = require("./datasets/characterGender");
var characterSpecies_1 = require("./datasets/characterSpecies");
var dungeon_1 = require("./datasets/dungeon");
var item_1 = require("./datasets/item");
var npc_1 = require("./datasets/npc");
var room_1 = require("./datasets/room");
var user_1 = require("./datasets/user");
/**
 * encapsulation of the mongoose API
 */
var DatabaseAdapter = /** @class */ (function () {
    function DatabaseAdapter(connectionString) {
        this.connection = mongoose.createConnection(connectionString);
        this.item = this.connection.model('Item', item_1.itemSchema);
        this.action = this.connection.model('Action', action_1.actionSchema);
        this.character = this.connection.model('Character', character_1.characterSchema);
        this.characterClass = this.connection.model('CharacterClass', characterClass_1.characterClassSchema);
        this.characterGender = this.connection.model('CharacterGender', characterGender_1.characterGenderSchema);
        this.characterSpecies = this.connection.model('CharacterSpecies', characterSpecies_1.characterSpeciesSchema);
        this.dungeon = this.connection.model('Dungeon', dungeon_1.dungeonSchema);
        this.npc = this.connection.model('Npc', npc_1.npcSchema);
        this.room = this.connection.model('Room', room_1.roomSchema);
        this.user = this.connection.model('User', user_1.userSchema);
    }
    /**
     * store a dungeon inside the 'dungeons' Collection of the connection
     * @param dungeonToStore the 'Dungeon' dataset that contains all information of the dungeon
     */
    DatabaseAdapter.prototype.storeDungeon = function (dungeonToStore) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = (_a = this.dungeon).create;
                        _c = {
                            id: dungeonToStore.id,
                            name: dungeonToStore.name,
                            description: dungeonToStore.description,
                            creatorId: dungeonToStore.creatorId,
                            masterId: dungeonToStore.masterId,
                            maxPlayers: dungeonToStore.maxPlayers,
                            currentPlayers: dungeonToStore.currentPlayers,
                            blacklist: dungeonToStore.blacklist
                        };
                        return [4 /*yield*/, this.character.insertMany(dungeonToStore.characters)];
                    case 1:
                        _c.characters = _d.sent();
                        return [4 /*yield*/, this.characterClass.insertMany(dungeonToStore.characterClasses)];
                    case 2:
                        _c.characterClasses = _d.sent();
                        return [4 /*yield*/, this.characterSpecies.insertMany(dungeonToStore.characterSpecies)];
                    case 3:
                        _c.characterSpecies = _d.sent();
                        return [4 /*yield*/, this.characterGender.insertMany(dungeonToStore.characterGender)];
                    case 4:
                        _c.characterGender = _d.sent();
                        return [4 /*yield*/, this.room.insertMany(dungeonToStore.rooms)];
                    case 5:
                        _c.rooms = _d.sent();
                        return [4 /*yield*/, this.item.insertMany(dungeonToStore.items)];
                    case 6:
                        _c.items = _d.sent();
                        return [4 /*yield*/, this.npc.insertMany(dungeonToStore.npcs)];
                    case 7:
                        _c.npcs = _d.sent();
                        return [4 /*yield*/, this.action.insertMany(dungeonToStore.actions)];
                    case 8:
                        _b.apply(_a, [(_c.actions = _d.sent(),
                                _c)]);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * get a dungeon from the 'dungeons' Collection in the Mongo database
     * @param id the id of the dungeon to get
     * @returns complete dungeon dataset with all sub objects
     */
    DatabaseAdapter.prototype.getDungeon = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var foundDungeon;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.dungeon.findOne({ id: id })];
                    case 1:
                        foundDungeon = _b.sent();
                        _a = {
                            id: foundDungeon.id,
                            name: foundDungeon.name,
                            description: foundDungeon.description,
                            creatorId: foundDungeon.description,
                            masterId: foundDungeon.masterId,
                            maxPlayers: foundDungeon.maxPlayers,
                            currentPlayers: foundDungeon.currentPlayers,
                            blacklist: foundDungeon.blacklist
                        };
                        return [4 /*yield*/, foundDungeon.populate('characters')];
                    case 2:
                        _a.characters = (_b.sent()).characters;
                        return [4 /*yield*/, foundDungeon.populate('characterClasses')];
                    case 3:
                        _a.characterClasses = (_b.sent()).characterClasses;
                        return [4 /*yield*/, foundDungeon.populate('characterSpecies')];
                    case 4:
                        _a.characterSpecies = (_b.sent()).characterSpecies;
                        return [4 /*yield*/, foundDungeon.populate('characterGender')];
                    case 5:
                        _a.characterGender = (_b.sent()).characterGender;
                        return [4 /*yield*/, foundDungeon.populate('rooms')];
                    case 6:
                        _a.rooms = (_b.sent()).rooms;
                        return [4 /*yield*/, foundDungeon.populate('items')];
                    case 7:
                        _a.items = (_b.sent()).items;
                        return [4 /*yield*/, foundDungeon.populate('npcs')];
                    case 8:
                        _a.npcs = (_b.sent()).npcs;
                        return [4 /*yield*/, foundDungeon.populate('actions')];
                    case 9: return [2 /*return*/, (_a.actions = (_b.sent()).actions,
                            _a)];
                }
            });
        });
    };
    /**
     * get the needed dungeon information for the supervisor
     * @param id the id of the dungeon to get the information from
     * @returns the dungeon information (id, name, description, creatorId, masterId, maxPlayers, currentPlayers)
     */
    DatabaseAdapter.prototype.getDungeonInfo = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dungeon.findOne({ id: id }, 'id name description creatorId masterId maxPlayers currentPlayers')];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    /**
     * get the dungeon information for the supervisor from all existing dungeons
     * @returns an array of the dungeon information (id, name, description, creatorId, masterId, maxPlayers, currentPlayers)
     */
    DatabaseAdapter.prototype.getAllDungeonInfos = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dungeon.find({}, 'id name description creatorId masterId maxPlayers currentPlayers')];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    return DatabaseAdapter;
}());
exports.DatabaseAdapter = DatabaseAdapter;
