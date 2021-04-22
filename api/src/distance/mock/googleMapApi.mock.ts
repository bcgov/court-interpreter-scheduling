import { parseDistanceFromGoogleApi } from 'src/utils';
import * as faker from 'faker';
import { GoogleDistance } from '../googleMap';

export async function googleMapMock(): Promise<string> {
  // mocking fetching data from Google Map Api
  await new Promise(res => setTimeout(res, 500));
  const mock = mockData();
  return String(parseDistanceFromGoogleApi(mock));
}

function mockData(): GoogleDistance {
  return {
    routes: [
      {
        legs: [
          {
            distance: {
              value: faker.random.number({ min: 100, max: 300 * 1000 }),
            },
          },
        ],
      },
    ],
  };
}
