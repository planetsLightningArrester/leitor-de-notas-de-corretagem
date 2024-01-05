import { type Deal } from 'parser-de-notas-de-corretagem'

/** Table possible headers */
export type TableHeader = 'code' | 'cnpj' | 'date' | 'type' | 'quantity' | 'price'

/**
 * Sort `Deal`s using the `Array.sort` function. Can specify a `mainKey`
 * to have prevalence during the sort. Can specify the `direction`,
 * being `down` the default
 * @param a a `Deal`
 * @param b a `Deal`
 * @param mainKey a `TableHeader` to have prevalence during the sort
 * @param direction the sort direction. Default is `down`
 */
export function sortDeals(a: Deal, b: Deal, mainKey?: TableHeader, direction?: 'up' | 'down'): number {
  /**
   * Aux function to compare to signals based on the direction
   * @param _a a `Deal`
   * @param _b a `Deal`
   * @returns the `boolean` result of the comparison based on the direction
   */
  function calcDirection(_a: string | number, _b: string | number): boolean {
    if (direction === 'up') {
      if (typeof _a === 'string' && typeof _b === 'string' && !isNaN(parseFloat(_a)) && !isNaN(parseFloat(_b))) return parseFloat(_a) > parseFloat(_b)
      else return _a > _b
    } else {
      if (typeof _a === 'string' && typeof _b === 'string' && !isNaN(parseFloat(_a)) && !isNaN(parseFloat(_b))) return parseFloat(_a) < parseFloat(_b)
      else return _a < _b
    }
  }
  if (typeof mainKey !== 'undefined') {
    if (mainKey === 'date') {
      if (calcDirection(a[mainKey].split('').reverse().join(), b[mainKey].split('').reverse().join())) return -1
      else if (calcDirection(b[mainKey].split('').reverse().join(), a[mainKey].split('').reverse().join())) return 1
    } else {
      if (calcDirection(a[mainKey], b[mainKey])) return -1
      else if (calcDirection(b[mainKey], a[mainKey])) return 1
    }
  }
  if (calcDirection(a.code, b.code)) return -1
  else if (calcDirection(b.code, a.code)) return 1
  else {
    if (
      calcDirection(a.date.split('').reverse().join(), b.date.split('').reverse().join())
    ) { return -1 } else return 1
  }
}

/**
 * Format money to display
 * @param value a string value formatted as `AAAAAA.BB`
 * @returns the `value` formatted as `AAA.AAA,BB`
 */
export function formatMoneyToDisplay(value: string): string {
  return value
    .replace('.', '')
    .split('')
    .reverse()
    .flatMap((c, i, arr) =>
      i - 2 > 0 && i < arr.length - 1 && (i - 1) % 3 === 0
        ? `.${c}`
        : i === 1
          ? `,${c}`
          : c
    )
    .reverse()
    .join('')
}

/**
 * Resolve image path for Svelte + Electron integration.
 * Basically resolve "/path" to "./path" when required.
 * @param img the image path
 * @returns the image path resolved to work both in dev and prod
 */
export function resolveImgPath(img: string): string {
  return import.meta.env.MODE === 'development'
    ? img
    : '.' + img
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function noTypeCheck(x: any): any { return x }
