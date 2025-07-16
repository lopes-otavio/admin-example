import { Televenda } from "../typings/types";

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatDataToTelevenda(
  emailSeller: string,
  date: string,
  products: string,
  orderFormId: string,
  orderForm: any
): Televenda {

  const {clientProfileData: {email, firstName, lastName, document} } = orderForm

  return {
    date,
    emailConsumer: email,
    emailSeller,
    firstName,
    lastName,
    id: orderFormId,
    name: document,
    products
  }
}