import axios from 'axios'
import { ClientAddressData, ClientData, Televenda } from '../typings/types'



export async function getCurrentSeller() {
  const { data, status } = await axios.get(`/api/sessions?items=*`)

  return {
    sellerEmail: data.namespaces.authentication.adminUserEmail.value,
    status
  }
}

export async function getClientData(documentType: string, value: string) {
  const { data, status } = await axios.post(`/_v/search/client`, {documentType, value})

  return {
    data,
    status
  }
}

export async function isDataValidToCheckout({email}: ClientData) {
  const {data, status} = await axios.get(`/api/checkout/pub/profiles?email=${email}&ensureComplete=false`)

  return {
    data,
    status
  }
}

export async function getClientAddressData(email: string) {
  const {data, status} = await axios.post(`/_v/search/address`, {email})

  return {
    data,
    status
  }
}

export async function getAddressDataByCep(cep: string): Promise<{ addressData: ClientAddressData; status: number }> {
  const {data, status} = await axios.post(`/_v/search/cep`, {cep})

  return {
    addressData: data.result,
    status
  }
}

export async function getJuridicPersonDataByCnpj(cnpj: string): Promise<any> {
  const {data, status} = await axios.post(`/_v/search/cnpj`, {cnpj})

  return {
    corporateData: data.result,
    status
  }
}

export async function createOrderForm(clientData: ClientData) {
  const {data, status} = await axios.post(`/_v/orderform`, {clientData})

  return {
    orderFormId: data.orderFormId,
    status
  }
}

export async function handleExistentOrderForm(ofId: string,clientData: ClientData) {
  const {data, status} = await axios.post(`/_v/orderform/handle-existent`, {ofId, clientData})

  return {
    orderFormId: data.orderFormId,
    status
  }
}

export async function getItemsBySku(skus: {sku: string, quantidade: string}[] ) {
  const {data, status} = await axios.post(`/_v/skus`, {skus})

  return {
    items: data.result,
    status
  }
}

export async function createOrderFormWithItems(clientData: ClientData, items: any[] ) {
  const {data, status} = await axios.post(`/_v/orderform/items`, {clientData, items})

  return {
    orderFormId: data.orderFormId,
    status
  }
}

export async function getOrderFormById(orderFormId: string | null ) {

  const {data, status} = await axios.post(`/_v/getOrderform`, {orderFormId})

  return {
    orderFormId: data.orderFormId,
    orderForm: data.orderForm,
    status
  }
}


export async function getTelevendaBySeller(email: string, orderFormId: string | null ) {
  const {data, status} = await axios.post(`/_v/search/televenda`, {email, cartid: orderFormId})

  return {
    televendas: data.sellerEstimate,
    status
  }
}

export async function getAllTelevendasBySeller(email: string, emailconsumer?: string, conditionDate?: string ) {
  const {data, status} = await axios.post(`/_v/search/televenda`, {email, emailconsumer, conditionDate})

  return {
    televendas: data.sellerEstimate,
    status
  }
}

export async function searchFilesTelevenda(orderFormId: string ) {
  const {data, status} = await axios.post(`/_v/search-files`, orderFormId)

  return {
    data,
    status
  }
}

export async function createTelevenda(televenda: Televenda ) {
  const {data, status} = await axios.post(`/_v/televenda`, televenda)

  return {
    data,
    status
  }
}

export async function setImpersonateCustomer(email: string ) {
  const body = {
    public: {"vtex-impersonated-customer-email": {value: email}}
  }
  const {data, status} = await axios.post(`/api/sessions`, body)

  return {
    data,
    status
  }
}