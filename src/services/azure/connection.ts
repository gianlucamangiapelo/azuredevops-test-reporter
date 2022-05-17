import * as azdev from 'azure-devops-node-api'
import * as TestApi from 'azure-devops-node-api/TestApi'
import { IAzureConfig } from '../../interfaces/IAzureConfig'

export async function createConnection(
  config: IAzureConfig
): Promise<TestApi.ITestApi> {
  const authHandler = azdev.getPersonalAccessTokenHandler(config.pat)
  const connection = new azdev.WebApi(config.organizationUrl, authHandler)
  const testApiClient: TestApi.ITestApi = await connection.getTestApi()
  return testApiClient
}
