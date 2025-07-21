import React from 'react'
import type { TelevendaItem } from "../../typings/types"
import ListItem from "./ListItem"
import Pagination from "./Pagination"

type Props = {
  listItems: TelevendaItem[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage: number
  totalItems: number
  isSearching?: boolean
}

export default function ListTable({
  listItems,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  isSearching = false,
}: Props) {
  return (
    <div className="w-100">
      <div className="bg-base br3 ba b--muted-4 overflow-hidden">
        {/* Header */}
        <div
          className="bg-muted-5 bb b--muted-4"
          style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr" }}
        >
          <div className="pa3 fw6 f6 c-muted-1">Nome</div>
          <div className="pa3 fw6 f6 c-muted-1">E-mail</div>
          <div className="pa3 fw6 f6 c-muted-1">Data</div>
          <div className="pa3 fw6 f6 c-muted-1">Status</div>
          <div className="pa3 fw6 f6 c-muted-1">Ações</div>
        </div>

        {/* Body */}
        <div>
          {listItems.length > 0 ? (
            listItems.map((item, index) => (
              <ListItem key={item.id} item={item} isLast={index === listItems.length - 1} />
            ))
          ) : (
            <div className="pa4 tc c-muted-2">
              {isSearching ? "Nenhum resultado encontrado" : "Nenhum atendimento encontrado"}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      )}
    </div>
  )
}
