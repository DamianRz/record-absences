import { IAbsencesFormatted, ABSENCES_FORM } from "../constants/absences"
import { getAbsences } from "../libs/absencesApi"
import { getProfessorInfo } from "../libs/professorsApi"
import { formatToLocalDate } from "../utils/date"
import { getTeacherData } from "../utils/teacher"

export const getAbsencesListFormatted = async (state: boolean, formData: typeof ABSENCES_FORM) => {
    const absences = await getAbsences(state)
    if (absences) {
        let formattedAbsences: IAbsencesFormatted[] = []
        await Promise.all(
            await absences.map(async (absence) => {
                const { ci = undefined } = await getProfessorInfo(Number(absence.gmp.proffessorId));
                const teacherData = await getTeacherData(ci, formData)

                const filteredGmp: any[] = (teacherData?.gmps || []).reduce((acc: any, gmp: any) => {
                    const selectedMatters = gmp.matters.filter((matter: any) => matter.gmpId === absence.gmpId);
                    if (selectedMatters.length > 0) {
                        acc.push({ group: gmp.group, matter: selectedMatters[0] });
                    }
                    return acc;
                }, []);

                if (filteredGmp.length) {
                    const { group, matter } = filteredGmp[0]
                    const gmpData = teacherData?.gmps.filter((gmp: any) => (gmp.group.id === group.id))[0]
                    formattedAbsences.push({
                        id: absence.id,
                        document: teacherData.ci,
                        name: teacherData.name,
                        lastname: teacherData.lastname,
                        group: group.name,
                        groupId: group.id,
                        matter: matter.name,
                        matterId: matter.id,
                        gmpId: matter.gmpId,
                        gmps: teacherData?.gmps,
                        gmpData: gmpData,
                        reason: absence.reason,
                        startDate: formatToLocalDate(absence.startDate),
                        endDate: formatToLocalDate(absence.endDate),
                        turnName: absence.turn.name,
                        turnId: absence.turn.id,
                        active: absence.active,
                        activeLabel: absence.active ? "Activo" : "Inactivo"
                    })
                }
            }))
        return formattedAbsences.sort((a, b) => a.id - b.id);
    }
}