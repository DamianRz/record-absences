import React, { useEffect, useState } from "react";
import EventBusyIcon from "@mui/icons-material/EventBusy";
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
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import CustomTable from "../table";
import {
  getSpecialties,
  getSpecialtiesByTeacher,
} from "../../libs/specialtiesApi";
import CustomDateField from "../custom-date-field";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { signin } from "../../libs/usersApi";
import { Store } from "@mui/icons-material";
import { getPerson } from "../../libs/personApi";
import { getProffessor } from "../../libs/proffesorsApi";
import { getGMP, getGmp } from "../../libs/gmpsApi";
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


  const TURNS = [
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

  const DEFAULT_SELECTED_TEACHER: any = {
    name: "",
    lastname: "",
    document: "",
    groups: [
    ],
    specialties: [],
    matters: []
  }

  const DEFAULT_FORM_DATA = {
    group: "",
    matter: "",
    turn: "",
    startDate: "",
    endDate: "",
    document: "",
    name: ""
  };

  const [open, setOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(DEFAULT_SELECTED_TEACHER);
  const [document, setDocument] = useState("")

  const [professors, setProfessors] = useState(mokAbsences);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [editId, setEditId] = useState(null);
  const [persons, setPersons] = useState([]);

  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialtiesNames, setSelectedSpecialtiesNames] = useState<
    string[]
  >([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);

  const [selectedRow, setSelectedRow] = useState();





  useEffect(() => {
    const signIn = async() => {
      const response = await signin(56660749, "1234");
      if (response) localStorage.setItem('token', response.token);
      console.log(response)
    }
    signIn()

    const getTeacher = async () => {
      
      // GET PERSON DATA
      const response = await getPerson(86028008);
      if (response) console.log("person", response);

      // GET PROFFESSOR ID
      const responseProffessor = await getProffessor(86028008);
      if (responseProffessor) console.log("proffessor",responseProffessor);

      // GET GROUP MATTER PROFFESOR
      const responseGMPs = await getGMP(responseProffessor?.id);
      if (responseGMPs) console.log("GMPs",responseGMPs);

      // GET MATTERS AND GROUP
      Promise.all(
        responseGMPs.map(async (GMP: any) => {
        const responseMGs = await getMgs(GMP?.mgId);
        if (responseMGs) console.log("MG",responseMGs);
      }));







      // TODO Grupos

      /*
        ci, id

        gmp/all ?
        (id = proffessorId)

        {
          "id": 1,
          "mgId": 1,
          "proffessorId": 1,
          "active": true,
          "mg": {
            "id": 1,
            "matterId": 1,
            "groupId": 1
          },
          "proffessor": {
            "id": 1,
            "personId": 1,
            "active": true
          }
        }

        // grupo
      
      */




      
      // const result = await axios("/api/professors");
      // setProfessors(result.data);
    };

    const fetchDataSpecialties = async () => {
      const result: any = await getSpecialties();
      setSpecialties(result);
    };
    getTeacher();
    fetchDataSpecialties();
  }, []);






  useEffect(() => {
    setFormData({ ...formData, endDate: formData.startDate })
  }, [formData.startDate])

  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleActiveChange = (event: any) => {
    console.log(event);
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

  // TODO
  const handleDelete = async (id: any) => {
    await axios.delete(`/api/professors/${id}`);
    const result = await axios("/api/professors");
    setProfessors(result.data);
  };

  const handleSpecialtyChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setSelectedSpecialtiesNames(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSelectSpecialty = (specialty: any) => {
    if (!(selectedSpecialtiesNames.indexOf(specialty.label) > -1)) {
      setSelectedSpecialties((prev) => [...prev, specialty]);
    } else {
      const filtred = selectedSpecialties.filter(
        (a: any) => a.value !== specialty.value
      );
      setSelectedSpecialties(filtred);
    }
  };

  const handleSearch = async () => {
    // fetch teacher by doc

    // const result = await axios("/api/professors");
    // setSelectedTeacher(result.data);

    const newTeacher: any = {
      name: "Damian",
      lastname: "Rodriguez",
      document: "56660749",
      groups: [
        { id: 1, name: "RP3", turnId: 1 },
        { id: 1, name: "RS1", turnId: 1 },
        { id: 1, name: "IF", turnId: 1 },
        { id: 1, name: "IG", turnId: 2 },
        { id: 1, name: "IB", turnId: 2 },
        { id: 1, name: "2A", turnId: 3 },
      ],
      specialties: [],
      matters: [
        { id: 1, name: "Matematicas" },
        { id: 2, name: "Geometria" },
      ]
    }
    setSelectedTeacher(newTeacher)
    setFormData({ ...formData, name: newTeacher.name})
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
        items={mokAbsences}
        onSelectRow={handleEdit}
      />



      <Dialog open={open} className="mx-auto ">
        <DialogTitle className="text-sm">
          {editId ? "Editar insasistencia" : "Nuevo Inasistencia"}
        </DialogTitle>


        <form onSubmit={handleSubmit}>
          <DialogContent className="grid justify-center">




            {/* BUSCAR PROFESOR A PARTIR DE DOCUMENTO */}



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
                className="normal-case max-h-[40px]"
                onClick={handleSearch}
              >
                Buscar
              </Button>
            </div>
            
            {selectedTeacher?.name && <p className="mb-4">{`Nombre: ${selectedTeacher.name} ${selectedTeacher.lastname}`}</p>}

            <div className="flex space-x-2">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Fecha inicio"
                  inputFormat="DD/MM/YYYY"
                  value={formData.startDate}
                  onChange={(value)=> setFormData({...formData, startDate: value })}
                  minDate={new Date()}
                  disabled={!formData.name}
                  renderInput={(params) => <TextField {...params} error={false} required />}
                />
                <DesktopDatePicker
                  label="Fecha fin"
                  inputFormat="DD/MM/YYYY"
                  value={formData.endDate}
                  onChange={(value)=> setFormData({...formData, endDate: value})}
                  minDate={formData.startDate}
                  disabled={!formData.name}
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
                  {selectedTeacher.groups.map((group: any, index: number) => (
                    <MenuItem
                      key={index}
                      value={group}
                    >
                      {group.name}
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
                  {selectedTeacher.matters.map((matter: any, index: number) => (
                    <MenuItem
                      key={index}
                      value={matter}
                    >
                      {matter.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>



              <FormControl className="w-full my-4">
                <InputLabel id="select-turn">Turno</InputLabel>
                <Select
                  required
                  name="turn"
                  labelId="select-turn"
                  value={formData.turn}
                  onChange={handleChange}
                  input={<OutlinedInput label="Turno" />}
                  MenuProps={MenuProps}
                  disabled={!formData.endDate}
                >
                  {TURNS.map((turn: any, index: number) => (
                    <MenuItem
                      key={index}
                      value={turn}
                    >
                      {turn.name}
                    </MenuItem>
                  ))}
                </Select>
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
