import React, { useContext, useEffect, useState } from "react";
import CustomTable from "../table";
import { getProfessorInfo } from "../../libs/professorsApi";
import { getAbsences } from "../../libs/absencesApi";
import { getTeacherData } from "../../utils/teacher";
import { LoaderContext } from "../../contexts/loader";
import { formatToLocalDate } from "../../utils/date";

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
  const { setLoading } = useContext(LoaderContext)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (token) {
        await getAbsencesList(true)
      } else {
        window.location.href = '/';
      }
      setLoading(false)
    }
    fetchData()
  }, []);

  useEffect(() => {
    if (absences.length) {
      const intervalId = setInterval(() => {
        setAbsences((prevArray) => {
          const newArray: any = [...prevArray];
          newArray.push(newArray.shift());
          return newArray;
        });
      }, 1200);
      return () => clearInterval(intervalId);
    }
  }, []);

  const getAbsencesListFormatted = async (state: boolean) => {
    const absences = await getAbsences(state)
    if (absences) {
      let formattedAbsences: any[] = []
      await Promise.all(
        absences.map(async (absence: any) => {
          const { ci } = await getProfessorInfo(absence.gmp.proffessorId)
          const teacherData = await getTeacherData(Number(ci), formData, false)
          const filteredGmp = teacherData?.gmps.reduce((acc: any, gmp: any) => {
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
