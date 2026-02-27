import { cleanName } from "$lib";
import { lineSignetStyle } from "$lib/components/Departures/lineStyle";
import type { Alternative } from "hafas-client";

export class PresentableDeparture {
  id: string;
  line: { name: string, product: string, style: string };
  direction: string;
  cancelled: boolean;
  arrivesIn: number;
  formattedArrivesIn: string;

  private static computeArrivesIn(
    arrival: Alternative,
    timestamp: number,
  ): number {
    let arrivalWhen = new Date(arrival.when ?? arrival.plannedWhen!);
    return arrivalWhen.getTime() - timestamp;
  }

  private static formatArrivesIn(arrivesIn: number): string {
    return arrivesIn > 0
      ? `${arrivesIn}` + (arrivesIn === 1 ? "min" : "mins")
      : "Now";
  }

  constructor(departure: Alternative, timestamp: number) {
    this.id = departure.tripId;
    this.line = {
      name: departure.line?.name ?? "",
      product: departure.line?.product ?? "",
      style: lineSignetStyle(departure.line),
    };
    this.direction = cleanName(departure.direction ?? "");
    this.cancelled = departure.cancelled!;
    this.arrivesIn = Math.floor(
      PresentableDeparture.computeArrivesIn(departure, timestamp) / 1000 / 60,
    );
    this.formattedArrivesIn = PresentableDeparture.formatArrivesIn(
      this.arrivesIn,
    );
  }
}
