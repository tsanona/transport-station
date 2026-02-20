import type { Line } from "hafas-client";

const TRANSPORT_COLOUR_MAP = new Map<string, string>([
  ["U1", "#7dad4c"],
  ["U2", "#da421e"],
  ["U3", "#16683d"],
  ["U4", "#f0d722"],
  ["U5", "#7e5330"],
  ["U6", "#8c6dab"],
  ["U7", "#528dba"],
  ["U8", "#224f86"],
  ["U9", "#f3791d"],
  ["S1", "#bc6194"],
  ["S2", "#457236"],
  ["S25", "#457236"],
  ["S26", "#457236"],
  ["S3", "#115d91"],
  ["S41", "#a0542e"],
  ["S42", "#af6223"],
  ["S45", "#bc9144"],
  ["S46", "#bc9144"],
  ["S47", "#bc9144"],
  ["S5", "#ee771e"],
  ["S7", "#8c6dab"],
  ["S75", "#8c6dab"],
  ["S8", "#7dad4c"],
  ["S85", "#7dad4c"],
  ["S9", "#701c28"],
  ["tram", "#be1414"],
  ["bus", "#95276e"],
  ["ferry", "#528dba"],
]);

function selectLineColour(line: Line): string | undefined {
  if (line.product! && line.name!) {
    if (line.product == "suburban" || line.product == "subway") {
      return TRANSPORT_COLOUR_MAP.get(line.name);
    } else {
      return TRANSPORT_COLOUR_MAP.get(line.product);
    }
  }
  return undefined;
}

export function lineSignetStyle(line: Line): string {
  let lineColour = selectLineColour(line);
  return lineColour
    ? `border-style: solid; border-color: ${lineColour}; background-color: ${lineColour};`
    : "border-style: none";
}
