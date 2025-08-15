import React from 'react'
import { formatCurrency, showOff } from '../../../helpers/formaters'

interface ProductsListProps {
  orderFormData?: any
}

export default function ProductSummary({ orderFormData }: ProductsListProps) {
  const products = orderFormData?.items || []

  if (!products.length) {
    return (
      <div className="bg-muted-5 pt5">
        <div className="br2 b--light-gray ba bg-base w-100 pa6">
          <h3 className="normal f5 mt0">Items</h3>
          <div className="f6 mid-gray">Nenhum produto encontrado</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-muted-5 pt5">
      <div className="br2 b--light-gray ba bg-base w-100 pa6">
        <div className="flex items-center justify-between">
          <h3 className="normal f5 mt0">Item</h3>
        </div>

        {/* Header da tabela */}
        <div className="flex items-center pb3 bb b--light-gray">
          <div className="f6 w-40">Produto</div>
          <div className="f6 w-20">Preço</div>
          <div className="f6 w-20">Quantidade</div>
          <div className="f6 w-20">Valor</div>
        </div>

        {/* Lista de produtos */}
        {products.map((item: any, i: number) => (
          <div key={item.id || i} className="flex items-center pb3 pt3">
            {/* Coluna Produto */}
            <div className="w-40">
              <div className="flex items-center h-100">
                <img
                  src={item.imageUrl || "/placeholder.svg?height=60&width=60&query=produto"}
                  className="imgproduct w3 h3 br2"
                  alt={item.name}
                />
                <div className="pl4 mt0 mb0">
                  <span className="f6 db mb2">{item.name}</span>
                  <span className="mid-gray f7">Ref: {item.refId}</span>
                  {item.ncm && <span className="mid-gray f7 ml4">NCM: {item.ncm}</span>}
                </div>
              </div>
            </div>

            {/* Coluna Preço */}
            <div className="w-20">
              <div>
                {item.sellingPrice < item.listPrice && (
                  <div className="flex items-center mb1">
                    <span className="gray mr3 strike f6">{formatCurrency(item.listPrice)}</span>
                    <span className="pa1 bg-action-primary white br2 f7">
                      {showOff(item.listPrice, item.sellingPrice)}
                    </span>
                  </div>
                )}
                <span className="f6 b">{formatCurrency(item.sellingPrice)}</span>
              </div>
            </div>

            {/* Coluna Quantidade */}
            <div className="f6 w-20">{item.quantity}</div>

            {/* Coluna Valor Total */}
            <div className="f6 w-20 b">{formatCurrency(item.quantity * item.sellingPrice)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
