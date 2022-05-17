import { IAzureConfig } from '../../interfaces/IAzureConfig'
import { azureConfig } from '../../schema-validation'

export const validate = (config: IAzureConfig): boolean => {
  const v = azureConfig.validate(config)
  if (v.length > 0) {
    return false
  }

  return true
}
