"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.React = exports.SupabaseService = exports.createSupabaseService = exports.CompanySetup = exports.Chatbot = void 0;
var Chatbot_1 = require("./components/Chatbot");
Object.defineProperty(exports, "Chatbot", { enumerable: true, get: function () { return Chatbot_1.Chatbot; } });
var CompanySetup_1 = require("./components/CompanySetup");
Object.defineProperty(exports, "CompanySetup", { enumerable: true, get: function () { return CompanySetup_1.CompanySetup; } });
var supabase_1 = require("./utils/supabase");
Object.defineProperty(exports, "createSupabaseService", { enumerable: true, get: function () { return supabase_1.createSupabaseService; } });
Object.defineProperty(exports, "SupabaseService", { enumerable: true, get: function () { return supabase_1.SupabaseService; } });
var react_1 = require("react");
Object.defineProperty(exports, "React", { enumerable: true, get: function () { return __importDefault(react_1).default; } });
//# sourceMappingURL=index.js.map