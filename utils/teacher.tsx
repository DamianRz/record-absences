import { getPerson } from "../libs/personApi";
import { getProfessor } from "../libs/proffesorsApi";
import { getGmpsByTeacherId, getGMPSortedByGroup } from "./gmp";

export const getTeacher = async (document: number) => {
    const person = await getPerson(document);
    const teacher: any = await getProfessor(document);
    if (person && teacher) return { ...person, teacherId: teacher.id, active: teacher.active }
    return undefined
}

export const getTeacherData = async (document: number, formData: any) => {
    const teacher = await getTeacher(document);
    const gmps = await getGmpsByTeacherId(teacher?.teacherId)
    const formattedGmps = await getGMPSortedByGroup(gmps)
    if (teacher && gmps) {
        return ({
            ...formData,
            ...teacher,
            gmps: formattedGmps,
            document: String(teacher.ci),
        });
    }
    return undefined
}