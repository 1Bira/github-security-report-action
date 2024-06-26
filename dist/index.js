"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReportGenerator_1 = __importDefault(require("./ReportGenerator"));
const core = __importStar(require("@actions/core"));
const rest_1 = require("@octokit/rest");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            core.info(`[✅] Start Action]`);
            const token = getRequiredInputValue('token');
            core.info(`[✅] Report Generator]`);
            const generator = new ReportGenerator_1.default({
                repository: getRequiredInputValue('repository'),
                octokit: new rest_1.Octokit({ auth: token }),
                sarifReportDirectory: getRequiredInputValue('sarifReportDir'),
                outputDirectory: getRequiredInputValue('outputDir'),
                templating: {
                    name: 'summary'
                }
            });
            const file = yield generator.run();
            console.log(file);
            core.info(`[✅] End Action]`);
        }
        catch (err) {
            core.warning(`Error: ${err.message}`);
            core.setFailed(`[⚠️] Error: ${err.message}`);
        }
    });
}
run();
function getRequiredInputValue(key) {
    return core.getInput(key, { required: true });
}
