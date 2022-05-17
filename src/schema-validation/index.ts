import Schema from 'validate'

export const azureConfig = new Schema({
  pat: {
    type: String,
    required: true,
    length: 52,
  },
  organizationUrl: {
    type: String,
    required: false,
  },
  projectId: {
    type: String,
    required: true,
  },
  planId: {
    type: Number,
    required: true,
  },
  suiteId: {
    type: Number,
    required: true,
  },
  runName: {
    type: String,
    required: false,
  },
})
