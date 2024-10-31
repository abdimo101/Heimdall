export function pxToRem(px: number): number {
  return px / parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function remToPx(rem: number): number {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
