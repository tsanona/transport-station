import type { Alternative, Line } from "hafas-client";
import type { Clock } from "./clock.svelte";

export function lineIconResolver(line?: Line): string {
    if (line?.product) {
        if (line.product === "regional") {
            return "/icons/bahn.svg"
        } else {
            return `/icons/${line.product}.svg`
        }
    } else {
        return ""
    }
}