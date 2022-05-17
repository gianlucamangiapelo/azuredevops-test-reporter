import { ITestApi } from 'azure-devops-node-api/TestApi'
import { IAzureConfig } from '../src/interfaces/IAzureConfig'
import {getPoints} from '../src/services/azure/testCasePoints'

const mockClient = {
  getPoints: jest.fn(()=>{
    return new Promise((resolve, reject)=> {
      resolve([{
        configuration: {},
        id: 1,
        outcome: "0",
        testCase: {},
        url: "",
        workItemProperties: []
      }])
    })
  })
}

const azureConfig: IAzureConfig = {
  pat: 'vgeipg4njfmzzcuoxwb4vja3trwbyafim4x4oww7sbcfbopfb3bq',
  organizationUrl: 'https://dev.azure.com/gianlucamangiapelo',
  projectId: '3cf7dbc9-cb1e-4240-93f2-9a5960ab3945',
  planId: 12,
  suiteId: 14,
  runName: 'sample',
}


describe('Validate http call to retrieve the testCase in the test Run', ()=>{
  it('Should resolve the promise if a valid AzureDevOps client is passed', async ()=>{
    const result =  getPoints(mockClient as unknown as ITestApi, azureConfig)
    await expect(result).resolves.not.toEqual([])
  })

  it('Should throw error an error if an empty AzureDevOps client is passed', async ()=>{
    const result = getPoints({} as ITestApi, azureConfig)
    await expect(result).rejects.toThrow();
  })
})
