import { IAzureConfig } from '../src/interfaces/IAzureConfig';
import {validate} from '../src/services/validation/index'

describe("Validate Azure DevOps config provided", () => {

  it("validate should fail if empty config", ()=>{
    const conf = {} as IAzureConfig;
    const result = validate(conf);
    expect(result).toBe(false)
  })

  it("validate should fail if are missing required params", ()=>{
    const conf = {
      pat: "vgrdpg4njfmzzcuoxwb4vja3trwbyafim4x4oww7sbcfbopfb3bq",
      organizationUrl: "{Organization Name}",
      projectId: "{Project Name}",
      runName: "{The Test Run name that should be assigned for Runs created by this reporter}"
    } as IAzureConfig

    const result = validate(conf);
    expect(result).toBe(false)
  })

  it("validate should success if are present all the required params", ()=>{
    const completeConf = {
      pat: "vgrdpg4njfmzzcuoxwb4vja3trwbyafim4x4oww7sbcfbopfb3bq",
      organizationUrl: "{Organization Name}",
      projectId: "11",
      planId: 1,
      suiteId: 2,
      runName: "{The Test Run name that should be assigned for Runs created by this reporter}"
    }

    const result = validate(completeConf);
    expect(result).toBe(true)
  })

  it("validate should fail if pat is less of 52 characters", ()=>{
    const completeConf = {
      pat: "fmzzcuoxwb4vja",
      organizationUrl: "{Organization Name}",
      projectId: "11",
      planId: 1,
      suiteId: 2,
      runName: "{The Test Run name that should be assigned for Runs created by this reporter}"
    }

    const result = validate(completeConf);
    expect(result).toBe(false)
  })

})
