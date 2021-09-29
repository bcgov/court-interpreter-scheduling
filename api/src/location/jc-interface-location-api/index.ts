import Axios from "axios"
import { assert } from "console"
import { isProduction } from "src/utils"
import nonprodResponse from './nonprod-response'

const JC_INTERFACE_API_LOCATION_URL = process.env.JC_INTERFACE_API_LOCATION_URL
const JC_INTERFACE_API_USERNAME = process.env.JC_INTERFACE_API_USERNAME
const JC_INTERFACE_API_PASSWORD = process.env.JC_INTERFACE_API_PASSWORD

if (isProduction) {
  assert(JC_INTERFACE_API_LOCATION_URL.length > 3)
  assert(JC_INTERFACE_API_USERNAME.length > 3)
  assert(JC_INTERFACE_API_PASSWORD.length > 3)
}

export type SSCourtLocation = {
  codeType: string
  code: string
  shortDesc: string
  longDesc: string
  flex: string
  additionalProperties: Record<string, any>
}

export async function fetchCourtLocations(): Promise<SSCourtLocation[]> {
  try {
    const auth = { username: JC_INTERFACE_API_USERNAME, password: JC_INTERFACE_API_PASSWORD }
    const response = await Axios.get<SSCourtLocation[]>(JC_INTERFACE_API_LOCATION_URL, { auth })
    return response.data
  } catch (err) {
    // if we're not in production offer a failback to using the nonprodResponse,
    //  this is useful when developing without a VPN
    if (!isProduction) {
      return nonprodResponse
    }
    console.error(err)
    throw err;
  }
}
