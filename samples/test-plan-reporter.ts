//Azure test plan doc
//https://docs.microsoft.com/en-us/azure/devops/test/navigate-test-plans?view=azure-devops

import { IAzureConfig } from '../src/interfaces/IAzureConfig'
import { ITestResult } from '../src/interfaces/ITestResult'
import { AzureTestPlanReporter } from '../src/index'

const config: IAzureConfig = {
  pat: '{Your Azure Devops personal access token}',
  organizationUrl: 'https://dev.azure.com/{organizationName}',
  projectId: '{Your Azure Devops Project id}',
  planId: 12,
  suiteId: 14,
  runName: '{Name that is assigned to the test Run}',
}
;(async (config: IAzureConfig) => {
  const reporter = new AzureTestPlanReporter(config)

  /*
   *
   * 1. Create and Start test Run
   *
   */
  await reporter.init()

  await reporter.starTestRun()

  /*
   *
   * 2. Update the results of testResults id using the ids of testCase and Results
   *
   */

  //Simulate execution end coming from testRunner framework

  const testResult: ITestResult = {
    testCaseId: '15',
    result: 'Passed',
    message: '',
  }

  await reporter.sendTestResult(testResult)

  //Simulate failing execution end coming from testRunner framework
  const testResult1: ITestResult = {
    testCaseId: '16',
    result: 'Failed',
    message: 'Is a failed test',
  }

  await reporter.sendTestResult(testResult1)

  /*
   *
   * 3. Terminate the Test run
   *
   */
  reporter.stopTestRun()
})(config)
