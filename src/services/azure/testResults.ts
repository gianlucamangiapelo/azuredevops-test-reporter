import { ITestApi } from 'azure-devops-node-api/TestApi'
import { IAzureConfig } from '../../interfaces/IAzureConfig'
import * as TestInterfaces from 'azure-devops-node-api/interfaces/TestInterfaces'
import { ITestResult } from '../../interfaces/ITestResult'

async function _getTestsInRun(
  azureClient: ITestApi,
  azureConfig: IAzureConfig,
  testRunId: number
): Promise<TestInterfaces.TestCaseResult[]> {
  return azureClient.getTestResults(azureConfig.projectId, testRunId)
}

export async function setTestResult(
  azureClient: ITestApi,
  azureConfig: IAzureConfig,
  testRunId: number,
  testResult: ITestResult
): Promise<TestInterfaces.TestCaseResult[]> {
  const testsInRun = await _getTestsInRun(azureClient, azureConfig, testRunId)

  if (!testsInRun.length) {
    new Error(`no tests founded in testRun with id ${testRunId}`)
  }

  const updatedResult = testsInRun.filter((test) => {
    if (test.testCase?.id === testResult.testCaseId) {
      test.outcome = testResult.result
      test.comment = testResult.message
      test.state = 'Completed'
      return test
    }
  })

  return azureClient.updateTestResults(
    updatedResult,
    azureConfig.projectId,
    testRunId
  )
}
