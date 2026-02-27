export function productIconMap(product?: string): string {
  if (product) {
    return `/icons/${product}.svg`;
  } else {
    return "";
  }
}

export function cleanName(name: string): string {
    return name.replaceAll(/\[Tram\]|\(Berlin\)/g, "")
}