import { createSpecialty, getSpecialtiesByTeacher, removeSpecialty, updateSpecialties } from "../libs/specialtiesApi"
import { getSpecialtiesByNames } from "../utils/specialties"

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

export const upgradeSpecialties = async (
    initialSpecialties: any[],
    initialSpecialtyNames: string[],
    specialtyNames: string[],
    teacherId: number) => {

    const toRemove = initialSpecialties.filter((spe: any) => (specialtyNames.indexOf(`${spe.matter.name}-${spe.matter.code}`) == -1))
    // console.log("toRemove", toRemove)

    const toCreate = specialtyNames.filter((matterCode: string) =>
        !initialSpecialties.some((item: any) => `${item.matter.name}-${item.matter.code}` === matterCode)
    );
    // console.log("toCreate", toCreate);

    const specialtiesToCreate = await getSpecialtiesByNames(toCreate)

    Promise.all(
        specialtiesToCreate.map(async (matter: any) => {
            const specialtyBody = {
                proffessorId: teacherId,
                matterId: matter.id
            }
            await createSpecialty(specialtyBody)
        })
    )
    Promise.all(
        toRemove.map(async (spe: any) => {
            await removeSpecialty(spe.id)
        })
    )
}