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
      // Failed result is dominant and will not be overwritten by passed result of other test
      if (test.outcome !== 'Failed') {
        test.outcome = testResult.result
      }

      // Adds result of failed test to comment
      if (testResult.result === 'Failed') {
        test.comment = `${test.comment !== undefined ? test.comment : ''}${
          testResult.message
        } `.substring(0, 1000)
      }

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
