import React, { useEffect, useState } from "react"
import { Layout, PageHeader, Spinner, Tag } from "vtex.styleguide"
import { getCurrentSeller, getOrderFormById, getTelevendaBySeller } from "./services/clientServices"
import type { TelevendaItem } from "./typings/types"
import HeaderDetails from "./components/DetailsTelevendaData/HeaderDetails"
import ModelHandlers from "./components/DetailsTelevendaData/ModelHandlers"
import OrderSummary from "./components/DetailsTelevendaData/Summary/OrderSummary"
import ProductSummary from "./components/DetailsTelevendaData/Summary/ProductSummary"
import DiscountsSummary from "./components/DetailsTelevendaData/Summary/DiscountsSummary"
import CommentsSummary from "./components/DetailsTelevendaData/Summary/CommentsSummary"
import { isExpired } from "./helpers/validations"
import { formatDateString } from "./helpers/formaters"

type PreviewType = "modelo" | "orcamento" | "compartilhar" | null

export default function DetailsTelevenda() {
  // Estados existentes
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [sellerEmail, setSellerEmail] = useState<string>("")
  const [televenda, setTelevenda] = useState<TelevendaItem>()
  const [orderFormData, setOrderFormData] = useState<any>()
  // Novos estados para gerenciar as ações
  const [activePreview, setActivePreview] = useState<PreviewType>(null)

  useEffect(() => {
    const setCurrentData = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search)
        const id = searchParams.get("id")
        if (!id) {
          throw new Error("ID do atendimento não encontrado")
        }
        const { sellerEmail } = await getCurrentSeller()
        const {
          televendas: [televenda],
        } = await getTelevendaBySeller(sellerEmail, id)
        const { orderForm } = await getOrderFormById(id)
        setOrderFormData(orderForm)
        setTelevenda(televenda)
        setSellerEmail(sellerEmail)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setIsLoading(false)
      }
    }
    setCurrentData()
  }, [])

  // Handlers para as ações
  const handlePreviewChange = (preview: PreviewType) => {
    setActivePreview(preview)
  }

  const handleEditOrder = () => {
    try {
      const editUrl = `/?orderFormId=${televenda?.cartid}`
      window.open(editUrl)
    } catch (error) {
      console.error("Erro ao abrir editor:", error)
    }
  }

  const SellerInfo = () => {
    const expired = televenda?.datedoc ? isExpired(televenda.datedoc) : false
    const isActive = televenda?.status === "novo" && !expired

    return (
      <div className="bg-muted-5">
        <div className="f6">
          <span>Vendedor(a): {televenda?.emailseller}</span>
          <span className="ml6">
            Criado em: {televenda?.datedoc ? formatDateString(televenda.datedoc) : "Data não disponível"}
          </span>
          <span className="ml6">{isActive ? <Tag type="success">Ativo</Tag> : <Tag type="warning">Vencido</Tag>}</span>
        </div>
      </div>
    )
  }

  // Verifica se o atendimento está expirado
  const expired = televenda?.datedoc ? isExpired(televenda.datedoc) : false

  if (isLoading) {
    return (
      <Layout pageHeader={<PageHeader title="Detalhes do atendimento" />}>
        <Spinner />
      </Layout>
    )
  }

  return (
    <Layout pageHeader={<PageHeader title="Detalhes do atendimento" subtitle={<SellerInfo />} />} fullWidth>
      <HeaderDetails
        televenda={televenda}
        activePreview={activePreview}
        onPreviewChange={handlePreviewChange}
        onEditOrder={handleEditOrder}
      />

      <ModelHandlers
        idCart={televenda?.cartid || ""}
        activePreview={activePreview}
        orderFormData={orderFormData}
        televenda={televenda}
        sellerEmail={sellerEmail}
      />

      <OrderSummary televenda={televenda} orderFormData={orderFormData} />

      <ProductSummary orderFormData={orderFormData} />

      <DiscountsSummary orderFormData={orderFormData} />

      <CommentsSummary televenda={televenda} sellerEmail={sellerEmail} isExpired={expired} />
    </Layout>
  )
}
