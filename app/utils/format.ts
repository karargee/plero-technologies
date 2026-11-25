import { site } from '~/data/site'

export function formatMoney(value: number, fractionDigits = 0) {
  return (
    site.currency.symbol +
    value.toLocaleString('en-US', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    })
  )
}
