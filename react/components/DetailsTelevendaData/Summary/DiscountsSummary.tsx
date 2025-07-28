import React from 'react'

interface DiscountsSummaryProps {
  orderFormData?: any
}

export default function DiscountsSummary({ orderFormData }: DiscountsSummaryProps) {
  // Busca os benefícios/descontos aplicados no pedido
  const benefits = orderFormData?.ratesAndBenefitsData?.rateAndBenefitsIdentifiers || []
  const marketingData = orderFormData?.marketingData
  const coupons = marketingData?.coupon ? [marketingData.coupon] : []

  // Combina todos os tipos de desconto
  const allDiscounts = [
    ...benefits,
    ...coupons.filter((coupon) => coupon), // Remove coupons vazios
  ]

  // Se não há descontos, não renderiza a seção
  if (!allDiscounts.length) {
    return null
  }

  return (
    <div className="bg-muted-5 pt5">
      <div className="br2 b--light-gray ba bg-base w-100 pa6">
        <h3 className="normal f5 mt0 mb4">Descontos</h3>

        {/* Lista de benefícios */}
        {benefits.map((item: any, i: number) => (
          <div key={`benefit-${i}`} className="f6 mb2 flex items-center">
            <span className="green mr2">✓</span>
            <span>{item.name || item.description || "Desconto aplicado"}</span>
          </div>
        ))}

        {/* Lista de cupons */}
        {coupons.map((coupon: string, i: number) => (
          <div key={`coupon-${i}`} className="f6 mb2 flex items-center">
            <span className="blue mr2">🎫</span>
            <span>Cupom: {coupon}</span>
          </div>
        ))}

        {/* Se não há descontos específicos mas a seção foi renderizada */}
        {allDiscounts.length === 0 && <div className="f6 mid-gray">Nenhum desconto aplicado</div>}
      </div>
    </div>
  )
}
