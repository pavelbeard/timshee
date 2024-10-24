import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useResetFilters } from "../../../lib/hooks";
import Checkboxes from "./Checkboxes";
import FilterBlockLg from "./FilterBlockLg";
import FilterDropdown from "./FilterDropdown";

export default function FiltersGroupLg() {
  const { t } = useTranslation();
  const { selectedLength: selected } = useSelector((s) => s.store);
  const { sizes, colors, types, collections, categories } = useSelector(
    (s) => s.store,
  );
  const reset = useResetFilters();

  return (
    <div>
      <label className="roboto-text tracking-wide">{t("shop:filters")}</label>
      <div className="lg:flex lg:relative lg:z-10 lg:mt-2">
        <FilterBlockLg title={t("shop:size")}>
          <FilterDropdown reset={reset.sizes} selected={selected.sizes}>
            <Checkboxes
              data={sizes}
              htmlFor={"value"}
              labelTextKey={"value"}
              category={"sizes"}
              idKey={"value"}
            />
          </FilterDropdown>
        </FilterBlockLg>
        <FilterBlockLg title={t("shop:color")}>
          <FilterDropdown reset={reset.colors} selected={selected.colors}>
            <Checkboxes
              data={colors}
              htmlFor={"hex"}
              labelTextKey={"name"}
              category={"colors"}
              idKey={"hex"}
            />
          </FilterDropdown>
        </FilterBlockLg>
        <FilterBlockLg title={t("shop:type")}>
          <FilterDropdown reset={reset.types} selected={selected.types}>
            <Checkboxes
              data={types}
              htmlFor={"code"}
              labelTextKey={"name"}
              category={"types"}
              idKey={"code"}
            />
          </FilterDropdown>
        </FilterBlockLg>
        <FilterBlockLg title={t("shop:collection")}>
          <FilterDropdown
            reset={reset.collections}
            selected={selected.collections}
          >
            <Checkboxes
              data={collections}
              htmlFor={"link"}
              labelTextKey={"name"}
              category={"collections"}
              idKey={"link"}
            />
          </FilterDropdown>
        </FilterBlockLg>
        <FilterBlockLg title={t("shop:category")}>
          <FilterDropdown
            reset={reset.categories}
            selected={selected.categories}
          >
            <Checkboxes
              data={categories}
              htmlFor={"code"}
              labelTextKey={"name"}
              category={"categories"}
              idKey={"code"}
            />
          </FilterDropdown>
        </FilterBlockLg>
      </div>
    </div>
  );
}
