"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialPrefsState = void 0;
const d3 = __importStar(require("d3"));
const initialPrefsState = {
    xDomain: [(new Date()), (new Date())],
    dayValues: [(new Date())],
    selectedDayValues: [(new Date())],
    selectedDayStrings: [""],
    dateTickValues: { date: [], scale: d3.scaleOrdinal() },
    priceRange: [0, 0],
    selectedPriceRange: [0, 0],
    stateID: 0,
    lastChange: { type: 'init' },
    nextChange: 'none',
    semiLog: false,
    firstDeriv: false,
    secondDeriv: false,
    localMins: false,
    localMaxs: false,
    showModelLines: false,
    modelLineDays: [(new Date()), (new Date()), (new Date())],
    modelLineStrings: []
};
exports.initialPrefsState = initialPrefsState;
