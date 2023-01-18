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

  let continuiationToken = ''
  let testCasePointIds: number[] = []
  do {
    const testCasesPoints = await axiosClient.get(
      `/testplan/Plans/${config.planId}/Suites/${config.suiteId}/TestCase?witFields=System.Id&continuationToken=${continuiationToken}&excludeFlags=0&isRecursive=true`
    )

    for (let i = 0; i < testCasesPoints.data.value.length; i++) {
      const pointAssignment = testCasesPoints.data.value[i].pointAssignments
      for (let j = 0; j < pointAssignment.length; j++) {
        if (pointAssignment[j].configurationName === config.configurationName) {
          testCasePointIds.push(pointAssignment[j].id)
        }
      }
    }

    continuiationToken = testCasesPoints.headers['x-ms-continuationtoken']
  } while (continuiationToken !== undefined)

  return testCasePointIds
}
