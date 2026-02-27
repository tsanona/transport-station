import { query } from "$app/server";
import typia from "typia";

import { createClient } from "hafas-client";
import { withRetrying } from "hafas-client/retry";
import { profile } from "hafas-client/p/bvg/index";
import type {
  DeparturesArrivalsOptions,
  Location,
  NearByOptions,
  Station,
  Stop,
} from "hafas-client";

const userAgent = "tsanona@gmail.com";
const client = createClient(withRetrying(profile), userAgent);

export interface NearByArgs {
  location: Location;
  options?: NearByOptions;
}

export type NearbyReturnType = Location | Station | Stop;

export type StationStop = Station | Stop;

function isStationStop(
  station: NearbyReturnType,
): station is StationStop {
  return station.type === "station" || station.type === "stop";
}

export const nearby = query(
  typia.createValidate<NearByArgs>(),
  async (nearbyArgs: NearByArgs) => {
    let { location, options } = nearbyArgs;
    try {
      return await client.nearby(location, options).then((stations) =>
        stations.filter(isStationStop)
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
);

export type DepartureStationType = string | NearbyReturnType;

export interface DepartureArgs {
  station: DepartureStationType;
  options?: DeparturesArrivalsOptions;
}

export const departures = query(
  typia.createValidate<DepartureArgs>(),
  async (departureArgs: DepartureArgs) => {
    let { station, options } = departureArgs;
    try {
      return await client.departures(station, options).then((departures) =>
        departures.departures
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
);
