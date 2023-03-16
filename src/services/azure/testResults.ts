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
  if (!azureClient || !Object.keys(azureClient).length) {
    throw new Error('Missing valid Azure Devops client')
  }

  if (!testRunId) {
    throw new Error(`no testRunId provided`)
  }
  const testsInRun = await _getTestsInRun(azureClient, azureConfig, testRunId)

  if (!testsInRun.length) {
    throw new Error(`no tests founded in testRun with id ${testRunId}`)
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

export async function setNotExecutedTest(
  azureClient: ITestApi,
  azureConfig: IAzureConfig,
  testRunId: number
): Promise<TestInterfaces.TestCaseResult[]> {
  if (!azureClient || !Object.keys(azureClient).length) {
    throw new Error('Missing valid Azure Devops client')
  }

  if (!testRunId) {
    throw new Error(`no testRunId provided`)
  }
  const testsInRun = await _getTestsInRun(azureClient, azureConfig, testRunId)

  if (!testsInRun.length) {
    throw new Error(`no tests founded in testRun with id ${testRunId}`)
  }

  const updatedResult = testsInRun.filter((test) => {
    if (!test.outcome) {
      test.outcome = 'NotApplicable'
      test.state = 'Completed'
    }
    return test
  })

  return azureClient.updateTestResults(
    updatedResult,
    azureConfig.projectId,
    testRunId
  )
}
