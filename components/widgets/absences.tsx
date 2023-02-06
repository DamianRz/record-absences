import React, { useEffect, useState } from "react";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  OutlinedInput,
  DialogTitle,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import axios from "axios";
import CustomTable from "../table";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { signIn } from "../../libs/usersApi";
import { getPerson } from "../../libs/personApi";
import { getProfessor, getProfessorInfo } from "../../libs/proffesorsApi";
import { getGMP } from "../../libs/gmpsApi";
import { getMgs } from "../../libs/mgsApi";
import { getAbsences, saveAbsence } from "../../libs/absencesApi";
import ES from 'dayjs/locale/es';

const Absences = () => {
  const mokAbsences = [
    {
      id: 1,
      name: "Juan",
      lastname: "Pérez",
      ci: 123456,
      group: "A",
      matter: "Matemáticas",
      startDate: "01/01/2020",
      endDate: "01/06/2020",
      active: true,
    },
    {
      id: 2,
      name: "María",
      lastname: "González",
      ci: 123457,
      group: "B",
      matter: "Historia",
      startDate: "01/02/2020",
      endDate: "01/07/2020",
      active: false,
    },
    {
      id: 3,
      name: "Pedro",
      lastname: "Rodríguez",
      ci: 123458,
      group: "C",
      matter: "Inglés",
      startDate: "01/03/2020",
      endDate: "01/08/2020",
      active: true,
    },
    {
      id: 4,
      name: "Ana",
      lastname: "Sánchez",
      ci: 123459,
      group: "D",
      matter: "Física",
      startDate: "01/04/2020",
      endDate: "01/09/2020",
      active: false,
    },
    {
      id: 5,
      name: "Pablo",
      lastname: "Martínez",
      ci: 123460,
      group: "E",
      matter: "Química",
      startDate: "01/05/2020",
      endDate: "01/10/2020",
      active: true,
    },
    {
      id: 6,
      name: "Sandra",
      lastname: "Lopez",
      ci: 123461,
      group: "F",
      matter: "Biología",
      startDate: "01/06/2020",
      endDate: "01/11/2020",
      active: false,
    },
    {
      id: 7,
      name: "Carlos",
      lastname: "Gómez",
      ci: 123462,
      group: "G",
      matter: "Geografía",
      startDate: "01/07/2020",
      endDate: "01/12/2020",
      active: true,
    },
    {
      id: 8,
      name: "Laura",
      lastname: "Díaz",
      ci: 123463,
      group: "H",
      matter: "Español",
      startDate: "01/08/2020",
      endDate: "01/01/2021",
      active: false,
    },
    {
      id: 9,
      name: "Alberto",
      lastname: "Jiménez",
      ci: 123464,
      group: "I",
      matter: "Lenguaje",
      startDate: "01/09/2020",
      endDate: "01/02/2021",
      active: true,
    },
    {
      id: 10,
      name: "Sonia",
      lastname: "Ruiz",
      ci: 123465,
      group: "J",
      matter: "Literatura",
      startDate: "01/10/2020",
      endDate: "01/03/2021",
      active: false,
    },
  ];
  const headers = [
    { name: "id", value: "id" },
    { name: "document", value: "CI" },
    { name: "name", value: "Nombre" },
    { name: "lastname", value: "Apellido" },
    { name: "group", value: "Grupo" },
    { name: "matter", value: "Materia" },
    { name: "startDate", value: "Fecha Incio" },
    { name: "endDate", value: "Fecha Fin" },
    { name: "activeLabel", value: "Activo" },
  ];
  const TURNS =
    [
      { id: 1, name: "Matutino" },
      { id: 2, name: "Vespertino" },
      { id: 3, name: "Nocturno" }
    ]
  const ITEM_HEIGHT = 30;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const DEFAULT_FORM_DATA = {
    groupId: null,
    matterId: null,
    gmpId: null,
    gmps: [],
    turn: "",
    startDate: "",
    endDate: "",
    document: "",
    name: "",
    lastname: "",
    reason: "",
    groupMatter: [],
    active: false
  };
  interface FromDataProps {
  }
  interface GroupMatterProps {
    id: number,
    matterId: number,
    groupId: number,
    matter: {
      id: number,
      name: string,
      description: string
    },
    group: {
      id: number,
      grade: number,
      name: string,
      description: string,
      turnId: number,
      active: boolean
    }
  }
  interface TeacherDataProps {
    groupMatter: GroupMatterProps[],
    teacher: {
      active: boolean,
      ci: number,
      id: number,
      name: string,
      lastname: string,
      personId: number
    }
  }
  const ERRORS = {
    search: false,
    save: false
  }

  const [open, setOpen] = useState(false);
  const [professors, setProfessors] = useState(mokAbsences);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [editId, setEditId] = useState(null);
  const [selectedGroupMatter, setSelectedGroupMatter] = useState();
  const [errors, setErrors] = useState(ERRORS);
  const [absences, setAbsences] = useState([]);

  const [selectedGmp, setSelectedGmp] = useState<any>()
  const [gmpId, setGmpId] = useState()

  useEffect(() => {
    const fetchData = async () => {
      const { token } = await signIn(56660749, "1234");
      if (token) {
        localStorage.setItem("token", token)
        await getAbsencesList()
      }
    }
    fetchData()
  }, []);

  useEffect(() => {
    console.log(selectedGmp)
  }, [selectedGmp])

  const getAbsencesListFormatted = async () => {
    const absences = await getAbsences()
    if (absences) {
      let formattedAbsences: any[] = []
      await Promise.all(
        absences.map(async (absence: any) => {
          const { person } = await getProfessorInfo(absence.gmp.proffessorId)
          const teacherData = await getTeacherData(Number(person.ci))
          const filtredGmp = teacherData?.gmps.reduce((acc, gmp) => {
            const selectedMatters = gmp.matters.filter((matter: any) => matter.gmpId === absence.gmpId);
            if (selectedMatters.length > 0) {
              acc.push({ group: gmp.group, matter: selectedMatters[0] });
            }
            return acc;
          }, []);
          const { group, matter } = filtredGmp[0]
          const gmpData = teacherData?.gmps.filter((gmp) => (gmp.group.id === group.id))[0]
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
        }))
      return formattedAbsences.sort((a, b) => a.id - b.id);
    }
  }

  const formatToLocalDate = (newDate: string) => {
    const date = new Date(newDate);
    const options: any = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('es-ES', options)
  }

  function formatToISO(newDate: string) {
    const dateArr = newDate.split("/");
    const day = Number(dateArr[0]);
    const month = Number(dateArr[1]);
    const year = Number(dateArr[2]);
    const date = new Date(year, month - 1, day);
    return date.toISOString();
  }

  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleOpen = () => {
    setEditId(null);
    setFormData(DEFAULT_FORM_DATA);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (editId) {
    } else {
      const body = {
        gmpId: gmpId,
        turnId: selectedGmp.group.turnId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        active: true
      }
      const response = await saveAbsence(body)
      if (response) {
        await getAbsencesList()
        setOpen(false);
        setEditId(null)
        setGmpId(undefined)
        setSelectedGmp(undefined)
      } else {
        setErrors({ ...errors, save: true })
      }
    }
  };

  const handleEdit = async (selectedRow: any) => {
    setEditId(selectedRow.id)
    const teacherData = await getTeacherData(Number(selectedRow.document));
    if (teacherData) {
      setFormData({
        ...selectedRow
      })
      setSelectedGmp(selectedRow.gmpData)
      setOpen(true)
    }
  };

  const handleSearch = async () => {
    setErrors({ ...errors, search: false })
    const teacherData = await getTeacherData(Number(formData.document));
    if (teacherData) {
      setFormData(teacherData)
    } else {
      setErrors({ ...errors, search: true })
    }
  }

  const getAbsencesList = async () => {
    const responseAbsences = await getAbsencesListFormatted()
    if (responseAbsences) {
      setAbsences(responseAbsences)
    }
  }

  const getTeacherData = async (document: number) => {
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

  const getGmpsByTeacherId = async (teacherId: number) => {
    let gmps: any[] = [];
    const gmp = await getGMP(teacherId);
    await Promise.all(
      gmp.map(async (item: any) => {
        const { matter, group } = await getMgs(item.mgId);
        if (matter && group) gmps.push({ id: item.id, matter, group })
      }));
    return gmps;
  }

  const getTeacher = async (document: number) => {
    const person = await getPerson(document);
    const teacher: any = await getProfessor(document);
    if (person && teacher) return { ...person, teacherId: teacher.id }
    return undefined
  }

  const getGMPSortedByGroup = (gmps: any[]) => {
    let gmpsSorted: any[] = []
    gmps.forEach((gmp) => {
      if (!gmpsSorted[gmp.group.id]) {
        gmpsSorted[gmp.group.id] = {
          group: gmp.group,
          matters: [{ ...gmp.matter, gmpId: gmp.id, }],
        }
      } else {
        gmpsSorted[gmp.group.id].matters.push({ ...gmp.matter, gmpId: gmp.id, });
      }
    })
    return Object.values(gmpsSorted);
  }

  return (
    <div>
      <Button
        variant="outlined"
        color="success"
        onClick={handleOpen}
        endIcon={<EventBusyIcon />}
        className="mx-4 my-4 normal-case"
      >
        Nuevo Inasistencia
      </Button>
      <CustomTable
        headers={headers}
        items={absences}
        onSelectRow={handleEdit}
      />
      <Dialog open={open} className="mx-auto ">
        <DialogTitle className="text-sm">
          {editId ? "Editar insasistencia" : "Nuevo Inasistencia"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent className="grid justify-center">
            <div className="flex space-x-2">
              <FormControl className="w-full mb-4">
                <TextField
                  required
                  label="Documento"
                  name="document"
                  type="text"
                  value={formData.document}
                  onChange={handleChange}
                  className="w-full max-w-xs leading-normal text-gray-900 bg-white rounded-md focus:outline-none focus:shadow-outline"
                  variant="outlined"
                  size="small"
                  disabled={editId != undefined}
                />
              </FormControl>
              <Button
                type="button"
                variant="outlined"
                size="small"
                className="normal-case max-h-[40px] min-w-[200px]"
                onClick={handleSearch}
                disabled={editId != undefined}
              >
                Buscar
              </Button>
            </div>
            {errors.search && (
              <p className="mb-4 text-red-400">{`No se han encontrado resultados`}</p>
            )}
            {errors.save && (
              <p className="mb-4 text-red-400">{`No se ha podido crear la inasistencia`}</p>
            )}
            {formData && (
              <p className="mb-4 ">{`Nombre: ${formData.name} ${formData.lastname}`}</p>
            )}
            <div className="flex space-x-2">
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={ES}>
                <DesktopDatePicker
                  label="Fecha inicio"
                  inputFormat="DD/MM/YYYY"
                  value={formData.startDate}
                  onChange={(value) => setFormData({ ...formData, startDate: value })}
                  minDate={new Date()}
                  disabled={!Boolean(formData.name)}
                  renderInput={(params) => <TextField {...params} error={false} required />}
                />
                <DesktopDatePicker
                  label="Fecha fin"
                  inputFormat="DD/MM/YYYY"
                  value={formData.endDate}
                  onChange={(value) => setFormData({ ...formData, endDate: value })}
                  minDate={formData.startDate}
                  disabled={!Boolean(formData.name)}
                  renderInput={(params) => <TextField {...params} error={false} required />}
                />
              </LocalizationProvider>
            </div>
            <div className="flex space-x-2">
              <FormControl className="w-full my-4">
                <InputLabel id="select-group">Grupo</InputLabel>
                <Select
                  required
                  name="groupId"
                  labelId="select-group"
                  value={formData.groupId}
                  onChange={handleChange}
                  input={<OutlinedInput label="Grupo" />}
                  MenuProps={MenuProps}
                  disabled={!formData.endDate}
                >
                  {formData.gmps.map((gmp: any, index: number) => (
                    <MenuItem
                      key={index}
                      value={gmp.group.id}
                      onClick={() => { setSelectedGmp(gmp) }}
                    >
                      {`${gmp.group.name} - (${TURNS[gmp.group.turnId].name})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className="w-full my-4">
                <InputLabel id="select-matter">Materia</InputLabel>
                <Select
                  required
                  name="matterId"
                  labelId="select-matter"
                  value={formData.matterId}
                  onChange={handleChange}
                  input={<OutlinedInput label="Materia" />}
                  MenuProps={MenuProps}
                  disabled={!formData.endDate}
                >
                  {(selectedGmp?.matters || []).map((matter: any, index: number) => (
                    <MenuItem
                      key={index}
                      value={matter.id}
                      onClick={() => { setGmpId(matter.gmpId) }}
                    >
                      {matter.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <p>{JSON.stringify(gmpId)}</p>
            </div>
            <div>
              <FormControl className="items-center w-full mb-4">
                <TextField
                  required
                  label="Motivo"
                  name="reason"
                  type="text"
                  value={formData.reason}
                  onChange={handleChange}
                  className="flex w-full max-w-xs leading-normal text-gray-900 bg-white rounded-md align-center focus:outline-none focus:shadow-outline"
                  variant="outlined"
                  multiline
                  disabled={!Boolean(formData.name)}
                />
              </FormControl>
            </div>

            {editId && (
              <FormControl className="w-full my-4">
                <FormLabel id="radio-active">Estado</FormLabel>
                <RadioGroup
                  aria-labelledby="radio-active"
                  name="active"
                  defaultValue={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Activo"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="Inactivo"
                  />
                </RadioGroup>
              </FormControl>
            )}


          </DialogContent>
          <DialogActions className="pb-4 pr-4 space-x-4">
            <Button
              onClick={handleClose}
              variant="outlined"
              size="small"
              className="normal-case"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              color="success"
              variant="outlined"
              size="small"
              className="normal-case"
            >
              {editId ? "Guardar" : "Crear"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Absences;
