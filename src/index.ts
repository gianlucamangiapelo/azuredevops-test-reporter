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
import axios, { AxiosInstance } from 'axios'

export class AzureTestPlanReporter implements IAzureTestPlanReporter {
  private _config: IAzureConfig
  private _azureClient!: ITestApi
  private _axiosClient: AxiosInstance
  public testRunId!: number

  constructor(config: IAzureConfig) {
    if (!validate(config)) {
      new Error('Invalid Azure Test plan configuration')
    }

    this._config = config

    this._axiosClient = axios.create({
      headers: {
        Authorization:
          'Basic ' + Buffer.from(':' + this._config.pat).toString('base64'),
      },
      params: {
        Authorization: 'Basic ' + this._config.pat,
      },
      baseURL: `${this._config.organizationUrl}/${this._config.projectId}/_apis`,
    })
  }

  public async init(): Promise<void> {
    this._azureClient = await createConnection(this._config)
  }

  public async starTestRun(): Promise<TestRun> {
    const testRun = await createTestRun(
      this._azureClient,
      this._axiosClient,
      this._config
    )
    //await setInProgressRun(this._azureClient, this._config, testRun.id)
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
