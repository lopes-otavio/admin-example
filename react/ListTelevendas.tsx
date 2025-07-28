import React, { useEffect, useState, useMemo, useCallback } from "react"
import { Layout, PageHeader, Spinner } from "vtex.styleguide"
import { getCurrentSeller, getAllTelevendasBySeller } from "./services/clientServices"
import type { TelevendaItem } from "./typings/types"
import ListTable from "./components/ListingTelevendas/ListTable"
import SearchFilter from "./components/ListingTelevendas/SearchFilter"
import { useFilteredPagination } from "./hooks/useFilteredPagination"

type Props = {}

type SortOption = "dateTimeDoc" | "nameconsumer"
type SortOrder = "asc" | "desc"

function ListTelevendas({}: Props) {
  const [sellerEmail, setSellerEmail] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [budgets, setBudgets] = useState<TelevendaItem[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("dateTimeDoc")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  // Dados ordenados usando useMemo para evitar recálculos desnecessários
  const sortedBudgets = useMemo(() => {
    const sortData = (data: TelevendaItem[], sortBy: SortOption, sortOrder: SortOrder): TelevendaItem[] => {
      return [...data].sort((a, b) => {
        let aValue: string | Date
        let bValue: string | Date

        if (sortBy === "dateTimeDoc") {
          aValue = new Date(a.dateTimeDoc)
          bValue = new Date(b.dateTimeDoc)

        } else {
          aValue = a.nameconsumer.toLowerCase()
          bValue = b.nameconsumer.toLowerCase()
        }

        if (aValue < bValue) {
          return sortOrder === "asc" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortOrder === "asc" ? 1 : -1
        }
        return 0
      })
    }

    return sortData(budgets, sortBy, sortOrder)
  }, [budgets, sortBy, sortOrder])

  const handleSortChange = useCallback(
    (newSortBy: SortOption) => {
      if (newSortBy === sortBy) {
        // Se é a mesma coluna, inverte a ordem
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
      } else {
        // Se é uma coluna diferente, define a ordenação padrão
        setSortBy(newSortBy)
        setSortOrder(newSortBy === "dateTimeDoc" ? "desc" : "asc")
      }
    },
    [sortBy],
  )

  // Hook de paginação com filtro
  const {
    currentPage,
    totalPages,
    paginatedData,
    searchTerm,
    goToPage,
    updateSearchTerm,
    clearSearch,
    totalItems,
    totalUnfilteredItems,
    itemsPerPage,
    isSearching,
  } = useFilteredPagination({
    data: sortedBudgets,
    itemsPerPage: 10,
    searchFields: ["nameconsumer", "emailconsumer"],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { sellerEmail } = await getCurrentSeller()
        const { televendas } = await getAllTelevendasBySeller(sellerEmail)
        setBudgets(televendas)
        setSellerEmail(sellerEmail)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const SubTitle = () => {
    return (
      <>
        <b>Vendedor:</b> {sellerEmail}
        {totalUnfilteredItems > 0 && (
          <span className="ml3 c-muted-2">
            {isSearching ? (
              <>
                ({totalItems} de {totalUnfilteredItems} {totalUnfilteredItems === 1 ? "atendimento" : "atendimentos"})
              </>
            ) : (
              <>
                ({totalUnfilteredItems} {totalUnfilteredItems === 1 ? "atendimento" : "atendimentos"})
              </>
            )}
          </span>
        )}
      </>
    )
  }

  if (isLoading) {
    return (
      <Layout pageHeader={<PageHeader title="Atendimentos" />}>
        <Spinner />
      </Layout>
    )
  }

  return (
    <Layout pageHeader={<PageHeader title="Atendimentos" subtitle={<SubTitle />} />} fullWidth>
      <div className="pa4">
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={updateSearchTerm}
          onClearSearch={clearSearch}
          placeholder="Buscar por nome ou email do cliente..."
          isSearching={isSearching}
          totalItems={totalItems}
          totalUnfilteredItems={totalUnfilteredItems}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
        <ListTable
          listItems={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          isSearching={isSearching}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </div>
    </Layout>
  )
}

export default ListTelevendas
