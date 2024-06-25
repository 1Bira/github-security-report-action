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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const CodeScanningAlert_1 = __importDefault(require("./CodeScanningAlert"));
const CodeScanningResults_1 = __importDefault(require("./CodeScanningResults"));
class GitHubCodeScanning {
    constructor(octokit) {
        this.octokit = octokit;
    }
    getOpenCodeScanningAlerts(repo) {
        return getCodeScanning(this.octokit, repo, 'open');
    }
    getClosedCodeScanningAlerts(repo) {
        return getCodeScanning(this.octokit, repo, 'dismissed');
    }
}
exports.default = GitHubCodeScanning;
function getCodeScanning(octokit, repo, state) {
    const params = {
        owner: repo.owner,
        repo: repo.repo,
        state: state
    };
    return octokit.paginate('GET /repos/:owner/:repo/code-scanning/alerts', params)
        //@ts-ignore
        .then((alerts) => {
        core.info(`[✅] GET code-scanning.`);
        const results = new CodeScanningResults_1.default();
        alerts.forEach((alert) => {
            results.addCodeScanningAlert(new CodeScanningAlert_1.default(alert));
        });
        return results;
    }).catch((err) => {
        core.setFailed("[⚠️] There was an error in code-scanning. Please check the logs: " + err);
        throw err; // Lançar o erro após logar a falha
    });
}
