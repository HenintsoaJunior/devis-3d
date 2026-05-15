type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  // Build page number list with ellipsis
  function getPageNumbers(): (number | "...")[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }

  const from = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const to = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="erp-pagination">
      {/* Summary */}
      <span className="erp-pagination__summary">
        {totalItems === 0
          ? "Aucun résultat"
          : `${from}–${to} sur ${totalItems} résultat${totalItems > 1 ? "s" : ""}`}
      </span>

      {/* Controls */}
      <div className="erp-pagination__controls">
        {/* First */}
        <button
          className="erp-page-btn erp-page-btn--icon"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(1)}
          aria-label="Première page"
          title="Première page"
          type="button"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="11 17 6 12 11 7" />
            <polyline points="18 17 13 12 18 7" />
          </svg>
        </button>

        {/* Prev */}
        <button
          className="erp-page-btn erp-page-btn--icon"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Page précédente"
          title="Page précédente"
          type="button"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Page numbers */}
        <div className="erp-pagination__pages">
          {getPageNumbers().map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="erp-page-ellipsis" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={p}
                className={`erp-page-btn${currentPage === p ? " erp-page-btn--active" : ""}`}
                onClick={() => onPageChange(p)}
                aria-label={`Page ${p}`}
                aria-current={currentPage === p ? "page" : undefined}
                type="button"
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          className="erp-page-btn erp-page-btn--icon"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Page suivante"
          title="Page suivante"
          type="button"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Last */}
        <button
          className="erp-page-btn erp-page-btn--icon"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(totalPages)}
          aria-label="Dernière page"
          title="Dernière page"
          type="button"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="13 17 18 12 13 7" />
            <polyline points="6 17 11 12 6 7" />
          </svg>
        </button>
      </div>

      {/* Page indicator */}
      <span className="erp-pagination__page-indicator">
        Page {currentPage} / {totalPages}
      </span>
    </div>
  );
}
