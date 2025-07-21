import { useState, useMemo, useCallback } from "react"

type UsePaginationProps<T> = {
  data: T[]
  itemsPerPage?: number
}

export function usePagination<T>({ data, itemsPerPage = 10 }: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data.slice(startIndex, endIndex)
  }, [data, currentPage, itemsPerPage])

  const totalPages = Math.ceil(data.length / itemsPerPage)

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

  useMemo(() => {
    setCurrentPage(1)
  }, [data])

  return {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    resetPagination,
    totalItems: data.length,
    itemsPerPage,
  }
}
