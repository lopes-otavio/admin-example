import React from 'react'
import type { TelevendaItem } from "../../typings/types"
type PreviewType = "modelo" | "orcamento" | "compartilhar" | null

type Props = {
  televenda: TelevendaItem | undefined
  activePreview: PreviewType
  onPreviewChange: (preview: PreviewType) => void
  onEditOrder: () => void
  isLoading?: boolean
}

const stylesAction = {
  borderColor: "#134cd8",
  borderStyle: "solid",
  borderWidth: "1px",
  backgroundColor: "#ffffff",
}

const classAction = "bg-transparent bn f7 flex items-center pa4 hover-bg-light-silver pointer br2"

export default function HeaderDetails({
  televenda,
  activePreview,
  onPreviewChange,
  onEditOrder,
  isLoading = false,
}: Props) {
  return (
    <div className="flex items-center bg-base pl7 pr7 pt6 pb6 bb b--light-gray w-100">
      <h2 className="mt0 mb0 normal f5 b">Atendimento: {televenda?.cartid || "Carregando..."}</h2>

      <div className="flex items-center ml-auto">
        {/* Botão Copiar Modelo - sempre visível */}
        <button
          style={activePreview === "modelo" ? stylesAction : undefined}
          onClick={() => {
            const newPreview = activePreview === "modelo" ? null : "modelo"
            onPreviewChange(newPreview)
          }}
          className={classAction}
          disabled={isLoading}
        >
          <img
            className="db w-auto mr2"
            style={{ height: "20px" }}
            src="https://fken.vteximg.com.br/arquivos/app-copy.svg"
            alt="Copiar"
          />
          Copiar modelo
        </button>

        {/* Ações disponíveis apenas para status 'novo' */}
        {televenda?.status === "novo" && (
          <>
            <button
              style={activePreview === "compartilhar" ? stylesAction : undefined}
              onClick={() => {
                const newPreview = activePreview === "compartilhar" ? null : "compartilhar"
                onPreviewChange(newPreview)
              }}
              className={classAction}
              disabled={isLoading}
            >
              <img
                className="db w-auto mr2"
                style={{ height: "20px" }}
                src="https://fken.vteximg.com.br/arquivos/app-email.svg"
                alt="Compartilhar"
              />
              Compartilhar
            </button>

            <button
              style={activePreview === "orcamento" ? stylesAction : undefined}
              onClick={() => {
                const newPreview = activePreview === "orcamento" ? null : "orcamento"
                onPreviewChange(newPreview)
              }}
              className={classAction}
              disabled={isLoading}
            >
              <img
                className="db w-auto mr2"
                style={{ height: "20px" }}
                src="https://fken.vteximg.com.br/arquivos/app-print.svg"
                alt="Imprimir"
              />
              Imprimir
            </button>

            <button
              onClick={onEditOrder}
              className="ml2 f6 pl4 pr4 flex items-center br2 bg-action-primary b--action-primary hover-bg-action-primary hover-b--action-primary white pointer no-underline bn"
              style={{ height: "46px" }}
              disabled={isLoading}
            >
              Editar Pedido
            </button>
          </>
        )}
      </div>
    </div>
  )
}
