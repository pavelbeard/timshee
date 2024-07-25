import { API_URL } from "../../config";

export async function getCategories() {
    try {
        const response = await fetch(API_URL + "api/store/categories/", {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json();
    } catch (error) {
        return error;
    }
}

export async function getCollections() {
    try {
        const url = `${API_URL}/api/store/collections/`;
        const response = await fetch(url, {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json();
    } catch (error) {
        return error;
    }
}

export async function checkInStock ({itemId, size, color}) {
    try {
        const url = [
            `${API_URL}api/store/stocks/`,
            `?item__id=${itemId}`,
            `&size__id=${size}`,
            `&color__id=${color}`
        ].join("");
        const response = await fetch(encodeURI(url), {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const json = await response.json();
        const inStock = parseInt(json[0]?.in_stock);
        return inStock;
    } catch (error) {
        return error;
    }
}

export async function getSizes () {
    try {
        const response = await fetch(API_URL + "api/store/sizes/");

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const json = await response.json();
        const newSizes = [];
        json.forEach((item) => {
            newSizes.push({
                id: item.id,
                value: item.value,
                checked: false
            });
        });
        return newSizes;
    } catch (error) {
        return error;
    }
}

export async function getColors() {
    try {
        const url = `${API_URL}api/store/colors/`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const json = await response.json();
        const newColors = [];
        json.forEach((item) => {
            newColors.push({
                id: item.id,
                value: item.name,
                hex: item.hex,
                checked: false});
        })

        return newColors;
    } catch (error) {
        return error;
    }
}

export async function getTypes () {
    try {
        const url = `${API_URL}api/store/types/`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const json = await response.json();
        const newTypes = [];
        json.forEach((item) => {
            newTypes.push({
                id: item.id,
                value: item.name,
                code: item.code,
                checked: false
            });
        });

        return newTypes;
    } catch (error) {
        return error;
    }
}

export async function getItems ({filters, currentPage=1}) {
    try {
        const filterSizes = filters?.sizes?.length > 0
            ? `&sizes__value__in=${filters?.sizes?.join(',')}`
            : "";
        const filterColors = filters?.colors?.length > 0
            ? `&colors__name__in=${filters?.colors.join(',')}`
            : "";
        const filterCategory = filters?.category
            ? `&type__category__code=${filters?.category}`
            : "";
        const filterOrderBy = filters?.orderBy
            ? `&o=${filters.orderBy}`
            : "";
        const filterGender = filters?.gender
            ? `&gender=${filters.gender}`
            : "";
        const filterCollection = filters?.collection
            ? `&collection__link=${filters.collection}`
            : "";
        const filterTypes = filters?.types
            ? `&type__code__in=${filters.types.join(',')}`
            : "";
        const encodedURI = encodeURI(API_URL
            + `api/store/items/?${currentPage === 1 ? "" : `page=${currentPage}`}`
            + filterSizes
            + filterColors
            + filterCategory
            + filterOrderBy
            + filterGender
            + filterCollection
            + filterTypes
        );

        const response = await fetch(encodedURI, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const json = await response.json();
        return {
            pagesCount: Math.ceil(json.count / 9),
            items: json.results,
            totalItemsCount: json.count,
            totalSizes: json.total_sizes,
            totalColors: json.total_colors,
            totalTypes: json.total_types
        }
    } catch (error) {
        return error;
    }
}

export async function getCollectionLinks() {
    try {
        const response = await fetch(API_URL + "api/store/collections/", {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error('Could not find collection links');
        }
        return await response.json();
    } catch (error) {
        return error;
    }
}