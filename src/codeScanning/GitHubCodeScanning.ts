import { Octokit } from '@octokit/rest';
import { CodeScanningListAlertsForRepoResponseData, Endpoints } from '@octokit/types';
import * as core from "@actions/core";
import CodeScanningAlert, { CodeScanningData } from './CodeScanningAlert';
import CodeScanningResults from './CodeScanningResults';

type listCodeScanningAlertsParameters = Endpoints['GET /repos/:owner/:repo/code-scanning/alerts']['parameters'];

type Repo = {
  owner: string,
  repo: string
}

export default class GitHubCodeScanning {

  private readonly octokit: Octokit;

  constructor(octokit) {
    this.octokit = octokit;
  }

  getOpenCodeScanningAlerts(repo: Repo): Promise<CodeScanningResults> {
    return getCodeScanning(this.octokit, repo, 'open');
  }

  getClosedCodeScanningAlerts(repo: Repo): Promise<CodeScanningResults> {
    return getCodeScanning(this.octokit, repo, 'dismissed');
  }
}

function getCodeScanning(octokit: Octokit,
                         repo: Repo,
                         state: 'open' | 'fixed' | 'dismissed'): Promise<CodeScanningResults> {

  const params: listCodeScanningAlertsParameters = {
    owner: repo.owner,
    repo: repo.repo,
    state: state
  };

  return octokit.paginate('GET /repos/:owner/:repo/code-scanning/alerts', params)
    //@ts-ignore
    .then((alerts: CodeScanningListAlertsForRepoResponseData) => {
      core.info(`[✅] GET code-scanning.`);
      const results: CodeScanningResults = new CodeScanningResults();

      alerts.forEach((alert: CodeScanningData) => {
        results.addCodeScanningAlert(new CodeScanningAlert(alert));
      });

      return results;
    })
    .catch(function(err){
      core.setFailed("[⚠️] There was an error in code-scanning. Please check the logs: " + err);
    });
}