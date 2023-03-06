import { getPerson } from "../libs/personApi";
import { getProfessor } from "../libs/proffesorsApi";
import { getGmpsSortedByTeacherId } from "./gmp";

export const getTeacher = async (document: number) => {
    const teacher: any = await getProfessor(document);
    if (teacher.length > 0) return teacher[0]
    return undefined
}

export const getTeacherData = async (document: number, formData: any) => {
    const teacher = await getTeacher(document)
    if (teacher) {
        const gmps = await getGmpsSortedByTeacherId(teacher?.id)
        if (gmps) {
            return ({
                ...formData,
                ...teacher,
                gmps: gmps,
                document: String(teacher.ci),
            });
        }
    }
    return []
}