import { getProfessors } from "../libs/professorsApi"
import { getTeacherData } from "../utils/teacher"

export const getTeachersFormatted = async (active: boolean, formData: any) => {
    const professors: any[] = await getProfessors(active)
    if (professors.length) {
        let formattedTeachers: any[] = []
        await Promise.all(
            professors.map(async (professor: any) => {
                const teacherData = await getTeacherData(Number(professor.ci), {}, false)
                formattedTeachers.push({
                    ...formData,
                    ...teacherData,
                    personId: teacherData.teacherId,
                    activeLabel: teacherData.active ? "Activo" : "Inactivo"
                })
            })
        )
        return formattedTeachers.sort((a, b) => a.id - b.id);
    } else {
        return []
    }
}