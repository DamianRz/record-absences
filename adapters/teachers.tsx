import { getProfessors } from "../libs/professorsApi"

export const getTeachersFormatted = async (active: boolean, formData: any) => {
    const professors: any[] = await getProfessors(active)
    if (professors.length) {
        let formattedTeachers: any[] = []
        await Promise.all(
            professors.map(async (teacher: any) => {
                formattedTeachers.push({
                    ...formData,
                    ...teacher,
                    personId: teacher.id,
                    activeLabel: teacher.active ? "Activo" : "Inactivo"
                })
            })
        )
        return formattedTeachers.sort((a, b) => a.id - b.id);
    } else {
        return []
    }
}