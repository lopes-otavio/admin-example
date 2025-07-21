import React from "react"
import { Input } from "vtex.styleguide"

type SearchFilterProps = {
  searchTerm: string
  onSearchChange: (term: string) => void
  onClearSearch: () => void
  placeholder?: string
  isSearching?: boolean
  totalItems?: number
  totalUnfilteredItems?: number
}

export default function SearchFilter({
  searchTerm,
  onSearchChange,
  onClearSearch,
  placeholder = "Buscar por nome ou email...",
  isSearching = false,
  totalItems = 0,
  totalUnfilteredItems = 0,
}: SearchFilterProps) {
  return (
    <div className="mb4">
      <div className="flex items-center">
        <div className="flex-auto">
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
    </div>
  )
}
