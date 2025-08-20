import React from 'react'
import type { TelevendaItem } from "../../typings/types"
import {Button, Tag } from "vtex.styleguide"
import { isExpired } from '../../helpers/validations'

type Props = {
  item: TelevendaItem
  isLast?: boolean
}

export default function ListItem({ item, isLast = false }: Props) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  const handleAccessClick = () => {
    const cleanId = item.cartid.replace(/-/g, '');
    window.open(`/admin/detalhes-televenda?id=${cleanId}`, 'siteWindow');
  }

  const handleCopyClick = () => {
    navigator.clipboard.writeText(item.id)
  }

  const finalizado = item?.status === 'finalizado' || item.approved
  const expired = item?.datedoc ? isExpired(item.datedoc) : false
  const isActive = item?.status === "novo" && !expired

  return (
    <div
      className={`hover-bg-muted-5 ${!isLast ? "bb b--muted-4" : ""}`}
      style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr" }}
    >
      {/* Nome */}
      <div className="pa3 flex items-center">
        <div className="w2 h2 br-100 bg-muted-4 flex items-center justify-center mr3">
          <span className="f6 c-muted-2">👤</span>
        </div>
        <span className="fw5 c-on-base">{item.nameconsumer}</span>
      </div>

      {/* E-mail */}
      <div className="pa3 flex items-center">
        <span className="c-muted-1">{item.emailconsumer}</span>
      </div>

      {/* Data */}
      <div className="pa3 flex items-center">
        <span className="c-on-base">{formatDate(item.datedoc)}</span>
      </div>

      {/* Status */}
      <div className="pa3 flex items-center">
        { finalizado && (
           <Tag type="success">Finalizado</Tag>
        )}
        {isActive && (
          <Tag bgColor="#134CD8" color="#ffffff">Ativo</Tag>
        )}
        { expired &&
          (
            <Tag type="error">Vencido</Tag>
          )
        }
      </div>

      {/* Ação */}
      <div className="pa3 flex items-center">
        <div className="flex items-center">
          <Button children="ACESSAR" variation="secondary" onClick={handleAccessClick} />
          <Button variation="tertiary" onClick={handleCopyClick} title="Copiar ID">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2v-1H12a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2h1.5V1a2 2 0 0 0-2-2H4z" />
              <path d="M5.5 2A1.5 1.5 0 0 0 4 3.5v8.5A1.5 1.5 0 0 0 5.5 13.5h8a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 13.5 2h-8z" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
