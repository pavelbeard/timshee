import { clsx } from "clsx";

export default function FiltersContainerLg({ children }) {
  const filtersContainerStyle = clsx(
    "hidden",
    "lg:grid lg:grid-cols-3 lg:mx-6 lg:my-2 lg:relative lg:z-0",
  );
  return <div className={filtersContainerStyle}>{children}</div>;
}
