import React, { useEffect, useState } from "react"
import { Layout, PageHeader, Spinner } from "vtex.styleguide"
import { getCurrentSeller, getAllTelevendasBySeller } from "./services/clientServices"
import type { TelevendaItem } from "./typings/types"
import ListTable from "./components/ListingTelevendas/ListTable"
import SearchFilter from "./components/ListingTelevendas/SearchFilter"
import { useFilteredPagination } from "./hooks/useFilteredPagination"

type Props = {}

function ListTelevendas({}: Props) {
  const [sellerEmail, setSellerEmail] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [budgets, setBudgets] = useState<TelevendaItem[]>([])

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
    data: budgets,
    itemsPerPage: 10,
    searchFields: ["nameconsumer", "emailconsumer"],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { sellerEmail } = await getCurrentSeller()
        const { televendas } = await getAllTelevendasBySeller(sellerEmail)
        console.log("televendas", televendas)
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
        />

        <ListTable
          listItems={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          isSearching={isSearching}
        />
      </div>
    </Layout>
  )
}

export default ListTelevendas
