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
  getSpecialties,
  getSpecialtiesByTeacher,
} from "../../libs/specialtiesApi";
import CustomDateField from "../custom-date-field";

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
    { name: "name", value: "Nombre" },
    { name: "lastname", value: "Apellido" },
    { name: "ci", value: "CI" },
    { name: "group", value: "Grupo" },
    { name: "matter", value: "Materia" },
    { name: "startDate", value: "Fecha Incio" },
    { name: "endDate", value: "Fecha Fin" },
    { name: "active", value: "Activo" },
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
    lastname: "",
    ci: "",
    active: true,

    /*
      obtener las especialidades, como? 
      por bd o obteniendo id  y texto de la materia
    */

    specialties: [
      {
        matterId: 1,
        proffesorId: 1,
      },
    ],
  };

  //
  const [open, setOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(undefined);
  const [document, setDocument] = useState("")
  //




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
    const fetchDataTeachers = async () => {
      const result = await axios("/api/professors");
      setProfessors(result.data);
    };
    const fetchDataSpecialties = async () => {
      const result: any = await getSpecialties();
      setSpecialties(result);
    };
    fetchDataTeachers();
    fetchDataSpecialties();
  }, []);

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
      document: "",
      groups: [],
      specialties: [],
      matters: []
    }

    setSelectedTeacher(newTeacher)

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
                  name="ci"
                  type="text"
                  value={formData.ci}
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
            
            {selectedTeacher?.name && <p>{`Nombre: ${selectedTeacher.name} ${selectedTeacher.lastname}`}</p>}

            <div className="flex space-x-2">
              <CustomDateField 
                disabled={!selectedTeacher?.name}  
                name="startDate" 
                error={false} 
                helperText="Debe seleccionar la fecha de inicio" 
                label="Fecha inicio"
                onChange={()=> {}}
                value=""
              />
              <CustomDateField 
                disabled={!selectedTeacher?.name}                  
                name="endDate" 
                error={false} 
                helperText="Debe seleccionar la fecha fin" 
                label="Fecha fin"
                onChange={()=> {}}
                value=""
              />
            </div>

            
            





          {/* <FormControl>
              <InputLabel id="turn-select">Documento del profesor (CI)</InputLabel>
              <Select
                labelId="turn-select"
                value={formData.teacher}
                onChange={() => {}}
                input={<OutlinedInput label="Turno" />}
              >
                {turns.map((turn) => (
                  <MenuItem key={turn.id} value={turn.id}>
                    {turn.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}

{/* 


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
            </div> */}



            {/* <FormControl className="w-full my-4">
              <InputLabel id="specialties-select">Especialidades</InputLabel>
              <Select
                required
                labelId="specialties-select"
                multiple
                value={selectedSpecialtiesNames}
                onChange={handleSpecialtyChange}
                input={<OutlinedInput label="Especialidades" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {specialties.map((specialty: any, index) => (
                  <MenuItem
                    className="h-[20px]"
                    key={index}
                    value={specialty.name}
                    onClick={() => {
                      handleSelectSpecialty(specialty);
                    }}
                  >
                    <Checkbox
                      checked={
                        selectedSpecialtiesNames.indexOf(specialty.name) > -1
                      }
                    />
                    <ListItemText primary={specialty.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}


            {/* <FormControl className="w-full my-4">
              <FormLabel id="radio-active">Estado</FormLabel>
              <RadioGroup
                aria-labelledby="radio-active"
                name="active"
                defaultValue={formData.active}
                onChange={handleActiveChange}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio size="small" />}
                  label="Activo"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio size="small" />}
                  label="Inactivo"
                />
              </RadioGroup>
            </FormControl> */}

            
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
