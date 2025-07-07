export function maskCPF(value: string): string {
  if(!value) return ''
  const onlyDigits = value.replace(/\D/g, '')

  return onlyDigits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
}
