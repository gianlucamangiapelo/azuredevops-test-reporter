import { AxiosInstance } from 'axios'
import { ITestApi } from 'azure-devops-node-api/TestApi'
import { IAzureConfig } from '../src/interfaces/IAzureConfig'
import { ITestResult } from '../src/interfaces/ITestResult'
import { setTestResult } from '../src/services/azure/testResults'


const azureConfig: IAzureConfig = {
  pat: 'v3e3pg4njfmzzcuoxwb4vja3trwbyafim4x4oww7sbcfbopfb3bq',
  organizationUrl: 'https://dev.azure.com/organization',
  projectId: '3cf7dbc9-cb1e-4240-93f2-9a5960ab3945',
  planId: 12,
  suiteId: 14,
  runName: 'sample',
}

describe('setTestResult', () => {
  it('Should throw error if tests are not found in the Run', async () => {
    const mockClient = {
      get: jest.fn(() => {
        return new Promise((resolve, reject) => {
          resolve([])
        })
      })
    }

    const testResult: ITestResult = {
      testCaseId: '1',
      message: '',
      result: 'Passed'
    }
    const result = setTestResult({} as ITestApi, azureConfig, 1, testResult)
    await expect(result).rejects.toThrow('Missing valid Azure Devops client');
  })

  it('Should throw error if testRunId is undefined', async () => {
    const mockClient = {
      getTestResults: jest.fn(() => {
        return new Promise((resolve, reject) => {
          resolve([])
        })
      })
    }

    const testResult: ITestResult = {
      testCaseId: '1',
      message: '',
      result: 'Passed'
    }

    const runId = undefined

    const result = setTestResult(mockClient as unknown as ITestApi, azureConfig, runId as unknown as number, testResult)
    await expect(result).rejects.toThrow('no testRunId provided');
  })

  it('Should throw error if tests are not found in the Run', async () => {
    const mockClient = {
      getTestResults: jest.fn(() => {
        return new Promise((resolve, reject) => {
          resolve([])
        })
      })
    }

    const testResult: ITestResult = {
      testCaseId: '1',
      message: '',
      result: 'Passed'
    }

    const runId = 1

    const result = setTestResult(mockClient as unknown as ITestApi, azureConfig, runId, testResult)
    await expect(result).rejects.toThrow('no tests founded in testRun with id 1');
  })

  it('Should call updaTestResult function if all conditions are met', async () => {
    const mockClient = {
      getTestResults: jest.fn(() => {
        return new Promise((resolve, reject) => {
          resolve([{
            configuration: {},
            id: 1,
            testRun: {},
            testCaseTitle: 'test title',
            testCase: {
              id: '1'
            }
          }]

          )
        })
      }),
      updateTestResults: jest.fn(() => {
        return new Promise((resolve, reject) => {
          resolve([])
        })
      })
    }

    const testResult: ITestResult = {
      testCaseId: '1',
      message: '',
      result: 'Passed'
    }

    const runId = 1

    await setTestResult(mockClient as unknown as ITestApi, azureConfig, runId, testResult)
    expect(mockClient.updateTestResults).toHaveBeenCalledTimes(1);
  })
})
