import React, { useEffect, useState } from "react";
import CustomTable from "../table";
import { signIn } from "../../libs/usersApi";
import { getProfessorInfo } from "../../libs/proffesorsApi";
import { getAbsences } from "../../libs/absencesApi";
import { getTeacherData } from "../../utils/teacher";

const Carousel = () => {
  const headers = [
    { name: "name", value: "Nombre" },
    { name: "lastname", value: "Apellido" },
    { name: "group", value: "Grupo" },
    { name: "matter", value: "Materia" },
    { name: "startDate", value: "Fecha Incio" },
    { name: "endDate", value: "Fecha Fin" },
  ];
  const DEFAULT_FORM_DATA = {
    id: -1,
    groupId: "",
    matterId: "",
    gmpId: "",
    gmps: [],
    turn: "",
    turnId: -1,
    startDate: "",
    endDate: "",
    document: "",
    name: "",
    lastname: "",
    reason: "",
    groupMatter: [],
    active: false
  };

  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [absences, setAbsences] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { token } = await signIn(56660749, "1234");
      if (token) {
        localStorage.setItem("token", token)
        await getAbsencesList(true)
      }
    }
    fetchData()
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAbsences((prevArray) => {
        const newArray = [...prevArray];
        newArray.push(newArray.shift());
        return newArray;
      });
    }, 2500);
    return () => clearInterval(intervalId);
  }, []);

  const getAbsencesListFormatted = async (state: boolean) => {
    const absences = await getAbsences(state)
    if (absences) {
      let formattedAbsences: any[] = []
      await Promise.all(
        absences.map(async (absence: any) => {
          const { person } = await getProfessorInfo(absence.gmp.proffessorId)
          const teacherData = await getTeacherData(Number(person.ci), formData)
          const filtredGmp = teacherData?.gmps.reduce((acc: any, gmp: any) => {
            const selectedMatters = gmp.matters.filter((matter: any) => matter.gmpId === absence.gmpId);
            if (selectedMatters.length > 0) {
              acc.push({ group: gmp.group, matter: selectedMatters[0] });
            }
            return acc;
          }, []);

          if (filtredGmp.length) {
            const { group, matter } = filtredGmp[0]
            const gmpData = teacherData?.gmps.filter((gmp: any) => (gmp.group.id === group.id))[0]
            formattedAbsences.push({
              id: absence.id,
              document: person.ci,
              name: person.name,
              lastname: person.lastname,
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

  const formatToLocalDate = (newDate: string) => {
    const date = new Date(newDate);
    const options: any = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('es-ES', options)
  }

  const getAbsencesList = async (state: boolean) => {
    const responseAbsences: any = await getAbsencesListFormatted(state)
    if (responseAbsences) {
      setAbsences(responseAbsences)
    }
  }

  return (
    <div>
      <p className="my-4 ml-3 text-xl">Lista de Inasistencias</p>
      <CustomTable
        className="text-xl"
        headers={headers}
        items={absences}
        onSelectRow={() => { }}
        fontSize="xl"
      />
    </div>
  );
};

export default Carousel;
