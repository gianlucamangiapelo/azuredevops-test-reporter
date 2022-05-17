//Azure test plan doc
//https://docs.microsoft.com/en-us/azure/devops/test/navigate-test-plans?view=azure-devops

import { IAzureConfig } from '../src/interfaces/IAzureConfig'
import { ITestResult } from '../src/interfaces/ITestResult'
import { createConnection } from '../src/services/azure/connection'
import { setTestResult } from '../src/services/azure/testResults'
import {
  createTestRun,
  setCompletedRun,
  setInProgressRun,
} from '../src/services/azure/testRun'
import { validate } from '../src/services/validation'

const config: IAzureConfig = {
  pat: 'vgeipg4njfmzzcuoxwb4vja3trwbyafim4x4oww7sbcfbopfb3bq',
  organizationUrl: 'https://dev.azure.com/gianlucamangiapelo',
  projectId: '3cf7dbc9-cb1e-4240-93f2-9a5960ab3945',
  planId: 12,
  suiteId: 14,
  runName: 'runName',
}
;(async (config: IAzureConfig) => {
  if (!validate(config)) {
    return 1
  }

  const azureClient = await createConnection(config)

  /*
   *
   * 1. Create test Run
   *
   */

  const testRun = await createTestRun(azureClient, config)

  /*
   *
   * 2. Set the test run in progress
   *
   */

  setInProgressRun(azureClient, config, testRun.id)

  /*
   *
   * 3. Update the results of testResults id using the ids of testCase and Results
   *
   */

  //Simulate execution end coming from testRunner framework

  const testResult: ITestResult = {
    testCaseId: '15',
    result: 'Passed',
    message: '',
  }

  await setTestResult(azureClient, config, testRun.id, testResult)

  //Simulate failing execution end coming from testRunner framework
  const testResult1: ITestResult = {
    testCaseId: '16',
    result: 'Failed',
    message: 'Is a failed test',
  }

  await setTestResult(azureClient, config, testRun.id, testResult1)

  /*
   *
   * 4. Terminate the Test run
   *
   */
  setCompletedRun(azureClient, config, testRun.id)
})(config)
