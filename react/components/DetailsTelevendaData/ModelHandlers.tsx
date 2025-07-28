import React from 'react'
import CopyModel from "./CopyModel/CopyModel"
import PrintModel from "./PrintModel/PrintModel"
import ShareModel from "./ShareModel/ShareModel"

type PreviewType = "modelo" | "orcamento" | "compartilhar" | null

type Props = {
  idCart: string
  activePreview: PreviewType
  orderFormData?: any
  televenda?: any
  sellerEmail?: string
}

export default function ModelHandlers({ idCart, activePreview, orderFormData, televenda, sellerEmail }: Props) {
  if (!activePreview || !idCart) {
    return null
  }

  switch (activePreview) {
    case "modelo":
      return <CopyModel idCart={idCart} />
    case "orcamento":
      return (
        <PrintModel
          idCart={idCart}
          orderFormData={orderFormData}
          televenda={televenda}
          sellerEmail={sellerEmail || ""}
        />
      )
    case "compartilhar":
      return <ShareModel idCart={idCart} />
    default:
      return null
  }
}
