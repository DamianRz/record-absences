import { getGMP } from "../libs/gmpsApi";
import { getMgById } from "../libs/mgsApi";

export const getGmpsByTeacherId = async (teacherId: number) => {
    let gmps: any[] = [];
    const gmp = await getGMP(teacherId, {});
    if (gmp) {
        await Promise.all(
            gmp.map(async (item: any) => {
                const { matter, group } = await getMgById(item.mgId);
                if (matter && group) gmps.push({ id: item.id, matter, group, active: item.active })
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
                active: gmp.active
            }
        } else {
            gmpsSorted[gmp.group.id].matters.push({ ...gmp.matter, gmpId: gmp.id, });
        }
    })
    return Object.values(gmpsSorted);
}

export const getGmpsSortedByTeacherId = async (teacherId: number) => {
    const gmps = await getGmpsByTeacherId(teacherId)
    return await getGMPSortedByGroup(gmps)
}