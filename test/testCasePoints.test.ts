import { AxiosInstance } from 'axios'
import { ITestApi } from 'azure-devops-node-api/TestApi'
import { IAzureConfig } from '../src/interfaces/IAzureConfig'
import { getPoints } from '../src/services/azure/testCasePoints'


const azureConfig: IAzureConfig = {
  pat: 'v3e3pg4njfmzzcuoxwb4vja3trwbyafim4x4oww7sbcfbopfb3bq',
  organizationUrl: 'https://dev.azure.com/organization',
  projectId: '3cf7dbc9-cb1e-4240-93f2-9a5960ab3945',
  planId: 12,
  suiteId: 14,
  runName: 'sample',
}

describe('Validate http call to retrieve the testCase in the test Run', () => {
  it('Should resolve an empty the promise if a valid AzureDevOps Axios client is passed', async () => {
    const mockClient = {
      get: jest.fn(() => {
        return new Promise((resolve, reject) => {
          resolve({
            data: {
              value: [{
                configuration: {},
                id: 1,
                outcome: "0",
                testCase: {},
                url: "",
                workItemProperties: []
              }]
            },
            headers:{}
          })
        })
      })
    }
    const result = getPoints(mockClient as unknown as AxiosInstance, azureConfig)
    await expect(result).resolves.toEqual([])
  })

  it('Should return ids if data are wellformed from AzureDevOps API', async () => {
    const mockClient = {
      get: jest.fn(() => {
        return new Promise((resolve, reject) => {
          resolve({
            data: {
              value: [{
                pointAssignments: [{ id: 1 }, { id: 2 }],
                configuration: {},
                id: 1,
              },
              {
                pointAssignments: [{ id: 3 }, { id: 4 }],
                configuration: {},
                id: 2,
              }]
            },
            headers:{}
          })
        })
      })
    }
    const result = getPoints(mockClient as unknown as AxiosInstance, azureConfig)
    await expect(result).resolves.toEqual([1, 3])
  })

  it('Should throw error an error if an empty AzureDevOps Axios client is passed', async () => {
    const result = getPoints({} as AxiosInstance, azureConfig)
    await expect(result).rejects.toThrow('Missing valid Azure Devops client');
  })

  it('Should throw error if AzureDevOps Axios client is throwing an exception', async () => {
    const mockClient = {
      get: jest.fn(()=>{
        return new Promise((resolve, reject)=>{
          reject('rejected call');
        })
      })
    }
    const result = getPoints(mockClient as unknown as AxiosInstance, azureConfig)
    await expect(result).rejects.toThrow('rejected call');
  })
})
