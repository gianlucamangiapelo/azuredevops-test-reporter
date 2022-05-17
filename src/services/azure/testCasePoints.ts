import { ITestApi } from 'azure-devops-node-api/TestApi'
import { IAzureConfig } from '../../interfaces/IAzureConfig'

export async function getPoints(
  azureClient: ITestApi,
  config: IAzureConfig
): Promise<number[]> {
  if (!Object.keys(azureClient).length) {
    return new Promise(() => {
      throw new Error('Missing valid Azure Devops client')
    })
  }
  const testCasesPoints = await azureClient.getPoints(
    config.projectId,
    config.planId,
    config.suiteId
  )

  const testCasePointIds = testCasesPoints.map((val) => {
    return val.id
  })

  return testCasePointIds
}
