import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginatorProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function Paginator({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: PaginatorProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  // Adjust range if there are fewer than 5 pages available
  if (endPage - startPage + 1 < 5) {
    if (startPage === 1) {
      // Extend the range towards the end
      endPage = Math.min(totalPages, startPage + 5 - 1);
    } else if (endPage === totalPages) {
      // Extend the range towards the start
      startPage = Math.max(1, endPage - 5 + 1);
    }
  }

  const prevPages = 1 < startPage;
  const nextPages = totalPages > endPage;

  const visiblePageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  return (
    <Pagination className="mt-5">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>

        {prevPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {visiblePageNumbers.map((pageNo) => {
          return (
            <PaginationItem>
              <PaginationLink
                isActive={pageNo === currentPage}
                href="#"
                onClick={() => onPageChange(pageNo)}
              >
                {pageNo}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {nextPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
