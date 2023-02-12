import React, { useEffect, useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CustomTable from "../table";
import { signIn } from "../../libs/usersApi";
import { setStoreMatters } from "../../utils/matters";
import { getGroups, saveGroup } from "../../libs/groupsApi";
import { GRADES, TURNS } from "../../utils/groups";
import { createMg, deleteMg, getMgs } from "../../libs/mgsApi";
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

const Groups = () => {

  const headers = [
    { name: "id", value: "id" },
    { name: "name", value: "Nombre" },
    { name: "grade", value: "Grado" },
    { name: "turnLabel", value: "Turno" },
    { name: "description", value: "Descripcion" },
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
    name: "",
    description: "",
    grade: "",
    turnId: "",
    active: false,
    matterNames: [],
    matterIds: [],
    savedMgIds: [],
    groupIdToImportMatters: "",
  };

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [editId, setEditId] = useState(null);
  const [groups, setGroups] = useState([])
  const [matters, setMatters] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [groupsState, setGroupsState] = useState({ active: true });

  useEffect(() => {
    const fetchToken = async () => {
      const { token } = await signIn(56660749, "1234");
      if (token) {
        localStorage.setItem("token", token)
      }
    }
    const fetchData = async () => {
      const mattersList: any = await setStoreMatters()
      setMatters(mattersList)
      await getGroupList(true)
    }
    fetchToken()
    fetchData()
  }, []);

  const getGroupList = async (active: boolean) => {
    const response: any = await getGroupsFormatted(active)
    if (response) setGroups(response)
  }

  const getGroupsFormatted = async (active: boolean) => {
    const groups = await getGroups({ active: active })
    if (groups) {
      const formattedGroups: any = []
      await Promise.all(
        groups.map(async (group: any) => {
          const mgs = await getMgs({ groupId: group.id })
          const matterNames: string[] = []
          const matterIds: number[] = []
          const mgIds: any[] = []
          mgs.map((mg: any) => {
            matterNames.push(mg.matter.name)
            matterIds.push(mg.matter.id)
            mgIds.push({ id: mg.id, matterId: mg.matter.id })
          })
          formattedGroups.push({
            ...group,
            activeLabel: group.active ? "ACTIVO" : "INACTIVO",
            turnLabel: TURNS[group.turnId - 1].name,
            matterNames,
            matterIds,
            savedMgIds: mgIds
          })
        })
      )
      return formattedGroups.sort((a: any, b: any) => a.id - b.id);
    }
  }

  const handleEdit = (selectedRow: any) => {
    setEditId(selectedRow.id);
    setFormData({
      ...formData,
      ...selectedRow,
    })
    setOpen(true);
  };

  const handleMatterChange = (event: any) => {
    let {
      target: { value },
    } = event;
    // if the function is called in the component
    if (typeof value === "string") {
      value = value.split(",")
    }

    setFormData({ ...formData, matterNames: value })
  };

  const handleSelectMatter = (selectedMatter: { id: number, name: string }) => {
    if (formData.matterNames.indexOf(selectedMatter.name) === -1) {
      formData.matterIds.push(selectedMatter.id)
      formData.matterNames.push(selectedMatter.name)
    } else {
      const filteredNames = formData.matterNames.filter(
        (name: string) => name !== selectedMatter.name
      );
      const filteredIds = formData.matterIds.filter(
        (id: number) => id !== selectedMatter.id
      );
      formData.matterIds = filteredIds
      formData.matterNames = filteredNames
    }
  };

  const importMattersByGroupId = async (groupId: number) => {
    setIsLoading(true)
    const gms = await getMgs({ groupId })
    gms.map((gm: any) => {
      handleSelectMatter({ id: gm.matter.id, name: gm.matter.name })
    })
    handleMatterChange({ target: { value: formData.matterNames } })
    setIsLoading(false)
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (editId) {
      const group = {
        grade: formData.grade,
        name: formData.name,
        description: formData.description,
        turnId: formData.turnId,
        active: formData.active
      }
      const responseSave = await saveGroup(editId, group)
      if (responseSave) {
        let removeMgIds: number[] = []
        formData.savedMgIds.map((mg: any) => {
          if (formData.matterIds.indexOf(mg.matterId) == -1) {
            removeMgIds.push(mg.id)
          }
        })

        await Promise.all(
          removeMgIds.map(async (mgId) => {
            await deleteMg(mgId)
          }),
        )

        await Promise.all(
          formData.matterIds.map(async (matterId) => {
            await createMg({ groupId: editId, matterId: matterId })
          }),
        )
        setOpen(false);
        await getGroupList(true)
        setEditId(null)
      }
    } else {

    }

  };

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

  return (
    <div>
      <Button
        variant="outlined"
        color="success"
        onClick={handleOpen}
        endIcon={<PersonAddIcon />}
        className="mx-4 my-4 normal-case"
      >
        Nuevo grupo
      </Button>
      <Button
        variant="outlined"
        color={groupsState.active ? "warning" : "success"}
        onClick={() => {
          setGroupsState({ active: !groupsState.active })
          getGroupList(!groupsState.active)
        }}
        className="mx-4 my-4 normal-case"
        disabled={isLoading}
      >
        {`Ver Grupos ${groupsState.active ? "Inactivos" : "Activos"}`}
      </Button>
      <CustomTable
        className=""
        headers={headers}
        items={groups}
        onSelectRow={handleEdit}
      />
      <Dialog open={open} className="max-w-xl mx-auto">
        <DialogTitle className="text-sm">
          {`${editId ? "Editar" : "Nuevo"} Grupo`}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent className="grid justify-center">
            <div className="flex mb-4 space-x-2">
              <FormControl className="w-full  min-w-[100px]">
                <TextField
                  required
                  label="Nombre"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full max-w-xs leading-normal text-gray-900 bg-white rounded-md focus:outline-none focus:shadow-outline"
                  variant="outlined"
                />
              </FormControl>
              <FormControl className="min-w-[200px]">
                <InputLabel id="turn-select">Turno</InputLabel>
                <Select
                  labelId="turn-select"
                  name="turnId"
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
              <FormControl className="w-full max-w-[100px]">
                <InputLabel id="select-grade">Grado</InputLabel>
                <Select
                  name="grade"
                  labelId="select-grade"
                  value={formData.grade}
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
            </div>
            <FormControl className="w-full">
              <TextField
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full leading-normal text-gray-900 bg-white rounded-md focus:outline-none focus:shadow-outline"
                variant="outlined"
              />
            </FormControl>
            {editId && (
              <>
                <div className="flex space-x-2">
                  <FormControl className="w-full my-4">
                    <InputLabel id="select-import">Importar materias del grupo</InputLabel>
                    <Select
                      name="groupIdToImportMatters"
                      labelId="select-import"
                      value={formData.groupIdToImportMatters}
                      onChange={handleChange}
                      input={<OutlinedInput label="Importar materias del grupo" />}
                      MenuProps={MenuProps}
                    >
                      {groups.filter((gr: any) => (gr.id !== editId)).map((group: any, index: number) => (
                        <MenuItem
                          key={index}
                          value={group.id}
                        >
                          {group.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    color="success"
                    variant="outlined"
                    onClick={() => importMattersByGroupId(Number(formData.groupIdToImportMatters))}
                    className="w-full mx-4 my-4 normal-case max-w-[150px]"
                    disabled={!formData.groupIdToImportMatters}
                  >
                    Importar Materias
                  </Button>
                </div>
                <FormControl className="w-full mb-4">
                  <InputLabel id="matters-select">Materias Asignadas</InputLabel>
                  <Select
                    labelId="matters-select"
                    multiple
                    value={formData.matterNames}
                    onChange={handleMatterChange}
                    input={<OutlinedInput label="Materias Asignadas" />}
                    MenuProps={MenuProps}
                    renderValue={(selected) => (
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
                        value={matter.name}
                        onClick={() => {
                          handleSelectMatter(matter);
                        }}
                      >
                        <Checkbox
                          checked={
                            formData.matterNames.indexOf(matter.name) > -1
                          }
                        />
                        <ListItemText primary={matter.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
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

export default Groups;
