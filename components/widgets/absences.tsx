import React, { useEffect, useState, useContext } from "react";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CustomTable from "../table";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getProfessorInfo } from "../../libs/professorsApi";
import { createAbsence, getAbsences, saveAbsence } from "../../libs/absencesApi";
import ES from 'dayjs/locale/es';
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
} from "@mui/material";
import { getTeacherData } from "../../utils/teacher";
import { LoaderContext } from "../../contexts/loader";

const Absences = () => {
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

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({ visible: false, error: "" });
  const [absences, setAbsences] = useState([]);
  const [absencesState, setAbsencesState] = useState({ active: true });
  const [selectedGmp, setSelectedGmp] = useState<any>()
  const [gmpId, setGmpId] = useState()

  const { isLoading, setLoading } = useContext(LoaderContext)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (token) {
        await getAbsencesList(true)
      } else {
        window.location.href = '/';
      }
    }
    fetchData()
    setLoading(false)
  }, []);

  const getAbsencesListFormatted = async (state: boolean) => {
    const absences = await getAbsences(state)
    if (absences) {
      let formattedAbsences: any[] = []
      await Promise.all(
        absences.map(async (absence: any) => {

          console.log("abs", absence)
          const { ci = undefined } = await getProfessorInfo(Number(absence.gmp.proffessorId));

          const teacherData = await getTeacherData(ci, formData)
          console.log("TD", teacherData)

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
      const body = {
        gmpId: gmpId,
        turnId: formData.turnId,
        startDate: new Date(formData.startDate).toISOString().split(".")[0],
        endDate: new Date(formData.endDate).toISOString().split(".")[0],
        reason: formData.reason,
        active: formData.active
      }
      const response = await saveAbsence(formData.id, body)
      if (response) {
        await getAbsencesList(true)
        setOpen(false);
        setEditId(null)
        setGmpId(undefined)
        setSelectedGmp(undefined)
      } else {
        setErrors({ visible: true, error: "No se han podido guardar los cambios" })
      }
    } else {
      const body = {
        gmpId: gmpId,
        turnId: selectedGmp.group.turnId,
        startDate: new Date(formData.startDate).toISOString().split(".")[0],
        endDate: new Date(formData.endDate).toISOString().split(".")[0],
        reason: formData.reason,
        active: true
      }
      const response = await createAbsence(body)
      if (response) {
        await getAbsencesList(true)
        setOpen(false);
        setEditId(null)
        setGmpId(undefined)
        setSelectedGmp(undefined)
      } else {
        setErrors({ visible: true, error: "No se ha podido crear la inasistencia" })
      }
    }
  };

  const handleEdit = async (selectedRow: any) => {
    setEditId(selectedRow.id)
    setFormData({
      ...selectedRow,
      startDate: formatToISO(selectedRow.startDate),
      endDate: formatToISO(selectedRow.endDate)
    })
    setSelectedGmp(selectedRow.gmpData)
    setOpen(true)
  };

  const handleSearch = async () => {
    setErrors({ visible: false, error: "" })
    const teacherData = await getTeacherData(Number(formData.document), formData);
    if (teacherData) {
      setFormData({
        ...formData,
        ...teacherData,
      })
    } else {
      setErrors({ visible: true, error: "No se han encontrado resultados" })
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
      <div className="my-4 space-x-4">
        <Button
          variant="outlined"
          color="success"
          onClick={handleOpen}
          endIcon={<EventBusyIcon />}
          className="normal-case "
          disabled={isLoading}
        >
          Nuevo Inasistencia
        </Button>
        <Button
          variant="outlined"
          color={absencesState.active ? "warning" : "success"}
          onClick={() => {
            setAbsencesState({ active: !absencesState.active })
            getAbsencesList(!absencesState.active)
          }}
          className="normal-case"
          disabled={isLoading}
        >
          {absencesState.active ? "Ver inasistencias inactivas" : "Ver inasistencias activas"}
        </Button>
      </div>
      <p className="my-4 text-xl">{absencesState.active ? "Inasistencias Activas" : "Inasistencias Inactivas"}</p>
      <CustomTable
        className=""
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
                className="normal-case max-h-[40px]"
                onClick={handleSearch}
                disabled={editId != undefined}
                sx={{ minWidth: "200px" }}
              >
                Buscar
              </Button>
            </div>
            {errors.visible && (
              <p className="mb-4 text-red-400">{errors.error}</p>
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
                  onChange={(value: any) => setFormData({ ...formData, startDate: value })}
                  minDate={new Date()}
                  disabled={!Boolean(formData.name)}
                  renderInput={(params) => <TextField {...params} error={false} required />}
                />
                <DesktopDatePicker
                  label="Fecha fin"
                  inputFormat="DD/MM/YYYY"
                  value={formData.endDate}
                  onChange={(value: any) => setFormData({ ...formData, endDate: value })}
                  minDate={formData.startDate}
                  disabled={!Boolean(formData.name)}
                  renderInput={(params) => <TextField {...params} error={false} required />}
                />
              </LocalizationProvider>
            </div>
            <div className="flex py-4 space-x-2">
              <FormControl className="w-full">
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
                      {`${gmp.group.name} - (${TURNS[(gmp.group.turnId - 1)].name})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className="w-full">
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
            </div>
            <div className="mb-4">
              <FormControl className="items-center w-full">
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
                <Button
                  className="max-w-[200px]"
                  size="large"
                  variant="outlined"
                  color={formData.active ? "success" : "warning"}
                  onClick={() => {
                    setFormData({ ...formData, active: !formData.active })
                  }}
                >
                  {formData.active ? "ACTIVO" : "INACTIVO"}
                </Button>
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
