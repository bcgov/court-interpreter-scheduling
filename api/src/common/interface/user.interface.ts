import { LocationRO } from 'src/location/ro/location.ro';

export interface KCUser {
  sub: string;
  guid?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: { roles: string[] };
}

export type User = {
  id: string;
  kcId: string;
  guId?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  location?: LocationRO;
};
