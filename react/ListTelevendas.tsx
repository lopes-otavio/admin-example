import React, { useEffect, useState, useCallback } from "react"
import { Layout, PageHeader, Spinner } from "vtex.styleguide"
import { getCurrentSeller, getAllTelevendasBySeller } from "./services/clientServices"
import type { TelevendaItem } from "./typings/types"
import ListTable from "./components/ListingTelevendas/ListTable"
import SearchFilter from "./components/ListingTelevendas/SearchFilter"
import { useFilteredPagination } from "./hooks/useFilteredPagination"
import ConvertionCounter from "./components/ListingTelevendas/ConvertionCounter/ConvertionCounter"

type Props = {}

type SortOption = "dateTimeDoc" | "nameconsumer" | "emailconsumer" | "dateDoc"
type SortOrder = "asc" | "desc"

function ListTelevendas({}: Props) {
  const [sellerEmail, setSellerEmail] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [budgets, setBudgets] = useState<TelevendaItem[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("dateTimeDoc")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  const sortFn = useCallback((a: TelevendaItem, b: TelevendaItem) => {
    if (sortBy === "dateTimeDoc" || sortBy === "dateDoc") {
      const aTime = new Date(a.dateTimeDoc).getTime()
      const bTime = new Date(b.dateTimeDoc).getTime()

      if (isNaN(aTime) || isNaN(bTime)) return 0
      return sortOrder === "asc" ? aTime - bTime : bTime - aTime
    }

    if (sortBy === "nameconsumer") {
      return sortOrder === "asc"
        ? a.nameconsumer.localeCompare(b.nameconsumer)
        : b.nameconsumer.localeCompare(a.nameconsumer)
    }

    if (sortBy === "emailconsumer") {
      return sortOrder === "asc"
        ? a.emailconsumer.localeCompare(b.emailconsumer)
        : b.emailconsumer.localeCompare(a.emailconsumer)
    }

    return 0
  }, [sortBy, sortOrder])


  const handleSortChange = useCallback((newSortBy: SortOption) => {
    if (newSortBy === sortBy) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(newSortBy)
      setSortOrder(newSortBy === "dateTimeDoc" ? "desc" : "asc")
    }
  }, [sortBy])

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
    data: budgets,
    itemsPerPage: 10,
    searchFields: ["nameconsumer", "emailconsumer"],
    resetTriggers: [sortBy, sortOrder],
    sortFn
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

  console.log('televendas', budgets)

  const SubTitle = () => (
    <>
      <b>Vendedor:</b> {sellerEmail}
      {totalUnfilteredItems > 0 && (
        <span className="ml3 c-muted-2">
          {isSearching ? (
            <>({totalItems} de {totalUnfilteredItems} {totalUnfilteredItems === 1 ? "atendimento" : "atendimentos"})</>
          ) : (
            <>({totalUnfilteredItems} {totalUnfilteredItems === 1 ? "atendimento" : "atendimentos"})</>
          )}
        </span>
      )}
    </>
  )

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
        <ConvertionCounter televendas={budgets} />
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
