import { getMatters } from "../libs/mattersApi"

export const getStoreMatters = () => {
    return sortMattersByName(JSON.parse(localStorage.getItem("matters") || "[]"))
}

export const setStoreMatters = async () => {
    const response: any = await getMatters(true)
    localStorage.setItem("matters", JSON.stringify(response))
    return sortMattersByName(response)
}

export const sortMattersByName = (matters: any[]) => {
    matters.sort(function (a: any, b: any) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    return matters
}
