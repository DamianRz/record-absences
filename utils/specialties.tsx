import { getStoreMatters } from "./matters"

export const getSpecialtiesByNames = async (names: string[]) => {
    const matters = getStoreMatters()
    let filteredMatters: any = []
    names.map(name => {
        const selectedMatter = matters.filter((matter: any) => (`${matter.name}-${matter.code}` === name))
        if (selectedMatter) filteredMatters.push(selectedMatter[0])
    })
    return filteredMatters
}
