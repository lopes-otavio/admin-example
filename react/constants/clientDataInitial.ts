import { ClientData } from "../typings/types";

export const initialClientData: ClientData = {
  email: '',
  firstName: '',
  lastName: '',
  document: '',
  phone: '',
  documentType: 'cpf',
  isCorporate: false,
  corporateName: '',
  corporateDocument: '',
  stateRegistration: '',
  tradeName: '',
  availableAddresses: [],
}