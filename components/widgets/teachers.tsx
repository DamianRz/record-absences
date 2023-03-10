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
  FormLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Box,
  Chip,
} from "@mui/material";
import CustomTable from "../table";
import {
  getSpecialtiesByTeacher,
  updateSpecialties,
} from "../../libs/specialtiesApi";
import { createProfessor, getProfessorInfo, getProfessors, saveProfessor } from "../../libs/proffesorsApi";
import { getTeacherData } from "../../utils/teacher";
import { setStoreMatters } from "../../utils/matters";
import { getSpecialtiesByNames } from "../../utils/specialties";
import { GRADES, TURNS } from "../../utils/groups";
import { getGmpsSortedByTeacherId } from "../../utils/gmp";
import { createGmp, getGMP, saveGmp } from "../../libs/gmpsApi";
import { LoaderContext } from "../../contexts/loader";
import { getFilteredMGs } from "../../utils/mg";

const Teachers2 = () => {

  const headers = [
    { name: "id", value: "ID" },
    { name: "name", value: "Nombre" },
    { name: "lastname", value: "Apellido" },
    { name: "ci", value: "CI" },
    { name: "activeLabel", value: "Activo" },
  ];

  const groupsHeader = [
    { name: "id", value: "ID" },
    { name: "groupName", value: "Grupo" },
    { name: "matterName", value: "Materia" },
    { name: "turnName", value: "Turno" },
    { name: "grade", value: "Grado" },
    { name: "activeLabel", value: "Estado" },
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
    personId: -1,
    teacherId: -1,
    document: "",
    groupId: "",
    matterId: "",
    gmpId: "",
    gmps: [],
    specialties: [],
    specialtyNames: [],
    matterSpecialtyIds: [],
    availableMGs: [],
    selectedGroupsNames: [],
    selectedMGIds: [],
    turn: "",
    turnId: "",
    selectedGrade: "",
    name: "",
    lastname: "",
    active: false,
    activeLabel: ""
  };

  interface IFormData {
    id: number,
    personId: number,
    teacherId: number,
    document: number | string,
    groupId: number | string,
    matterId: number | string,
    gmpId: number | string | null,
    gmps: any[],
    specialties: any[],
    specialtyNames: string[],
    matterSpecialtyIds: number[],
    availableMGs: any[],
    selectedGroupsNames: string[],
    selectedMGIds: number[],
    turn: number | string,
    turnId: number | string,
    selectedGrade: number | string,
    name: string,
    lastname: string,
    active: boolean,
    activeLabel: string
  }

  interface IGmp {
    id: number | null,
    gmpId: null | number,
    matterName: string,
    groupName: string,
    turnName: string,
    grade: number | null,
    activeLabel: string,
    active: boolean
  }

  const SELECTED_GMP = {
    id: null,
    gmpId: null,
    matterName: "",
    groupName: "",
    turnName: "",
    grade: null,
    activeLabel: "",
    active: false
  }

  const [open, setOpen] = useState(false);
  const [showConfirmChangeState, setShowConfirmChangeState] = useState(false);
  const [selectedGmp, setSelectedGmp] = useState<IGmp>(SELECTED_GMP);
  const [editId, setEditId] = useState(null);
  const [teachers, setTeachers] = useState([])
  const [formData, setFormData] = useState<IFormData>(DEFAULT_FORM_DATA)
  const [matters, setMatters] = useState([])
  const [errors, setErrors] = useState({
    error: "",
    errorFilters: false,
    errorSave: false
  });
  const [teachersState, setTeachersState] = useState({ active: true });
  const { isLoading, setLoading } = useContext(LoaderContext);

  useEffect(() => {
    const fetchToken = async () => {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (token) {
        const mattersList: any = await setStoreMatters()
        setMatters(mattersList)
        await getTeacherList(true)
      } else {
        window.location.href = '/';
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
    const response: any = await getTeachersFormatted(active)
    if (response) setTeachers(response)
  }

  const getTeachersFormatted = async (active: boolean) => {
    const professors: any[] = await getProfessors(active)
    if (professors.length) {
      let formattedProfessors: any[] = []
      await Promise.all(
        professors.map(async (professor: any) => {
          const teacherData = await getTeacherData(Number(professor.ci), {})

          const specialties = await getSpecialtiesByTeacher(teacherData.teacherId)
          let formattedSpecialties: any = []
          let matterSpecialtyIds: any = []
          specialties.forEach((specialty: any) => {
            formattedSpecialties.push({ id: specialty.id, matter: specialty.matter })
            matterSpecialtyIds.push(specialty.matter.id)
          });

          const specialtyNames = formattedSpecialties.map(
            (specialty: any) => (`${specialty.matter.name}`))

          formattedProfessors.push({
            ...formData,
            ...teacherData,
            personId: teacherData.teacherId,
            specialties: formattedSpecialties,
            specialtyNames: specialtyNames,
            matterSpecialtyIds: matterSpecialtyIds,
            activeLabel: teacherData.active ? "Activo" : "Inactivo"
          })
        })
      )
      return formattedProfessors.sort((a, b) => a.id - b.id);
    } else {
      return []
    }
  }

  const handleEdit = async (selectedRow: any) => {
    setEditId(selectedRow.id)
    setFormData({
      ...selectedRow,
    })
    setOpen(true)
  };

  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleOpen = () => {
    setEditId(null);
    setFormData(DEFAULT_FORM_DATA);
    setOpen(true);
  };

  const handleClose = async () => {
    await getTeacherList(true)
    setEditId(null)
    setOpen(false);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (editId) {
      const teacher = {
        name: formData.name,
        lastname: formData.lastname,
        active: formData.active
      }
      const teacherResponse = await saveProfessor(editId, teacher)

      const specialties = await getSpecialtiesByNames(formData.specialtyNames)
      let formattedSpecialties: any = []
      let removeSpecialties: any = []
      specialties.map(async (specialty: any) => {
        const specialtyBody = {
          proffessorId: editId,
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
  };

  const handleSpecialtyChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setFormData({ ...formData, specialtyNames: typeof value === "string" ? value.split(",") : value })
  };

  const handleSelectSpecialty = (selectedMatter: { id: number, name: string }) => {
    if (formData.specialtyNames.indexOf(selectedMatter.name) === -1) {
      formData.matterSpecialtyIds.push(selectedMatter.id)
      formData.specialtyNames.push(selectedMatter.name)
    } else {
      const filteredNames = formData.specialtyNames.filter(
        (name: string) => name !== selectedMatter.name
      );
      const filteredIds = formData.matterSpecialtyIds.filter(
        (id: number) => id !== selectedMatter.id
      );
      formData.matterSpecialtyIds = filteredIds
      formData.specialtyNames = filteredNames
    }
  };

  const handleGroupsChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setFormData({ ...formData, selectedGroupsNames: typeof value === "string" ? value.split(",") : value })
  };

  const handleSelectGroup = (mg: any) => {
    if (formData.selectedGroupsNames.indexOf(`${mg.group.name}-${mg.matter.name}`) === -1) {
      formData.selectedMGIds.push(mg.id)
      formData.selectedGroupsNames.push(`${mg.group.name}-${mg.matter.name}`)
    } else {
      const filteredNames = formData.selectedGroupsNames.filter(
        (name: string) => name !== `${mg.group.name}-${mg.matter.name}`
      );
      const filteredIds = formData.selectedMGIds.filter(
        (id: number) => id !== mg.id
      );
      formData.selectedMGIds = filteredIds
      formData.selectedGroupsNames = filteredNames
    }
  };

  const searchGroupsByFilters = async () => {
    setLoading(true)
    setErrors({ ...errors, errorFilters: false })
    let MGList: any = []
    await Promise.all(
      formData.matterSpecialtyIds.map(async (id) => {
        const mgFilters = {
          "matterId": id,
          "group": {
            "grade": formData.selectedGrade,
            "turnId": formData.turnId,
            "active": true
          }
        }

        const MGs = await getFilteredMGs(mgFilters)

        let mgsFilteredByGMPs: any = []
        await Promise.all(
          MGs.map(async (mg: any) => {
            const filter = { mgId: mg.id, active: true }
            const exists: any = await getGMP(null, filter)
            if (!exists.length) {
              mgsFilteredByGMPs.push(mg)
            }
          })
        )

        const filteredNotSavedInGmps = mgsFilteredByGMPs.filter((a: any) => {
          let found = true;
          formData.gmps.map((b: any) => {
            if (b.group.id === a.group.id) found = false
          })
          return found
        })

        MGList = [...MGList, ...filteredNotSavedInGmps]
      })
    )
    setFormData({
      ...formData,
      availableMGs: MGList,
      selectedGroupsNames: [],
      selectedMGIds: []
    })
    if (MGList.length === 0) setErrors({ ...errors, errorFilters: true })
    setLoading(false)
  }

  const formatGMPbyHeaders = (gmps: any) => {
    const formatted = gmps.map((gmp: any) => ({
      id: gmp.group.id,
      gmpId: gmp.matters[0].gmpId,
      matterName: gmp.matters[0].name,
      groupName: gmp.group.name,
      turnName: TURNS[gmp.group.turnId - 1].name,
      grade: gmp.group.grade,
      activeLabel: gmp.active ? "ACTIVO" : "INACTIVO",
      active: gmp.active
    }))
    return formatted
  }

  const onAddGMP = async () => {
    await Promise.all(
      formData.selectedMGIds.map(async (mgId: number) => {
        const gmp = {
          mgId: mgId,
          proffessorId: formData.teacherId,
          active: true
        }
        await createGmp(gmp)
      })
    )
    const gmps: any = await getGmpsSortedByTeacherId(formData.teacherId)
    setFormData({ ...formData, gmps })
  }

  const changeSateSelectedGmp = async () => {
    if (typeof selectedGmp.gmpId !== "object") {
      await saveGmp(selectedGmp.gmpId, { active: !selectedGmp.active })
      setSelectedGmp(SELECTED_GMP)
      setShowConfirmChangeState(false)
      const gmps: any = await getGmpsSortedByTeacherId(formData.teacherId)
      setFormData({ ...formData, gmps })
    }
  }

  return (
    <div>
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
      <p className="my-4 text-xl">{teachersState.active ? "Profesores Activos" : "Profesores Inactivos"}</p>
      <CustomTable
        className="max-h-[400px]"
        headers={headers}
        items={teachers}
        onSelectRow={handleEdit}
      />
      <Dialog open={open} className="max-w-xl mx-auto">
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
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
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
                <p className="my-2 text-sm">Asignar grupos</p>
                <div className="flex space-x-2">
                  <FormControl sx={{ minWidth: "150px" }}>
                    <InputLabel id="turn-select">Turno</InputLabel>
                    <Select
                      name="turnId"
                      labelId="turn-select"
                      value={formData.turnId}
                      onChange={handleChange}
                      input={<OutlinedInput label="Turno" />}
                    >
                      {TURNS.map((turn) => (
                        <MenuItem key={turn.id} value={turn.id}>
                          {turn.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl className="w-full">
                    <InputLabel id="select-grade">Grado</InputLabel>
                    <Select
                      name="selectedGrade"
                      labelId="select-grade"
                      value={formData.selectedGrade}
                      onChange={handleChange}
                      input={<OutlinedInput label="Grado" />}
                      MenuProps={MenuProps}
                    >
                      {GRADES.map((grade: number, index: number) => (
                        <MenuItem
                          key={index}
                          value={grade}
                        >
                          {`${grade}º`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="outlined"
                    onClick={() => searchGroupsByFilters()}
                    className="w-full mx-4 normal-case"
                    disabled={!(formData.turnId && formData.selectedGrade && formData.matterSpecialtyIds) && isLoading}
                  >
                    Filtrar Grupos
                  </Button>
                </div>





                {(formData.availableMGs.length > 0) && (
                  <div className="flex w-full mt-4 mb-4 space-x-2">
                    <FormControl className="w-full min-w-[350px]">
                      <InputLabel id="groups-select">Seleccione Grupos</InputLabel>
                      <Select
                        labelId="groups-select"
                        multiple
                        value={formData.selectedGroupsNames}
                        onChange={handleGroupsChange}
                        input={<OutlinedInput label="Seleccione Grupos" />}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                      >
                        {formData.availableMGs.map((mg: any, index) => (
                          <MenuItem
                            className="h-[20px]"
                            key={index}
                            value={`${mg.group.name}-${mg.matter.name}`}
                            onClick={() => {
                              handleSelectGroup(mg);
                            }}
                          >
                            <Checkbox
                              checked={
                                formData.selectedGroupsNames.indexOf(`${mg.group.name}-${mg.matter.name}`) > -1
                              }
                            />
                            <ListItemText primary={`${mg.group.name}-${mg.matter.name}`} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button
                      color="success"
                      variant="outlined"
                      onClick={() => onAddGMP()}
                      className="w-full mx-4 normal-case"
                      disabled={formData.selectedGroupsNames.length === 0}
                    >
                      Agregar
                    </Button>
                  </div>
                )}

                {errors.errorFilters && (
                  <p className="mb-4 text-red-400">No se han encontrado grupos con los filtros seleccionados</p>
                )}
                <p className="my-4 text-sm">Grupos Asignados</p>
                {
                  formatGMPbyHeaders(formData.gmps).length ? (
                    <CustomTable
                      className="max-h-[160px]"
                      headers={groupsHeader}
                      items={formatGMPbyHeaders(formData.gmps)}
                      onSelectRow={(row: any) => {
                        setSelectedGmp(row)
                        setShowConfirmChangeState(true)
                      }}
                    />
                  ) : (<p className="mb-4 text-center">No tiene grupos asignados</p>)
                }

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
              </>
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
              disabled={isLoading}
            >
              {editId ? "Guardar" : "Crear"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={showConfirmChangeState} className="max-w-xl mx-auto">
        <DialogTitle className="text-sm">
          {selectedGmp.active ? "Esta seguro de que desea DESACTIVAR esta asignacion de grupo?" : "Esta seguro de que desea ACTIVAR esta asignacion de grupo?"}
        </DialogTitle>
        <DialogActions className="pb-4 pr-4 space-x-4">
          <Button
            onClick={() => setShowConfirmChangeState(false)}
            variant="outlined"
            size="small"
            className="normal-case"
          >
            Cancelar
          </Button>
          <Button
            color="warning"
            variant="outlined"
            size="small"
            className="normal-case"
            onClick={() => changeSateSelectedGmp()}
            disabled={isLoading}
          >
            {`Si, deseo ${selectedGmp.active ? "DESACTIVAR" : "ACTIVAR"}`}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Teachers2;
