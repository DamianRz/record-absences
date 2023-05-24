import { getSpecialtiesByTeacher } from "../libs/specialtiesApi"

export const getSpecialtiesFormatted = async (teacherId: number) => {
    const specialties = await getSpecialtiesByTeacher(teacherId)

    let formattedSpecialties: any = []
    let matterSpecialtyIds: any = []
    specialties.forEach((specialty: any) => {
        formattedSpecialties.push({ id: specialty.id, matter: specialty.matter })
        matterSpecialtyIds.push(specialty.matter.id)
    });

    const specialtyNames = formattedSpecialties.map(
        (specialty: any) => (`${specialty.matter.name}-${specialty.matter.code}`))

    return {
        specialties: formattedSpecialties,
        specialtyNames: specialtyNames,
        matterSpecialtyIds: matterSpecialtyIds,
    }
}
