import { lineSignetStyle } from "$lib/transportColour";
import type { Alternative, Line } from "hafas-client";

export class PresentableDepartures {
  icon: { src: string; alt: string };
  line: { name: string; style: string };
  direction: string;
  arrivesIn: number;
  formattedArrivesIn: string;

  private static lineIconResolver(line?: Line): string {
    if (line?.product) {
      if (line.product === "regional") {
        return "/icons/bahn.svg";
      } else {
        return `/icons/${line.product}.svg`;
      }
    } else {
      return "";
    }
  }

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
    this.icon = {
      src: PresentableDepartures.lineIconResolver(departure.line),
      alt: departure.line?.product ?? "",
    };
    this.line = {
      name: departure.line?.name ?? "",
      style: lineSignetStyle(departure.line),
    };
    this.direction = departure.direction ?? "";
    this.arrivesIn = Math.floor(
      PresentableDepartures.computeArrivesIn(departure, timestamp) / 1000 / 60,
    );
    this.formattedArrivesIn = PresentableDepartures.formatArrivesIn(
      this.arrivesIn,
    );
  }
}
