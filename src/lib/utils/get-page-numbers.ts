export function getPageNumbers(currentPage: number, pageCount: number): (number | '...')[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1)
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, '...', pageCount]
  }

  if (currentPage >= pageCount - 3) {
    return [1, '...', pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount]
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', pageCount]
}
