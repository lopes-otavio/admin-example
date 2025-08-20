import React from 'react'
import type { TelevendaItem } from "../../typings/types"
import ListItem from "./ListItem"
import Pagination from "./Pagination"

type SortOption = "dateTimeDoc" | "nameconsumer" | "emailconsumer" | "dateDoc"
type SortOrder = "asc" | "desc"

type Props = {
  listItems: TelevendaItem[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage: number
  totalItems: number
  isSearching?: boolean
  sortBy: SortOption
  sortOrder: SortOrder
  onSortChange: (sortBy: SortOption) => void
}

export default function ListTable({
  listItems,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  isSearching = false,
  sortBy,
  sortOrder,
  onSortChange,
}: Props) {
  const getSortIcon = (column: SortOption) => {
    if (sortBy !== column) return "↕️"
    return sortOrder === "asc" ? "↑" : "↓"
  }

  const handleHeaderClick = (column: SortOption) => {
    onSortChange(column)
  }

  return (
    <div className="w-100">
      <div className="bg-base br3 ba b--muted-4 overflow-hidden">
        {/* Header */}
        <div
          className="bg-muted-5 bb b--muted-4"
          style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr" }}
        >
          <div
            className="pa3 fw6 f6 c-muted-1 pointer hover-bg-muted-4 flex items-center justify-between"
            onClick={() => handleHeaderClick("nameconsumer")}
            title="Clique para ordenar por nome"
          >
            <span>Nome</span>
            <span className="ml2">{getSortIcon("nameconsumer")}</span>
          </div>
          <div
            className="pa3 fw6 f6 c-muted-1 pointer hover-bg-muted-4 flex items-center justify-between"
            onClick={() => handleHeaderClick("emailconsumer")}
            title="Clique para ordenar por email"
          >
            <span>E-mail</span>
            <span className="ml2">{getSortIcon("emailconsumer")}</span>
          </div>
          <div
            className="pa3 fw6 f6 c-muted-1 pointer hover-bg-muted-4 flex items-center justify-between"
            onClick={() => handleHeaderClick("dateTimeDoc")}
            title="Clique para ordenar por data"
          >
            <span>Data</span>
            <span className="ml2">{getSortIcon("dateTimeDoc")}</span>
          </div>
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
