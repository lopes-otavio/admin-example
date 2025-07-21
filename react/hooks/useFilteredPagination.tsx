import { useState, useMemo, useCallback, useEffect } from "react"

type UseFilteredPaginationProps<T> = {
  data: T[]
  itemsPerPage?: number
  searchFields: (keyof T)[]
}

export function useFilteredPagination<T>({ data, itemsPerPage = 10, searchFields }: UseFilteredPaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Filtrar dados baseado no termo de busca
  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return data
    }

    const searchLower = debouncedSearchTerm.toLowerCase()

    return data.filter((item) =>
      searchFields.some((field) => {
        const fieldValue = item[field]
        if (typeof fieldValue === "string") {
          return fieldValue.toLowerCase().includes(searchLower)
        }
        return false
      }),
    )
  }, [data, debouncedSearchTerm, searchFields])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page)
      }
    },
    [totalPages],
  )

  const resetPagination = useCallback(() => {
    setCurrentPage(1)
  }, [])

  const updateSearchTerm = useCallback((term: string) => {
    setSearchTerm(term)
    setCurrentPage(1) // Reset para primeira página ao buscar
  }, [])

  const clearSearch = useCallback(() => {
    setSearchTerm("")
    setCurrentPage(1)
  }, [])

  useMemo(() => {
    setCurrentPage(1)
  }, [data])

  useMemo(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm])

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
