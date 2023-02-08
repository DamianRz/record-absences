import { getGMP } from "../libs/gmpsApi";
import { getMgs } from "../libs/mgsApi";

export const getGmpsByTeacherId = async (teacherId: number) => {
    let gmps: any[] = [];
    const gmp = await getGMP(teacherId);
    await Promise.all(
        gmp.map(async (item: any) => {
            const { matter, group } = await getMgs(item.mgId);
            if (matter && group) gmps.push({ id: item.id, matter, group })
        }));
    return gmps;
}

export const getGMPSortedByGroup = (gmps: any[]) => {
    let gmpsSorted: any[] = []
    gmps.forEach((gmp) => {
        if (!gmpsSorted[gmp.group.id]) {
            gmpsSorted[gmp.group.id] = {
                group: gmp.group,
                matters: [{ ...gmp.matter, gmpId: gmp.id, }],
            }
        } else {
            gmpsSorted[gmp.group.id].matters.push({ ...gmp.matter, gmpId: gmp.id, });
        }
    })
    return Object.values(gmpsSorted);
}