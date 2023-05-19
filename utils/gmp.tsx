import { getGMP } from "../libs/gmpsApi";
import { getMgById } from "../libs/mgsApi";
import { getStoreMGs } from "./mg";

export const getGmpsByTeacherId = async (teacherId: number, usingStore: boolean) => {
    let gmps: any[] = [];
    let gmp;

    if (usingStore) {
        gmp = getStoreGMPs().filter(item => item.proffessorId === teacherId);
    } else {
        gmp = await getGMP(teacherId, {});
    }

    if (gmp) {
        await Promise.all(
            gmp.map(async (item: any) => {
                let mgs;
                if (usingStore) {
                    mgs = await getStoreMGs().filter(mg => mg.id === item.mgId)[0];
                } else {
                    mgs = await getMgById(item.mgId);
                }
                const { matter, group } = mgs;
                if (matter && group) gmps.push({ id: item.id, matter: { ...matter, active: item.active }, group, active: item.active })
            }));
    }
    return gmps;
}

export const getGMPSortedByGroup = (gmps: any[]) => {
    let gmpsSorted: any[] = []
    gmps.forEach((gmp) => {
        if (!gmpsSorted[gmp.group.id]) {
            gmpsSorted[gmp.group.id] = {
                group: gmp.group,
                matters: [{ ...gmp.matter, gmpId: gmp.id, }],
                active: gmp.active,
                updated: false,
            }
        } else {
            gmpsSorted[gmp.group.id].matters.push({ ...gmp.matter, gmpId: gmp.id, });
        }
    })
    return Object.values(gmpsSorted);
}

export const getGmpsSortedByTeacherId = async (teacherId: number, usingStore: boolean) => {
    const gmps = await getGmpsByTeacherId(teacherId, usingStore)
    return getGMPSortedByGroup(gmps)
}

export const loadStoreGMPs = async () => {
    const gmps = await getGMP(null, {})
    localStorage.setItem("gmps", JSON.stringify(gmps))
}

export const getStoreGMPs: () => any[] = () => {
    return JSON.parse(localStorage.getItem("gmps") || "[]")
}
