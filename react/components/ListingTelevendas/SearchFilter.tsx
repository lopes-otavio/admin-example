import React from "react"
import { Input, Dropdown } from "vtex.styleguide"

type SortOption = "dateTimeDoc" | "nameconsumer" | "emailconsumer"
type SortOrder = "asc" | "desc"

type SearchFilterProps = {
  searchTerm: string
  onSearchChange: (term: string) => void
  onClearSearch: () => void
  placeholder?: string
  isSearching?: boolean
  totalItems?: number
  totalUnfilteredItems?: number
  sortBy: SortOption
  sortOrder: SortOrder
  onSortChange: (sortBy: SortOption) => void
}

export default function SearchFilter({
  searchTerm,
  onSearchChange,
  onClearSearch,
  placeholder = "Buscar por nome ou email...",
  isSearching = false,
  totalItems = 0,
  totalUnfilteredItems = 0,
  sortBy,
  sortOrder,
  onSortChange,
}: SearchFilterProps) {
  const sortOptions = [
    {
      value: "dateTimeDoc",
      label: "Data do Atendimento",
    },
    {
      value: "nameconsumer",
      label: "Nome do Cliente",
    },
    {
      value: "emailconsumer",
      label: "Email do Cliente",
    },
  ]

  const getSortLabel = () => {
    const option = sortOptions.find((opt) => opt.value === sortBy)
    const orderLabel = sortOrder === "asc" ? "↑" : "↓"
    return `${option?.label} ${orderLabel}`
  }

  return (
    <div className="mb4">
      <div className="flex items-center">
        <div className="flex-auto mr3">
          <Input
            placeholder={placeholder}
            value={searchTerm}
            size="large"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            suffix={
              searchTerm ? (
                <button className="pointer c-muted-2 hover-c-danger" onClick={onClearSearch} title="Limpar busca">
                  ✕
                </button>
              ) : (
                <span className="c-muted-3">🔍</span>
              )
            }
          />
        </div>
        <div className="flex-none">
          <Dropdown
            size="large"
            options={sortOptions}
            value={sortBy}
            onChange={(_: any, value: SortOption) => onSortChange(value)}
          />
        </div>
      </div>
      {isSearching && (
        <div className="mt2 f6 c-muted-2">
          {totalItems === 0 ? (
            <span>Nenhum resultado encontrado para "{searchTerm}"</span>
          ) : (
            <span>
              {totalItems} {totalItems === 1 ? "resultado encontrado" : "resultados encontrados"}
              {totalUnfilteredItems > totalItems && <span> de {totalUnfilteredItems} total</span>}
            </span>
          )}
        </div>
      )}
      <div className="mt2 f6 c-muted-2">Ordenado por: {getSortLabel()}</div>
    </div>
  )
}
