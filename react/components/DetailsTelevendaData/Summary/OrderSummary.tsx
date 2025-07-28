import React from 'react'
import type { TelevendaItem } from "../../../typings/types"
import { formatCurrency } from '../../../helpers/formaters'

interface OrderSummaryProps {
  televenda?: TelevendaItem
  orderFormData?: any
}

// Componente para renderizar informações de shipping
const RenderShipping = ({ shipping, totalizers }: { shipping: any[]; totalizers: any[] }) => {
  // Função para formatar tempo de entrega (você pode importar se já existir)
  const strTimeShipping = (estimate: string) => {
    if (!estimate) return ""
    return estimate.replace(/(\d+)bd/, "$1 dias úteis")
  }

  if (!shipping.length) return <div className="f6">Dados de entrega não disponíveis</div>

  // Pega apenas o primeiro elemento do array logisticsInfo
  const [firstShipping] = shipping

  if (!firstShipping || !firstShipping.slas || !firstShipping.slas.length) {
    return <div className="f6">Dados de entrega não disponíveis</div>
  }

  // Pega o primeiro SLA disponível
  const [selectedSLA] = firstShipping.slas.filter((item: any) => item.id == firstShipping.selectedSla)
  const estimate = selectedSLA?.shippingEstimate ?? ""
  const name = selectedSLA?.name ?? ""
  const strEstimate = strTimeShipping(estimate)

  // Busca o preço do frete nos totalizers
  const shippingObject = totalizers.find((item: any) => item.id === "Shipping")
  const price = shippingObject ? shippingObject.value : "Calcular"

  let strPrice = ""
  if (price !== "Calcular") {
    strPrice = formatCurrency(price)
  }
  if (price === 0) {
    strPrice = "Grátis"
  }

  if (firstShipping?.selectedDeliveryChannel === "delivery") {
    return (
      <>
        <div className="mid-gray f6">Receber</div>
        <div className="mid-gray f6 mt2">{name}</div>
        <div className="flex items-center justify-between mt2">
          <div className="f6">Em até {strEstimate}</div>
          <div className="f6">{strPrice}</div>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className="mid-gray f6">Retirar</div>
        <div className="flex items-center justify-between mt2">
          <div className="mid-gray f6">{strTimeShipping(estimate)} após aprovação do pagamento</div>
          <div className="mid-gray f6">{strPrice}</div>
        </div>
        <div className="mt4 mid-gray f7">
          <b>{selectedSLA?.deliveryIds?.[0]?.courierName || "Loja"}</b> <br />
          {selectedSLA?.pickupStoreInfo?.address?.street}, {selectedSLA?.pickupStoreInfo?.address?.number} <br />
          {selectedSLA?.pickupStoreInfo?.address?.neighborhood} <br />
          {selectedSLA?.pickupStoreInfo?.address?.city} - {selectedSLA?.pickupStoreInfo?.address?.state}
        </div>
      </>
    )
  }
}

export default function OrderSummary({ orderFormData }: OrderSummaryProps) {
  const profile = orderFormData?.clientProfileData
  const address = orderFormData?.shippingData?.address
  const shipping = orderFormData?.shippingData?.logisticsInfo || []
  const totalizers = orderFormData?.totalizers || []
  const paymentData = orderFormData?.paymentData

  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100)
  }

  return (
    <div className="bg-white mt6">
      <div className="flex">
        {/* Seção Cliente */}
        <div className="w-33 pa6 h-100 bb b--light-gray">
          <h3 className="normal f5 mt0 mb4">Cliente</h3>
          <div className="f6 pb3 mid-gray">Orçamento realizado para</div>

          {profile?.isCorporate ? (
            <>
              <div className="f6 dark-gray mb2">{profile?.firstName}</div>
              <div className="f6 mid-gray mb2">CNPJ: {profile?.corporateDocument}</div>
            </>
          ) : (
            <>
              <div className="f6 dark-gray mb2">
                {profile?.firstName} {profile?.lastName}
              </div>
              <div className="f6 mid-gray mb2">CPF: {profile?.document}</div>
            </>
          )}

          <div className="f6 mid-gray mb2">{profile?.email}</div>
          <div className="f6 mid-gray">{profile?.phone}</div>
        </div>

        {/* Seção Entrega - Atualizada */}
        <div className="w-33 pa6 h-100 bb b--light-gray bl b--light-gray">
          <h3 className="normal f5 mt0">Entrega</h3>
          <div className="f5 pb4">Endereço</div>

          {address && (
            <>
              <div className="mid-gray f6">
                {address?.street}, {address?.number}
              </div>
              <div className="mid-gray f6 mt2">{address?.neighborhood}</div>
              <div className="mid-gray f6 mt2">{address?.complement}</div>
              <div className="mid-gray f6 mt2">
                {address?.city}, {address?.state}
              </div>
              <div className="mid-gray f6 mt2">{address?.postalCode}</div>
            </>
          )}

          <div className="f5 pb3 mt4">Logística</div>
          <RenderShipping shipping={shipping} totalizers={totalizers} />
        </div>

        {/* Seção Valores */}
        <div className="w-33 pa6 h-100 bb b--light-gray bl b--light-gray">
          <h3 className="normal f5 mt0 mb4">Valores</h3>

          <div className="mb4">
            <div className="f6 pb2 mid-gray">Detalhamento</div>

            {totalizers && (
              <>
                <div className="flex justify-between mb2">
                  <span className="f6 mid-gray">Total dos Itens</span>
                  <span className="f6 dark-gray">
                    {formatCurrency(totalizers.find((t: any) => t.id === "Items")?.value || 0)}
                  </span>
                </div>

                <div className="flex justify-between mb3">
                  <span className="f6 mid-gray">Total do Frete</span>
                  <span className="f6 dark-gray">
                    {formatCurrency(totalizers.find((t: any) => t.id === "Shipping")?.value || 0)}
                  </span>
                </div>

                <div className="flex justify-between mb4 pt3 bt b--light-gray">
                  <span className="f5 dark-gray b">Valor final</span>
                  <span className="f5 dark-gray b">{formatCurrency(orderFormData?.value || 0)}</span>
                </div>
              </>
            )}
          </div>

          {paymentData && (
            <div>
              <div className="f6 pb2 mid-gray">Forma de pagamento</div>
              <div className="f6 dark-gray mb1">{paymentData.paymentSystems?.[0]?.name || "Não definido"}</div>
              {paymentData.installmentOptions && <div className="f6 blue">À vista já com 10% off</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
