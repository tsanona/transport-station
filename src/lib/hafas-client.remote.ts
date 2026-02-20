import { query } from "$app/server";
import typia from "typia";

import { createClient } from "hafas-client";
import { withRetrying } from "hafas-client/retry";
import { profile as vbbProfile } from "hafas-client/p/vbb/index";
import type {
  DeparturesArrivalsOptions,
  Location,
  NearByOptions,
  Station,
  Stop,
} from "hafas-client";

const userAgent = "tsanona@gmail.com";
const client = createClient(withRetrying(vbbProfile), userAgent);

export interface NearbyArgs {
  location: Location;
  options?: NearByOptions;
}

export const nearby = query(
  typia.createValidate<NearbyArgs>(),
  async (nearbyArgs: NearbyArgs) => {
    let { location, options } = nearbyArgs;
    return await client.nearby(location, options);
  },
);

export type StationType = Stop | Station;

export interface DepartureArgs {
  station: StationType;
  options?: DeparturesArrivalsOptions;
}

export const departures = query(
  typia.createValidate<DepartureArgs>(),
  async (departureArgs: DepartureArgs) => {
    let { station, options } = departureArgs;
    return await client.departures(station, options);
  },
);
