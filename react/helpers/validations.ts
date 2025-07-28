export const isExpired = (dateDoc: string): boolean => {
  if (!dateDoc) return false

  try {
    const docDate = new Date(dateDoc)
    const currentDate = new Date()

    // Calcula a diferença em milissegundos
    const diffTime = currentDate.getTime() - docDate.getTime()

    // Converte para dias (1 dia = 24 * 60 * 60 * 1000 milissegundos)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    return diffDays > 3
  } catch (error) {
    console.error("Erro ao processar data:", error)
    return false
  }
}

// Função para verificar se o campo está vazio ou nulo
export const isEmptyOrNull = (value: string) => {
  return !value || value.trim() === ""
}