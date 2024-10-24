import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";

export default function Pagination({
  totalPages,
  currentPage,
  setCurrentPage,
  prevPage,
  nextPage,
}) {
  const pages = [];
  const page = (i) => {
    return (
      <div
        key={i}
        aria-disabled={i === currentPage}
        className={clsx(
          "mx-6 roboto-light",
          i === currentPage ? "underline underline-offset-2" : "cursor-pointer",
        )}
        onClick={() => setCurrentPage(i)}
      >
        {i}
      </div>
    );
  };

  if (totalPages > 1)
    pages.push(
      <div key={0} onClick={prevPage}>
        <ArrowLeftIcon strokeWidth="0.5" className="size-4" />
      </div>,
    );
  else pages.push(<div key={0} className="size-4"></div>);

  for (let i = 1; i <= totalPages; i++) {
    if (totalPages > 5) {
      if (i === 1 || i === totalPages) {
        pages.push(page(i));
      } else if (i === currentPage) {
        pages.push(page(i));
      } else if (i === currentPage + 1 || i === currentPage - 1) {
        pages.push(page(i));
      } else if (i === currentPage + 2 || i === currentPage - 2) {
        pages.push(
          <div key={i}>
            <span>...</span>
          </div>,
        );
      }
    } else {
      pages.push(page(i));
    }
  }

  if (totalPages > 1)
    pages.push(
      <div className="" key={totalPages + 1} onClick={nextPage}>
        <ArrowRightIcon strokeWidth="0.5" className="size-4" />
      </div>,
    );
  else pages.push(<div key={totalPages + 2} className="size-4"></div>);

  return (
    <div className="flex justify-center items-center mb-[4px]">{pages}</div>
  );
}
