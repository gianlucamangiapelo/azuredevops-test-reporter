import {
  TestCaseResult,
  TestRun,
} from 'azure-devops-node-api/interfaces/TestInterfaces'
import { ITestApi } from 'azure-devops-node-api/TestApi'
import { IAzureConfig } from './interfaces/IAzureConfig'
import { IAzureTestPlanReporter } from './interfaces/IAzureTestPlanReporter'
import { ITestResult } from './interfaces/ITestResult'
import { createConnection } from './services/azure/connection'
import { setTestResult } from './services/azure/testResults'
import {
  createTestRun,
  getLastTestRunId,
  setCompletedRun,
  setInProgressRun,
} from './services/azure/testRun'
import { validate } from './services/validation'

export class AzureTestPlanReporter implements IAzureTestPlanReporter {
  private _config: IAzureConfig
  private _azureClient!: ITestApi
  public testRunId!: number

  constructor(config: IAzureConfig) {
    if (!validate(config)) {
      new Error('Invalid Azure Test plan configuration')
    }

    this._config = config
  }

  public async init(): Promise<void> {
    this._azureClient = await createConnection(this._config)
  }

  public async starTestRun(): Promise<TestRun> {
    const testRun = await createTestRun(this._azureClient, this._config)
    setInProgressRun(this._azureClient, this._config, testRun.id)
    this.testRunId = testRun.id
    return testRun
  }

  public async sendTestResult(
    testResult: ITestResult,
    testRunId?: number
  ): Promise<TestCaseResult[]> {
    if (!this.testRunId || !testRunId) {
      new Error()
    }

    const officialRunId = testRunId ? testRunId : this.testRunId

    return await setTestResult(
      this._azureClient,
      this._config,
      officialRunId,
      testResult
    )
  }

  public async stopTestRun(): Promise<TestRun> {
    const testRun = await setCompletedRun(
      this._azureClient,
      this._config,
      this.testRunId
    )
    return testRun
  }

  public async getCurrentTestRunId(): Promise<number> {
    return await getLastTestRunId(this._azureClient, this._config)
  }
}
