import Axios from 'axios';
import { parseDistanceFromGoogleApi } from 'src/utils';
import * as dotenv from 'dotenv';

dotenv.config();

const GOOGLE_API_URL = 'https://maps.googleapis.com/maps/api/directions/json';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export type GoogleDistance = {
  routes: { legs: { distance: { value: number } }[] }[];
};

const axios = Axios.create({
  baseURL: GOOGLE_API_URL,
  timeout: 100 * 60 * 1000,
});

export async function fetchGoogleMapDistance(addr1: string, addr2: string): Promise<string | null> {
  const params = { origin: addr1, destination: addr2, key: GOOGLE_API_KEY };
  const response = await axios.get<GoogleDistance>(GOOGLE_API_URL, { params });
  if (parseDistanceFromGoogleApi(response.data)) {
    return String(parseDistanceFromGoogleApi(response.data));
  }
  return null;
}
