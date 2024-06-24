import ReportGenerator from './ReportGenerator';

import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';

async function run(): Promise<void> {
  try {
    core.info(`[✅] Start Action]`);
    const token = getRequiredInputValue('token');

    core.info(`[✅] Report Generator]`);
    const generator = new ReportGenerator({
      repository: getRequiredInputValue('repository'),
      octokit: new Octokit({auth: token}),
      
      sarifReportDirectory: getRequiredInputValue('sarifReportDir'),
      outputDirectory: getRequiredInputValue('outputDir'),

      templating: {
        name: 'summary'
      }
    });

    const file = await generator.run();
    console.log(file);
    core.info(`[✅] End Action]`);
  } catch (err) {
    core.warning(`Error: ${err.message}`);
    core.setFailed(err.message);
  }
}

run();

function getRequiredInputValue(key: string): string {
  return core.getInput(key, {required: true});
}
