import { getPerson } from "../libs/personApi";
import { getProfessor } from "../libs/proffesorsApi";
import { getGmpsSortedByTeacherId } from "./gmp";

export const getTeacher = async (document: number) => {
    const person: any = await getPerson(document);
    if (person) {
        const response: any = await getProfessor(person.id);
        if (response.length > 0) {
            const teacher: any = response[0]
            return { ...person, teacherId: teacher.id, active: teacher.active }
        }
    }
    return undefined
}

export const getTeacherData = async (document: number, formData: any) => {
    const teacher = await getTeacher(document);
    console.log("x", teacher)
    if (teacher) {
        const gmps = await getGmpsSortedByTeacherId(teacher?.teacherId)
        if (gmps) {
            return ({
                ...formData,
                ...teacher,
                gmps: gmps,
                document: String(teacher.ci),
            });
        }
    }
    return undefined
}