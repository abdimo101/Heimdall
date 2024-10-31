export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function toTitleCase(string: string): string {
  return string.toLowerCase().split(' ')
    .map(word => capitalizeFirstLetter(word))
    .join(' ');
}
