import { getGroups } from "../libs/groupsApi";
import { getMgById, getMgsBasicIds } from "../libs/mgsApi";

export const getFilteredMGs = async (filters: any) => {
    let mgs: any[] = []
    const {
        matterId = undefined,
        group: groupFilters = undefined
    } = filters
    const mgsResponse: any[] = await getMgsBasicIds((matterId ? { matterId } : {}))
    if (groupFilters) {
        const groups: any[] = await getGroups(groupFilters);
        let filteredMgIds: number[] = []
        mgsResponse.map(mg => {
            const exists = groups.filter(group => (group.id === mg.groupId))
            if (exists.length) filteredMgIds.push(mg.id)
        })
        await Promise.all(
            filteredMgIds.map(async (mgId) => {
                const response = await getMgById(mgId)
                if (response) mgs.push(response)
            })
        )
    }
    return mgs
}
