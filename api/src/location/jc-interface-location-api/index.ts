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
  return nonprodResponse
  // try {
  //   TODO:// this method and the downstream effects changing it has is an entire can of worms on its own
  //    the notion of activeList.csv and nonprod-response.ts is missing the fact that the names and shortDesc provided from the jc interface do not match
  //    in each environment (activeList.csv AGEN_AGENCY_IDENTIFIER_CD == jc-interface rest response shortDesc) and nonprod-response.ts has some incorrect data
  //   We will be making a new ticket in jira to flush this feature out completely so it can be written correctly!
  //   const auth = { username: JC_INTERFACE_API_USERNAME, password: JC_INTERFACE_API_PASSWORD }
  //   const response = await Axios.get<SSCourtLocation[]>(JC_INTERFACE_API_LOCATION_URL, { auth })
  //   return response.data
  // } catch (err) {
  //   // if we're not in production offer a failback to using the nonprodResponse,
  //   //  this is useful when developing without a VPN
  //   if (!isProduction) {
  //     return nonprodResponse
  //   }
  //   console.error(err)
  //   throw err;
  // }
}
