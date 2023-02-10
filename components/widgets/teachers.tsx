import React, { useEffect, useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  IconButton,
  TableContainer,
  FormControlLabel,
  Radio,
  FormLabel,
  RadioGroup,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import CustomTable from "../table";
import {
  createSpecialty,
  getSpecialties,
  getSpecialtiesByTeacher,
  updateSpecialties,
} from "../../libs/specialtiesApi";
import { signIn } from "../../libs/usersApi";
import { getProfessorInfo, getProfessors, saveProfessor } from "../../libs/proffesorsApi";
import { getTeacherData } from "../../utils/teacher";
import { formatToISO } from "../../utils/date";
import { getMatters } from "../../libs/mattersApi";
import { getStoreMatters, setStoreMatters } from "../../utils/matters";
import { savePerson } from "../../libs/personApi";
import { getSpecialtiesByNames } from "../../utils/specialties";

const Teachers2 = () => {

  const headers = [
    { name: "id", value: "ID" },
    { name: "name", value: "Nombre" },
    { name: "lastname", value: "Apellido" },
    { name: "ci", value: "CI" },
    { name: "activeLabel", value: "Activo" },
  ];

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
    personId: -1,
    teacherId: -1,
    document: "",
    groupId: "",
    matterId: "",
    gmpId: "",
    gmps: [],
    specialties: [],
    specialtyNames: [],
    turn: "",
    turnId: -1,
    name: "",
    lastname: "",
    active: false,
    activeLabel: ""
  };

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [teachers, setTeachers] = useState([])
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA)
  const [matters, setMatters] = useState([])
  const [errors, setErrors] = useState({ visible: false, error: "" });

  useEffect(() => {
    const fetchToken = async () => {
      const { token } = await signIn(56660749, "1234");
      if (token) {
        localStorage.setItem("token", token)
      }
    }
    const fetchData = async () => {
      setMatters(await setStoreMatters())
      await getTeacherList(true)
    }
    fetchToken()
    fetchData()
  }, []);

  const getTeacherList = async (active: boolean) => {
    const response: any = await getTeachersFormatted(active)
    if (response) setTeachers(response)
  }

  const getTeachersFormatted = async (active: boolean) => {
    const professors = await getProfessors(active)
    if (professors) {
      let formattedProfessors: any[] = []
      await Promise.all(
        professors.map(async (professor: any) => {
          const { person } = await getProfessorInfo(professor.id)
          const teacherData = await getTeacherData(Number(person.ci), {})

          const specialties = await getSpecialtiesByTeacher(teacherData.teacherId)
          let formattedSpecialties: any = []
          specialties.forEach((specialty: any) => {
            formattedSpecialties.push({ id: specialty.id, matter: specialty.matter })
          });

          const specialtyNames = formattedSpecialties.map(
            (specialty: any) => (`${specialty.matter.name}`))

          formattedProfessors.push({
            ...formData,
            ...teacherData,
            personId: person.id,
            specialties: formattedSpecialties,
            specialtyNames: specialtyNames,
            activeLabel: teacherData.active ? "Activo" : "Inactivo"
          })
        })
      )
      return formattedProfessors.sort((a, b) => a.id - b.id);
    }
  }

  const handleEdit = async (selectedRow: any) => {
    setEditId(selectedRow.id)
    setFormData({
      ...selectedRow,
    })
    setOpen(true)
  };












  ///////////////
  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleActiveChange = (event: any) => {
    setFormData({
      ...formData,
      active: event.target.value === "true",
    });
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
      const person = {
        name: formData.name,
        lastname: formData.lastname,
        ci: Number(formData.document)
      }
      const personResponse = await savePerson(formData.personId, person)
      const teacherResponse = await saveProfessor(formData.teacherId, { active: formData.active })
      const specialties = await getSpecialtiesByNames(formData.specialtyNames)

      // TODO refactor this

      let formattedSpecialties: any = []
      let removeSpecialties: any = []
      specialties.map(async (specialty: any) => {
        const specialtyBody = {
          proffessorId: formData.teacherId,
          matterId: specialty.id
        }
        formattedSpecialties.push(specialtyBody)

        removeSpecialties = formData.specialties.filter((a: any) => (
          formData.specialtyNames.indexOf(a.matter.name) === -1
        ))
      })

      const formattedRemoveSpecialties: any = []
      removeSpecialties.map((spe: any) => {
        formattedRemoveSpecialties.push(spe.id)
      })

      await updateSpecialties(formattedSpecialties, formattedRemoveSpecialties)

      if (personResponse && teacherResponse) {
        await getTeacherList(true)
        setOpen(false);
        setEditId(null)
      } else {
        setErrors({ visible: true, error: "No se han podido guardar los cambios" })
      }
    } else {
      const body = {
        // gmpId: gmpId,
        // turnId: selectedGmp.group.turnId,
        // startDate: formData.startDate,
        // endDate: formData.endDate,
        // reason: formData.reason,
        // active: true
      }
      // const response = await createAbsence(body)
      if (response) {
        // await getAbsencesList(true)
        setOpen(false);
        setEditId(null)
        // setGmpId(undefined)
        // setSelectedGmp(undefined)
      } else {
        setErrors({ visible: true, error: "No se ha podido crear el profesor" })
      }
    }
  };

  const handleSpecialtyChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setFormData({ ...formData, specialtyNames: typeof value === "string" ? value.split(",") : value })
  };

  const handleSelectSpecialty = (specialty: { id: number, name: string }) => {
    if (formData.specialtyNames.indexOf(specialty.name) === -1) {
      setFormData({ ...formData, specialtyNames: [...formData.specialtyNames, specialty.name] })
    } else {
      const filtered = formData.specialtyNames.filter(
        (name: string) => name !== specialty.name
      );
      setFormData({ ...formData, specialtyNames: filtered })
    }
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="success"
        onClick={handleOpen}
        endIcon={<PersonAddIcon />}
        className="mx-4 my-4 normal-case"
      >
        Nuevo profesor
      </Button>
      <CustomTable
        headers={headers}
        items={teachers}
        onSelectRow={handleEdit}
      />
      <Dialog open={open} className="max-w-sm mx-auto">
        <DialogTitle className="text-sm">
          {editId ? "Editar profesor" : "Nuevo profesor"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent className="grid justify-center">
            <div className="flex space-x-2">
              <FormControl className="w-full">
                <TextField
                  required
                  label="Nombre"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full max-w-xs leading-normal text-gray-900 bg-white rounded-md focus:outline-none focus:shadow-outline"
                  variant="outlined"
                  size="small"
                />
              </FormControl>
              <FormControl className="w-full">
                <TextField
                  required
                  label="Apellido"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="w-full max-w-xs leading-normal text-gray-900 bg-white rounded-md focus:outline-none focus:shadow-outline"
                  variant="outlined"
                  size="small"
                />
              </FormControl>
            </div>
            <FormControl className="w-full my-4">
              <TextField
                required
                label="CI"
                name="document"
                type="number"
                value={formData.document}
                onChange={handleChange}
                className="w-full max-w-xs leading-normal text-gray-900 bg-white rounded-md focus:outline-none focus:shadow-outline"
                variant="outlined"
                size="small"
              />
            </FormControl>
            <FormControl className="w-full my-4">
              <InputLabel id="specialties-select">Especialidades</InputLabel>
              <Select
                required
                labelId="specialties-select"
                multiple
                value={formData.specialtyNames}
                onChange={handleSpecialtyChange}
                input={<OutlinedInput label="Especialidades" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {(matters || []).map((matter: any, index) => (
                  <MenuItem
                    className="h-[20px]"
                    key={index}
                    value={matter.name}
                    onClick={() => {
                      handleSelectSpecialty(matter);
                    }}
                  >
                    <Checkbox
                      checked={
                        formData.specialtyNames.indexOf(matter.name) > -1
                      }
                    />
                    <ListItemText primary={matter.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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

export default Teachers2;
