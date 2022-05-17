import * as TestInterfaces from 'azure-devops-node-api/interfaces/TestInterfaces'

export class RunCreateModel implements TestInterfaces.RunCreateModel {
  automated: boolean
  configurationIds: number[]
  name: string
  plan: TestInterfaces.ShallowReference
  pointIds?: number[] | undefined

  constructor(
    name: string,
    plan: TestInterfaces.ShallowReference,
    pointIds: number[]
  ) {
    this.automated = true
    this.configurationIds = []
    this.name = name
    this.plan = plan
    this.pointIds = pointIds
  }
}
