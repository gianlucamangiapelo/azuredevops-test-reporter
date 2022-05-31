import { AxiosInstance } from 'axios'
import { ITestApi } from 'azure-devops-node-api/TestApi'
import { IAzureConfig } from '../src/interfaces/IAzureConfig'
import { AzureTestPlanReporter } from '../src/index'




const validAzureConfig: IAzureConfig = {
  pat: 'v3e3pg4njfmzzcuoxwb4vja3trwbyafim4x4oww7sbcfbopfb3bq',
  organizationUrl: 'https://dev.azure.com/organization',
  projectId: '3cf7dbc9-cb1e-4240-93f2-9a5960ab3945',
  planId: 12,
  suiteId: 14,
  runName: 'sample',
}

describe('Constructor', () => {
  it('Should throw Error if config is not defined', () => {

    const result = () => new AzureTestPlanReporter(undefined as unknown as IAzureConfig)

    expect(result).toThrowError('Invalid Azure Test plan configuration')
  })


  it('Should throw Error if config not valid', () => {

    const notValidAzureConfig = {
      planId: 12,
      suiteId: 14,
      runName: 'sample',
    }

    const result = () => new AzureTestPlanReporter(notValidAzureConfig as unknown as IAzureConfig)

    expect(result).toThrowError('Invalid Azure Test plan configuration')
  })

  it('Should return a valid instance of AzureTestPlan reporter', () => {

    const result = new AzureTestPlanReporter(validAzureConfig)

    expect(result).toBeDefined()
  })

})
