export function formatCurrency(value: number | string, locale = 'pt-BR', currency = 'BRL') {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(Number.isNaN(n) ? 0 : n);
}
