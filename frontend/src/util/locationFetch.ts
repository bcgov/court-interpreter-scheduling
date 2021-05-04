import { axiosGetter } from 'hooks/axios';
import { Location, UserResponse } from 'constants/interfaces';

type LocationResp = {
  name: string;
};

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

export async function getUserLocation(): Promise<Location> {
  const axios = axiosGetter().axiosGet;
  const resp = await axios.get('/user');
  const respData: UserResponse = resp.data as UserResponse;
  return respData.location;
}

export async function updateUserLocation(locationId: number) {
  const axios = axiosGetter().axiosPatch;
  const resp = await axios.patch('/user/save-location', {
    locationId,
  });
}
