import React, { useEffect, useState } from "react"
import { statusInital } from "./constants/createStatusInitial"
import { Spinner } from "vtex.styleguide"
import { createTelevenda, getCurrentSeller, getOrderFormById, getTelevendaBySeller } from "./services/clientServices"
import { formatDataToTelevenda, formatDateHourMinute } from "./helpers/formaters"

type Props = {}

export type Product = {
  id: string
  sellingPrice: number
}

export interface CreateTelevendaStatus {
  validating: boolean
  error: boolean
  message: string
}

export default function CreateNewTelevenda({}: Props) {
  const [status, setStatus] = useState<CreateTelevendaStatus>(statusInital)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [orderFormId, setOrderFormId] = useState<string | null>(null)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const id = searchParams.get("id")
    handleOrderFormDataValidation(id)
  }, [])

  useEffect(() => {
    let timer: any
    if (orderFormId) {
       timer = setTimeout(() => {
        window.open(`/admin/callcenter-estimate-detail?id=${orderFormId}`, '_blank')
      }, 1500)
    }
    return () => clearTimeout(timer)
  }, [orderFormId])

  async function handleOrderFormDataValidation(id: string | null) {
    try {
      if (!id) {
        setStatus({
          validating: false,
          error: true,
          message: "Id do carrinho não encontrado.",
        })
        return
      }

      setStatus((prev) => ({
        ...prev,
        message: "Checando vendedor(a)...",
      }))

      const { sellerEmail } = await getCurrentSeller()
      if (!sellerEmail) {
        setStatus({
          validating: false,
          error: true,
          message: "Ocorreu um erro ao verificar o vendedor.",
        })
        return
      }

      setStatus((prev) => ({
        ...prev,
        message: "Verificando dados do atendimento...",
      }))

      const { orderForm, orderFormId } = await getOrderFormById(id)
      if (!orderForm) {
        setStatus({
          validating: false,
          error: true,
          message: `Carrinho com id: ${id} não encontrado.`,
        })
        return
      }

      if (id !== orderFormId) {
        setStatus({
          validating: false,
          error: true,
          message: `Ocorreu um erro o processar qual pedido está em endamento.`,
        })
        return
      }

      const { televendas } = await getTelevendaBySeller(sellerEmail, orderFormId)
      if (televendas.length) {
        setStatus({
          validating: false,
          error: true,
          message: `Já existe um atendimento para o orderForm de ID: ${id}`,
        })
        return
      }

      setStatus((prev) => ({
        ...prev,
        message: "Verificando as informações do cliente...",
      }))

      const { clientProfileData } = orderForm
      const { profileCompleteOnLoading, profileErrorOnLoading } = clientProfileData

      if (!profileCompleteOnLoading || profileErrorOnLoading) {
        setStatus({
          validating: false,
          error: true,
          message: `Alguma informação para o pedido está incompleta, verifique e tente novamente.`,
        })
        return
      }

      clientProfileData.homePhone = clientProfileData.phone
      clientProfileData.stateRegistration = clientProfileData.stateInscription

      const listProducts: Product[] = orderForm.items
      const products = listProducts.map((item: Product) => `id:${item.id}-price:${item.sellingPrice}`).join(",")
      const dateCreate = formatDateHourMinute(new Date())
      const televendaData = formatDataToTelevenda(sellerEmail, dateCreate, products, orderFormId, orderForm)

      setStatus((prev) => ({
        ...prev,
        message: "Criando orçamento...",
      }))

      const { data, status: responseStatus } = await createTelevenda(televendaData)
      if (responseStatus != 201 || data != "Created") {
        setStatus({
          validating: false,
          error: true,
          message: `Ocorreu um erro ao criar o orçamento, tente novamente mais tarde.`,
        })
        return
      }

      setOrderFormId(orderFormId)

      setStatus({
        error: false,
        validating: false,
        message: "Orçamento criado com sucesso.",
      })
    } catch (err) {
      setStatus({
        validating: false,
        error: true,
        message: `Ocorreu um erro ao criar o orçamento, tente novamente mais tarde.`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || status.validating) {
    return (
      <div className="bg-warning vh-100 flex items-center justify-center">
        <div className="tc mr6">
          <Spinner color="currentColor" size={25} />
        </div>
        <h2 className="tc">{status.message}</h2>
      </div>
    )
  }

  if (status.error) {
    return (
      <div className="bg-danger vh-100 flex items-center justify-center">
        <h2 className="tc c-on-success">{status.message}</h2>
      </div>
    )
  }

  return (
    <div className="bg-success vh-100 flex items-center justify-center">
      <div className="tc">
        <h2 className="tc c-on-success">{status.message}</h2>
        <p className="f5">Você será redirecionado para os detalhes do pedido em alguns segundos...</p>
      </div>
    </div>
  )
}
