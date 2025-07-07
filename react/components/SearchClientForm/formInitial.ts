import { DocumentType, FormErrors } from "../../typings/types";

export const initalError: FormErrors = {
  email: {
    required: false,
    invalid: false
  },
  cnpj: {
    required: false,
    invalid: false
  },
  cpf: {
    required: false,
    invalid: false
  },
  documentType: false
}

export const selectOptions = [
  { value: 'email', label: 'Email' },
  { value: 'document', label: 'CPF' },
  { value: 'corporateDocument', label: 'CNPJ' }
]

export const documentTypeInitial: DocumentType = {
  value: 'email',
  label: 'Email'
}
