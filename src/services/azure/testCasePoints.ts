import { AxiosInstance } from 'axios'
import { IAzureConfig } from '../../interfaces/IAzureConfig'

export async function getPoints(
  axiosClient: AxiosInstance,
  config: IAzureConfig
): Promise<number[]> {
  if (!axiosClient) {
    return new Promise(() => {
      throw new Error('Missing valid Azure Devops client')
    })
  }

  const testCasesPoints = await axiosClient.get(
    `/testplan/Plans/${config.planId}/Suites/${config.suiteId}/TestCase?witFields=System.Id&excludeFlags=0&isRecursive=true`
  )

  const testCasePointIds: number[] = testCasesPoints.data.value.map(
    (val: { pointAssignments: { id: number }[] }) => {
      return val.pointAssignments[0].id
    }
  )

  return testCasePointIds
}
