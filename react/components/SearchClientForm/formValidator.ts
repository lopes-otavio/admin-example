import { initalError } from './formInitial'
import { FormErrors } from '../../typings/types'

export async function formValidator(value: string, documentType: string): Promise<{error: boolean, errors: FormErrors}> {
  const errors: FormErrors = {
    email: { ...initalError.email },
    cnpj: {...initalError.cnpj},
    cpf: {...initalError.cpf},
    documentType: initalError.documentType
  }

  let error = false

  if (!documentType) {
    errors.documentType = true
    errors.email.required = true
    errors.cpf.required = true
    errors.cnpj.required = true
    error = true
  }

  if(!value) {
    if (documentType === 'email') {
      errors.email.required = true
    } else if (documentType === 'document') {
      errors.cpf.required = true
    } else if (documentType === 'corporateDocument') {
      errors.cnpj.required = true
    }
    error = true
  }

if (documentType === 'email') {
    if (!validateEmail(value)) {
      errors.email.invalid = true
      error = true
    }
  } else if (documentType === 'document') {
    if (!isCPFFormat(value)) {
      errors.cpf.invalid = true
      error = true
    }
  } else if (documentType === 'corporateDocument') {
    if (!isCNPJFormat(value)) {
      errors.cnpj.invalid = true
      error = true
    }
  }

  return {
    error: error,
    errors
  }
}

function validateEmail(emailValue: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(emailValue);
}

export function isCPFFormat(value: string): boolean {
  const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
  return cpfRegex.test(value);
}

export function isCNPJFormat(value: string): boolean {
  const cnpjRegex = /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/;
  return cnpjRegex.test(value);
}
