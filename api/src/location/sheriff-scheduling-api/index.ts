import Axios from "axios"
import { assert } from "console"
import { isProduction } from "src/utils"
import nonprodResponse from './nonprod-response'

const LOCATION_REQUEST_URL = "https://wsgw.dev.jag.gov.bc.ca/courts/Lookup/locations"
const SS_API_USERNAME = process.env.SS_API_USERNAME
const SS_API_PASSWORD = process.env.SS_API_PASSWORD

if (isProduction) {
  assert(SS_API_USERNAME.length > 3)
  assert(SS_API_PASSWORD.length > 3)
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
  if (!isProduction) {
    return nonprodResponse
  } else {
    const auth = { username: SS_API_USERNAME, password: SS_API_PASSWORD }
    const response = await Axios.get<SSCourtLocation[]>(LOCATION_REQUEST_URL, { auth })
    return response.data
  }
}
