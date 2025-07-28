import { Televenda } from "../typings/types";

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatDateHourMinute(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")

  return `${year}-${month}-${day}T${hours}:${minutes}:00`
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100)
}

export const showOff = (listPrice: number, sellingPrice: number) => {
  const discount = ((listPrice - sellingPrice) / listPrice) * 100
  return `-${Math.round(discount)}%`
}

export const formatDateString = (dateString: string): string => {
  if (!dateString) return ""

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  } catch (error) {
    return dateString
  }
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
