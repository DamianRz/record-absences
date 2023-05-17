import React, { useContext, useEffect, useState } from "react";
import CustomTable from "../table";
import { getProfessorInfo } from "../../libs/professorsApi";
import { getAbsences } from "../../libs/absencesApi";
import { getTeacherData } from "../../utils/teacher";
import { LoaderContext } from "../../contexts/loader";
import { formatToLocalDate } from "../../utils/date";
import { Button } from "@mui/material";

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
    const intervalId = setInterval(() => {
      setAbsences((prevArray) => {
        const newArray: any = [...prevArray];
        newArray.push(newArray.shift());
        return newArray;
      });
    }, 1200);
    return () => clearInterval(intervalId);
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
    const responseAbsences: any = await getAbsencesListFormatted(state);
    if (responseAbsences) {
      setAbsences(responseAbsences.sort((a: any, b: any) => a.id - b.id));
    }
  };

  return (
    <div className="py-4">
      <Button
        href={"/absences"}
        variant="outlined"
        size="small"
        className="normal-case"
      >
        Volver al inicio
      </Button>
      <p className="my-4 text-xl">Lista de Inasistencias</p>
      {
        absences.length > 0 && (
          <CustomTable
            className="text-xl"
            headers={headers}
            items={absences}
            onSelectRow={() => { }}
            fontSize="xl"
            showFilters={false}
          />
        )
      }
    </div>
  );
};

export default Carousel;
