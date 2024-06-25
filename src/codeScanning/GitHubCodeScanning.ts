import { Octokit } from '@octokit/rest';
import { Repo, CodeScanningResults, CodeScanningAlert, CodeScanningData } from './types'; // Certifique-se de que estes tipos estão corretamente definidos e importados
import * as core from '@actions/core';

interface ListCodeScanningAlertsParameters {
  owner: string;
  repo: string;
  state: 'open' | 'fixed' | 'dismissed';
}

interface CodeScanningListAlertsForRepoResponseData extends Array<CodeScanningData> {}

async function getCodeScanning(
  octokit: Octokit,
  repo: Repo,
  state: 'open' | 'fixed' | 'dismissed'
): Promise<CodeScanningResults> {
  const params: ListCodeScanningAlertsParameters = {
    owner: repo.owner,
    repo: repo.repo,
    state: state
  };

  try {
    const alerts: CodeScanningListAlertsForRepoResponseData = await octokit.paginate(
      'GET /repos/:owner/:repo/code-scanning/alerts',
      params
    );

    core.info(`[✅] GET code-scanning.`);

    const results = new CodeScanningResults();

    alerts.forEach((alert: CodeScanningData) => {
      results.addCodeScanningAlert(new CodeScanningAlert(alert));
    });

    return results;
  } catch (err) {
    core.setFailed("[⚠️] There was an error in code-scanning. Please check the logs: " + err);
    throw err; // Lançar o erro após logar a falha
  }
}
