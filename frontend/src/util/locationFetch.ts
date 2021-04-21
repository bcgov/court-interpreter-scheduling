import { axiosGetter } from 'hooks/axios';
import { type } from 'os';

type LocationResp = {
  name: string;
};

export async function getLocationDetails(): Promise<string[]> {
  const axios = axiosGetter().axiosGet;
  const resp = await axios.get('/location');
  const respData: LocationResp[] = resp.data as LocationResp[];
  return respData.map((item) => item.name);
}
