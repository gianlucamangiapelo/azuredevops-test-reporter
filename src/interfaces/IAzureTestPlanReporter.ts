import {
  TestCaseResult,
  TestRun,
} from 'azure-devops-node-api/interfaces/TestInterfaces'
import { ITestResult } from './ITestResult'

export interface IAzureTestPlanReporter {
  init(): Promise<void>
  starTestRun(): Promise<TestRun>
  getCurrentTestRunId(): Promise<number>
  sendTestResult(testResult: ITestResult): Promise<TestCaseResult[]>
  stopTestRun(): Promise<TestRun>
}
