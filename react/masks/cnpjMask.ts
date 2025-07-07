export function maskCNPJ(value: string): string {
  if(!value) return ''

  const onlyDigits = value.replace(/\D/g, '')

  return onlyDigits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}