import React, { useContext, useEffect, useMemo, useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Box,
  Chip,
  FormLabel,
} from "@mui/material";
import CustomTable from "../table";
import {
  updateSpecialties,
} from "../../libs/specialtiesApi";
import { createProfessor, saveProfessor } from "../../libs/professorsApi";
import { setStoreMatters } from "../../utils/matters";
import { getSpecialtiesByNames } from "../../utils/specialties";
import { createGmp, saveGmp } from "../../libs/gmpsApi";
import { LoaderContext } from "../../contexts/loader";
import { TEACHER_DEFAULT_FORM_DATA, TEACHER_HEADERS } from "../../constants/teachers";
import { MenuProps } from "../../constants/styles";
import { GroupsAssigner } from "../groupsAssingner";
import { getTeachersFormatted } from "../../adapters/teachers";
import { getSpecialtiesFormatted, upgradeSpecialties } from "../../adapters/specialties";
import { UserContext } from "../../contexts/userContext";
import { useRouter } from "next/router";
import { getTeacherData } from "../../utils/teacher";
import { getGmpsSortedByTeacherId } from "../../utils/gmp";

const Teachers = () => {

  const DEFAULT_ERRORS = {
    name: { visible: false, error: "" },
    lastname: { visible: false, error: "" },
    document: { visible: false, error: "" },
  }

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [teachers, setTeachers] = useState([])
  const [formData, setFormData] = useState<any>(TEACHER_DEFAULT_FORM_DATA)
  const [currentSelectedRow, setCurrentSelectedRow] = useState<any>()
  const [matters, setMatters] = useState([])
  const [errors, setErrors] = useState({
    error: "",
    errorFilters: false,
    errorSave: false
  });
  const [formErrors, setFormErrors] = useState(DEFAULT_ERRORS);

  const [teachersState, setTeachersState] = useState({ active: true });

  const { isLoading, setLoading } = useContext(LoaderContext);
  const { userIsNormal } = useContext(UserContext)
  const router = useRouter()

  useEffect(() => {
    const fetchToken = async () => {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (token) {
        const mattersList: any = await setStoreMatters()
        setMatters(mattersList)
        await getTeacherList(true)
      } else {
        router.push('/');
      }
      setLoading(false)
    }
    fetchToken()
  }, []);

  useMemo(() => {
    formData.selectedGrade = ""
    formData.turnId = ""
    formData.availableMGs = []
  }, [formData.specialtyNames])

  const getTeacherList = async (active: boolean) => {
    setLoading(true)
    const response: any = await getTeachersFormatted(active, formData)
    if (response) setTeachers(response)
    setLoading(false)
  }

  const handleEdit = async (selectedRow: any) => {
    setLoading(true)
    setFormErrors(DEFAULT_ERRORS)
    setEditId(selectedRow.id)

    const {
      matterSpecialtyIds,
      specialties,
      specialtyNames
    } = await getSpecialtiesFormatted(selectedRow.id)

    const gmps = await getGmpsSortedByTeacherId(selectedRow.id, false)

    // save for validation
    const newCopy = {}
    Object.assign(newCopy, {
      ...selectedRow,
      matterSpecialtyIds,
      specialties,
      specialtyNames,
      teacherId: selectedRow.id,
      gmps: gmps,
      document: String(selectedRow.ci),
    })
    setCurrentSelectedRow(newCopy)
    setFormData({
      ...selectedRow,
      matterSpecialtyIds,
      specialties,
      specialtyNames,
      teacherId: selectedRow.id,
      gmps: gmps,
      document: String(selectedRow.ci),
    })
    setLoading(false)
    setOpen(true)
  };

  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleOpen = () => {
    setEditId(null);
    setFormData(TEACHER_DEFAULT_FORM_DATA);
    setFormErrors(DEFAULT_ERRORS)
    setOpen(true);
  };

  const handleClose = async () => {
    setOpen(false);
    setEditId(null);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (
      formData.name == currentSelectedRow?.name &&
      formData.lastname == currentSelectedRow?.lastname &&
      formData.active == currentSelectedRow?.active &&
      formData.specialtyNames == currentSelectedRow?.specialtyNames &&
      formData.updatedGmps.length == 0 &&
      formData.selectedMGIds == currentSelectedRow?.selectedMGIds
    ) {
      setOpen(false);
      setEditId(null)
      return null
    }

    // validation
    let failed = false
    let error = {}
    // validate length
    Object.keys(formErrors).map((fieldName: string) => {
      if (fieldName !== "document" && formData[fieldName].length > 30) {
        const newError = {
          [fieldName]: {
            visible: true,
            error: "El texto es muy largo"
          }
        }
        Object.assign(error, newError)
        failed = true
      }
      // DOCUMENTO
      if (fieldName === "document" && formData[fieldName].length > 10) {
        const newError = {
          [fieldName]: {
            visible: true,
            error: "El documento es muy largo"
          }
        }
        Object.assign(error, newError)
        failed = true
      }

      if (fieldName === "document" && formData[fieldName].length < 6) {
        const newError = {
          [fieldName]: {
            visible: true,
            error: "El documento es muy corto"
          }
        }
        Object.assign(error, newError)
        failed = true
      }
    })

    const existsDocument = Boolean(teachers.filter((teacher: any) => teacher.document === formData.document).length)
    if (existsDocument) {
      if (!editId) {
        setFormErrors({
          ...formErrors,
          ...error,
          document: {
            visible: true,
            error: "Ya existe este documento, por favor ingrese un nuevo documento"
          }
        })
        failed = true
      }
    } else if (failed) {
      setFormErrors({
        ...formErrors,
        ...error,
      })
    }
    if (failed) return null;
    setLoading(true)

    if (editId) {
      // teacher info
      const teacher = {
        name: formData.name,
        lastname: formData.lastname,
        active: formData.active
      }
      const teacherResponse = await saveProfessor(editId, teacher)

      // specialties
      if (formData.specialtyNames !== currentSelectedRow?.specialtyNames) {
        await upgradeSpecialties(
          currentSelectedRow?.specialties,
          [...currentSelectedRow?.specialtyNames],
          formData.specialtyNames,
          editId)
      }

      // state modification
      if (formData.updatedGmps.length) {
        await Promise.all(
          formData.updatedGmps.map(async (item: any) => {
            await saveGmp(item.gmpId, { active: item.active })
          })
        )
      }
      // creation
      if (formData.selectedMGIds.length) {
        await Promise.all(
          formData.selectedMGIds.map(async (mgId: number) => {
            const gmp = {
              mgId: mgId,
              proffessorId: editId,
              active: true
            }
            await createGmp(gmp)
          })
        )
      }
      if (teacherResponse) {
        setOpen(false);
        await getTeacherList(true)
        setEditId(null)
      } else {
        setErrors({ ...errors, errorSave: true, error: "No se han podido guardar los cambios" })
      }
    } else {
      const teacher: any = {
        name: formData.name,
        lastname: formData.lastname,
        ci: Number(formData.document),
        active: true
      }
      const teacherResponse = await createProfessor(teacher)
      if (teacherResponse) {
        await getTeacherList(true)
        setOpen(false);
        setEditId(null)
      }
    }
    setLoading(false)
  };

  const handleSpecialtyChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setFormData({ ...formData, specialtyNames: typeof value === "string" ? value.split(",") : value })
  };

  const handleSelectSpecialty = (selectedMatter: { id: number, name: string, code: string }) => {
    const matterCode = `${selectedMatter.name}-${selectedMatter.code}`
    if (formData.specialtyNames.indexOf(matterCode) === -1) {
      formData.matterSpecialtyIds.push(selectedMatter.id)
      formData.specialtyNames.push(matterCode)
    } else {
      const filteredNames = formData.specialtyNames.filter(
        (name: string) => name !== matterCode
      );
      const filteredIds = formData.matterSpecialtyIds.filter(
        (id: number) => id !== selectedMatter.id
      );
      formData.matterSpecialtyIds = filteredIds
      formData.specialtyNames = filteredNames
    }
  };

  return (
    <div>
      {!userIsNormal() && (
        <div className="my-4 space-x-4">
          <Button
            variant="outlined"
            color="success"
            onClick={handleOpen}
            endIcon={<PersonAddIcon />}
            className="normal-case"
            disabled={isLoading}
          >
            Nuevo profesor
          </Button>
          <Button
            variant="outlined"
            color={teachersState.active ? "warning" : "success"}
            onClick={() => {
              setTeachersState({ active: !teachersState.active })
              getTeacherList(!teachersState.active)
            }}
            className="normal-case"
            disabled={isLoading}
          >
            {teachersState.active ? "Ver profesores inactivos" : "Ver profesores activos"}
          </Button>
        </div>
      )}
      <p className="my-4 text-xl">{teachersState.active ? "Profesores Activos" : "Profesores Inactivos"}</p>
      <CustomTable
        className="max-h-[400px]"
        headers={TEACHER_HEADERS}
        items={teachers}
        onSelectRow={handleEdit}
        disabledSelectRow={userIsNormal()}
      />
      <Dialog open={open} className="mx-auto">
        <DialogTitle className="text-sm">
          {editId ? "Editar profesor" : "Nuevo profesor"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent className="grid justify-center">
            <div className="flex mb-4 space-x-2">
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
                  error={formErrors.name.visible}
                  helperText={formErrors.name.visible && formErrors.name.error}
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
                  error={formErrors.lastname.visible}
                  helperText={formErrors.lastname.visible && formErrors.lastname.error}
                />
              </FormControl>
            </div>
            <div className="mb-4">
              <FormControl className="w-full">
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
                  disabled={Boolean(editId)}
                  error={formErrors.document.visible}
                  helperText={formErrors.document.visible && formErrors.document.error}
                />
              </FormControl>
            </div>
            {editId && (
              <>
                <FormControl className="w-full">
                  <InputLabel id="specialties-select">Especialidades</InputLabel>
                  <Select
                    className="mb-4"
                    required
                    labelId="specialties-select"
                    multiple
                    value={formData.specialtyNames}
                    onChange={handleSpecialtyChange}
                    input={<OutlinedInput label="Especialidades" />}
                    MenuProps={MenuProps}
                    renderValue={(selected: any) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value: any) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {(matters || []).map((matter: any, index) => (
                      <MenuItem
                        className="h-[20px]"
                        key={index}
                        value={`${matter.name}-${matter.code}`}
                        onClick={() => {
                          handleSelectSpecialty(matter);
                        }}
                      >
                        <Checkbox
                          checked={
                            formData.specialtyNames.indexOf(`${matter.name}-${matter.code}`) > -1
                          }
                        />
                        <ListItemText primary={`${matter.name}-${matter.code}`} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
            {editId && (
              <GroupsAssigner
                formData={formData}
                onSelectMatterAndGroup={
                  (MGs: any[]) => {
                    setFormData({ ...formData, selectedMGIds: MGs })
                  }}
                onChangeGMPState={(GMPs: any[]) => { setFormData({ ...formData, updatedGmps: GMPs }) }}
                onChangeField={handleChange}
              />
            )}
            <div className="my-4">
              <FormControl className="w-full">
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
            </div>
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
              onClick={() => setFormErrors(DEFAULT_ERRORS)}
              disabled={isLoading}
            >
              {editId ? "Guardar" : "Crear"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Teachers;
