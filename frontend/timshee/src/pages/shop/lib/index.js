import {getItems} from "../../../lib/shop";

export const fetchItems = async ({
    itemsObject,
    gender,
    collection,
    category,
    type,
    sizes,
    colors,
    types,
    filters,
    sortOrder,
    currentPage
}) => {
    if(itemsObject === null) {
        const result = await getItems({
            filters: {
                gender: gender,
                collection: collection,
                category: category,
                type: [type],
            },
            currentPage: currentPage,
        });
        return result;
    } else if (
        sizes.length > 0 &&
        colors.length > 0 &&
        types.length > 0
    ) {
        const f = {
            sizes: sizes?.filter(s => s.checked).map(s => s.value),
            colors: colors?.filter(c => c.checked).map(c => c.value),
            category: category,
            orderBy: sortOrder?.filter(so => filters.includes(so.name))[0]?.value,
            gender: gender,
            collection: collection,
            types: types?.filter(t => t.checked).map(t => t.code),
        };

        const result = await getItems({
            filters: f,
            currentPage: currentPage,
        });
        return result;
    }
}