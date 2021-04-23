import { axiosGetter } from 'hooks/axios';
import { type } from 'os';

type LocationResp = {
  name: string;
};

export interface Location {
  id: number;
  name: string;
  locationCode: string;
  addressLine1: string;
  city: string;
  postalCode: string;
}

export async function getLocationDetails(): Promise<string[]> {
  const axios = axiosGetter().axiosGet;
  const resp = await axios.get('/location');
  const respData: LocationResp[] = resp.data as LocationResp[];
  return respData.map((item) => item.name);
}

export async function getLocations(): Promise<Location[]> {
  const axios = axiosGetter().axiosGet;
  const resp = await axios.get('/location');
  const respData: Location[] = resp.data as Location[];
  return respData;
}
