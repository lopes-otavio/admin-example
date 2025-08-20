import { useState, useMemo, useCallback, useEffect } from "react"

type UseFilteredPaginationProps<T> = {
  data: T[]
  itemsPerPage?: number
  searchFields: (keyof T)[]
  resetTriggers?: any[]
  sortFn?: (a: T, b: T) => number
}

export function useFilteredPagination<T>({
  data,
  itemsPerPage = 10,
  searchFields,
  resetTriggers = [],
  sortFn,
}: UseFilteredPaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  // Debounce para busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Reset página quando triggers mudarem
  useEffect(() => {
    setCurrentPage(1)
  }, [...resetTriggers])

  // Filtrar + ordenar dados
  const filteredData = useMemo(() => {
    let result = data

    // Filtra pelo termo de busca
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase()
      result = result.filter((item) =>
        searchFields.some((field) => {
          const fieldValue = item[field]
          return typeof fieldValue === "string" && fieldValue.toLowerCase().includes(searchLower)
        })
      )
    }

    // Aplica ordenação se existir
    if (sortFn) {
      result = [...result].sort(sortFn)
    }

    return result
  }, [data, debouncedSearchTerm, searchFields, sortFn])

  // Paginação
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }, [totalPages])

  const resetPagination = useCallback(() => {
    setCurrentPage(1)
  }, [])

  const updateSearchTerm = useCallback((term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchTerm("")
    setCurrentPage(1)
  }, [])

  return {
    currentPage,
    totalPages,
    paginatedData,
    filteredData,
    searchTerm,
    goToPage,
    resetPagination,
    updateSearchTerm,
    clearSearch,
    totalItems: filteredData.length,
    totalUnfilteredItems: data.length,
    itemsPerPage,
    isSearching: !!debouncedSearchTerm.trim(),
  }
}
