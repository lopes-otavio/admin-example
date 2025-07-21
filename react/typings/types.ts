export interface FormErrors {
  documentType: boolean,
  email: {
    required: boolean,
    invalid: boolean
  }
  cpf: {
    required: boolean,
    invalid: boolean
  }
  cnpj: {
    required: boolean,
    invalid: boolean
  }
}

export interface FormData {
  documentType: DocumentType
  emailValue: string
}

export interface DocumentType {
  label: 'Email' | 'CPF' | 'CNPJ' | '',
  value: 'email' | 'document' | 'corporateDocument' | ''
}

export interface ClientData {
  userId?: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  homePhone?: string
  document?: string
  isCorporate: boolean
  corporateDocument?: string
  corporateName?: string
  tradeName?: string
  documentType?: string
  stateRegistration?: string
  isNewClient?: boolean

  availableAddresses?: ClientAddressData[]
}

export interface ClientAddressData {
  isNewAddress?: boolean
  addressName?: string
  addressId?: string
  addressType?: string
  city?: string
  complement?: string
  country?: string
  geoCoordinates?: number[]
  isDisposable?: boolean
  neighborhood?: string
  number?: string
  postalCode?: string
  receiverName?: string
  reference?: string | null
  state?: string
  street?: string
}

export interface ValidDataFeedBack {
  isValid: boolean | null
  missingFields: string[],
  missingAddressFields: string[]
}

export interface Televenda {
  emailConsumer: string,
  firstName: string,
  lastName: string,
  emailSeller: string,
  name: string,
  products: string,
  id: string,
  date: string
}

export interface TelevendaItem {
  cartid: string
  datedoc: string
  emailconsumer: string
  emailseller: string
  id: string
  nameconsumer: string
  notedoc: string
  orderid: string
  products: string
  status: string
  titledoc: string
}