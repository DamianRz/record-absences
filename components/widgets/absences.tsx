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
} from "@mui/material";
import axios from "axios";
import CustomTable from "../table";
import {
  getSpecialtiesByTeacher,
} from "../../libs/specialtiesApi";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { signIn } from "../../libs/usersApi";
import { getPerson } from "../../libs/personApi";
import { getProfessor } from "../../libs/proffesorsApi";
import { getGMP } from "../../libs/gmpsApi";
import { getMgs } from "../../libs/mgsApi";

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
    { name: "ci", value: "CI" },
    { name: "name", value: "Nombre" },
    { name: "lastname", value: "Apellido" },
    { name: "group", value: "Grupo" },
    { name: "matter", value: "Materia" },
    { name: "startDate", value: "Fecha Incio" },
    { name: "endDate", value: "Fecha Fin" },
    { name: "active", value: "Activo" },
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
    group: "",
    matter: "",
    turn: "",
    startDate: "",
    endDate: "",
    document: "", // 86028008
    name: "",
    reason: ""
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
    search: false
  }

  const [open, setOpen] = useState(false);
  const [professors, setProfessors] = useState(mokAbsences);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [editId, setEditId] = useState(null);
  const [teacherData, setTeacherData] = useState<TeacherDataProps>();
  const [selectedGroupMatter, setSelectedGroupMatter] = useState();
  const [errors, setErrors] = useState(ERRORS);

  useEffect(() => {
    const fetchData = async () => {
      const token: { token: string } | undefined = await getToken()
      if (token) {
        // fetchDataSpecialties();
      }
    }
    fetchData()
  }, []);

  useEffect(() => {
    console.log("UPDATING", teacherData)
  }, [teacherData])

  useEffect(() => {
    setFormData({ ...formData, endDate: formData.startDate })
  }, [formData.startDate])

  const getToken = async () => {
    return await signIn(56660749, "1234");
  }

  const getTeacherData = async (document: number) => {
    let teacher: any = undefined
    const person = await getPerson(document);
    if (person) {
      teacher = await getProfessor(document);
    }
    if (teacher) {
      let groupMatter: any[] = new Array;
      const responseGMPs = await getGMP(teacher?.id);
      await Promise.all(
        responseGMPs.map(async (GMP: any) => {
          const responseMGs = await getMgs(GMP?.mgId);
          if (responseMGs) {
            groupMatter.push(responseMGs)
          };
        }));
      if (teacher) {
        console.log(groupMatter)
        groupMatter.push({
          "id": 8,
          "matterId": 2,
          "groupId": 10,
          "matter": {
            "id": 2,
            "name": "fisica",
            "description": null
          },
          "group": {
            "id": 10,
            "grade": 1,
            "name": "IP",
            "description": null,
            "turnId": 1,
            "active": false
          }
        })
        return {
          teacher: { ...teacher, ...person },
          groupMatter
        }
      }
    }
    return undefined
  };

  const handleSearch = async () => {
    const teacherDataResponse: any = await getTeacherData(Number(formData.document));

    if (teacherDataResponse) {
      setErrors({ ...errors, search: false })
      const formattedGroupMatter = groupMatterByGroupId(teacherDataResponse.groupMatter)
      teacherDataResponse.groupMatter = formattedGroupMatter
      setTeacherData(teacherDataResponse)
    } else {
      setErrors({ ...errors, search: true })
    }
  }

  const groupMatterByGroupId = (groupMatter: any[]) => {
    let groups: any = {};
    groupMatter.forEach((item: any) => {
      if (!groups[item.groupId]) {
        groups[item.groupId] = {
          groupId: item.groupId,
          group: item.group,
          matters: [item.matter]
        }
      } else {
        groups[item.groupId].matters.push(item.matter);
      }
    });
    return Object.values(groups);
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
    setSelectedRow(undefined);
    setOpen(false);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (editId) {
      // Update existing professor
      await axios.put(`/api/professors/${editId}`, formData);
    } else {
      // Create new professor
      await axios.post("/api/professors", formData);
    }
    setOpen(false);
    setEditId(null);
    const result = await axios("/api/professors");
    setProfessors(result.data);
  };

  const handleEdit = async (id: any) => {
    // setSelectedSpecialties([]);
    setEditId(id);

    const teacherSpecialties: any = await getSpecialtiesByTeacher(id);
    setSelectedSpecialties(teacherSpecialties);

    // get names and join

    console.log(teacherSpecialties);

    let specialiesNames = "";
    teacherSpecialties.map((s) => {
      specialiesNames += `${s.name}, `;
    });

    setSelectedSpecialtiesNames(specialiesNames);

    setOpen(true);
    setFormData(professors.find((p) => p.id === id));
  };

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
        items={mokAbsences}
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
                />
              </FormControl>
              <Button
                type="button"
                variant="outlined"
                size="small"
                className="normal-case max-h-[40px] min-w-[200px]"
                onClick={handleSearch}
              >
                Buscar
              </Button>
            </div>
            {errors.search && (
              <p className="mb-4 text-red-400">{`No se han encontrado resultados`}</p>
            )}
            {teacherData?.teacher && (
              <p className="mb-4 ">{`Nombre: ${teacherData.teacher.name} ${teacherData.teacher.lastname}`}</p>
            )}
            <div className="flex space-x-2">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Fecha inicio"
                  inputFormat="DD/MM/YYYY"
                  value={formData.startDate}
                  onChange={(value) => setFormData({ ...formData, startDate: value })}
                  minDate={new Date()}
                  disabled={!Boolean(teacherData?.teacher.name)}
                  renderInput={(params) => <TextField {...params} error={false} required />}
                />
                <DesktopDatePicker
                  label="Fecha fin"
                  inputFormat="DD/MM/YYYY"
                  value={formData.endDate}
                  onChange={(value) => setFormData({ ...formData, endDate: value })}
                  minDate={formData.startDate}
                  disabled={!Boolean(teacherData?.teacher.name)}
                  renderInput={(params) => <TextField {...params} error={false} required />}
                />
              </LocalizationProvider>
            </div>
            <div className="flex space-x-2">
              <FormControl className="w-full my-4">
                <InputLabel id="select-group">Grupo</InputLabel>
                <Select
                  required
                  name="group"
                  labelId="select-group"
                  value={formData.group}
                  onChange={handleChange}
                  input={<OutlinedInput label="Grupo" />}
                  MenuProps={MenuProps}
                  disabled={!formData.endDate}
                >
                  {teacherData?.groupMatter.map((groupMatter, index: number) => (
                    <MenuItem
                      key={index}
                      value={groupMatter.groupId}
                      onClick={() => { setSelectedGroupMatter(groupMatter) }}
                    >
                      {`${groupMatter.group.name} - (${TURNS[groupMatter.group.turnId].name})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className="w-full my-4">
                <InputLabel id="select-matter">Materia</InputLabel>
                <Select
                  required
                  name="matter"
                  labelId="select-matter"
                  value={formData.matter}
                  onChange={handleChange}
                  input={<OutlinedInput label="Materia" />}
                  MenuProps={MenuProps}
                  disabled={!formData.endDate}
                >
                  {(selectedGroupMatter?.matters || []).map((matter: any, index: number) => (
                    <MenuItem
                      key={index}
                      value={matter.id}
                    >
                      {matter.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                  disabled={!Boolean(teacherData?.teacher.name)}
                />
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
