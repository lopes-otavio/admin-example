import { ClientData } from "../../typings/types";

export function validateClientData(clientData: ClientData): {
  isValid: boolean
  missingFields: string[]
  missingAddressFields: string[]
} {
  const missingFields: string[] = []
  const missingAddressFields: string[] = []

  // Validação de dados pessoais
  if (!clientData.firstName) missingFields.push('firstName')
  if (!clientData.lastName) missingFields.push('lastName')
  if (!clientData.email) missingFields.push('email')
  if (!clientData.homePhone && clientData.phone) missingFields.push('phone')

  if (clientData.isCorporate) {
    if (!clientData.corporateDocument) missingFields.push('corporateDocument')
    if (!clientData.corporateName) missingFields.push('corporateName')
    if (!clientData.stateRegistration) missingFields.push('stateRegistration')
  } else {
    if (!clientData.document) missingFields.push('document')
  }

  // Validação de endereço
  if (!clientData.availableAddresses || clientData.availableAddresses.length === 0) {
    missingAddressFields.push('street')
    missingAddressFields.push('number')
    missingAddressFields.push('postalCode')
    missingAddressFields.push('city')
    missingAddressFields.push('state')
  } else {
    const address = clientData.availableAddresses[0]
    if (!address.street) missingAddressFields.push('street')
    if (!address.number) missingAddressFields.push('number')
    if (!address.postalCode) missingAddressFields.push('postalCode')
    if (!address.city) missingAddressFields.push('city')
    if (!address.state) missingAddressFields.push('state')
    if (!isAlphaNumericWithSpaces(address.complement)) missingAddressFields.push('complement')
  }

  return {
    isValid: missingFields.length === 0 && missingAddressFields.length === 0,
    missingFields,
    missingAddressFields,
  }
}

function isAlphaNumericWithSpaces(input: string | undefined) {
  if(!input) return true
  const regex = /^[a-zA-Z0-9 ]+$/
  return regex.test(input)
}