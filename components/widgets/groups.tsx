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

const Groups = () => {
  const mokGroups = [
    {
      id: 1,
      name: "AZ1",
      grade: 1,
      active: true,
      turnId: 1,
      description: "Informática",
    },
    {
      id: 2,
      name: "BC2",
      grade: 2,
      active: true,
      turnId: 2,
      description: "Informática",
    },
    {
      id: 3,
      name: "CD3",
      grade: 3,
      active: true,
      turnId: 3,
      description: "Informática",
    },
    {
      id: 4,
      name: "DE4",
      grade: 1,
      active: true,
      turnId: 1,
      description: "Informática",
    },
    {
      id: 5,
      name: "EF5",
      grade: 2,
      active: true,
      turnId: 2,
      description: "Informática",
    },
    {
      id: 6,
      name: "FG6",
      grade: 3,
      active: true,
      turnId: 3,
      description: "Informática",
    },
    {
      id: 7,
      name: "GH7",
      grade: 1,
      active: true,
      turnId: 1,
      description: "Informática",
    },
    {
      id: 8,
      name: "HI8",
      grade: 2,
      active: true,
      turnId: 2,
      description: "Informática",
    },
    {
      id: 9,
      name: "IJ9",
      grade: 3,
      active: true,
      turnId: 3,
      description: "Informática",
    },
    {
      id: 10,
      name: "JK10",
      grade: 1,
      active: true,
      turnId: 1,
      description: "Informática",
    },
    {
      id: 11,
      name: "KL11",
      grade: 2,
      active: true,
      turnId: 2,
      description: "Informática",
    },
    {
      id: 12,
      name: "LM12",
      grade: 3,
      active: true,
      turnId: 3,
      description: "Informática",
    },
    {
      id: 13,
      name: "MN13",
      grade: 1,
      active: true,
      turnId: 1,
      description: "Informática",
    },
    {
      id: 14,
      name: "NO14",
      grade: 2,
      active: true,
      turnId: 2,
      description: "Informática",
    },
    {
      id: 15,
      name: "OP15",
      grade: 3,
      active: true,
      turnId: 3,
      description: "Informática",
    },
    {
      id: 16,
      name: "PQ16",
      grade: 1,
      active: true,
      turnId: 1,
      description: "Informática",
    },
  ];
  const specialties = [
    { value: 1, label: "Matematicas" },
    { value: 2, label: "Filosofia" },
    { value: 3, label: "Sistemas Operativos" },
    { value: 4, label: "Programacion" },
    { value: 5, label: "Base de datos" },
    { value: 6, label: "Logica" },
  ];

  const headers = [
    { name: "name", value: "Nombre" },
    { name: "grade", value: "Grado" },
    { name: "turnId", value: "Turno" },
    { name: "description", value: "Descripcion" },
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
    description: "",
    grade: "",
    turnId: "",
    active: false,
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

  const turns = [
    { name: "Manana", id: 1 },
    { name: "Tarde", id: 2 },
    { name: "Noche", id: 3 },
  ];

  const [professors, setProfessors] = useState(mokGroups);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [editId, setEditId] = useState(null);
  const [persons, setPersons] = useState([]);

  const [selectedSpecialtiesNames, setSelectedSpecialtiesNames] = useState<
    string[]
  >([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);

  const [selectedRow, setSelectedRow] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("/api/professors");
      setProfessors(result.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("/api/persons");
      setPersons(result.data);
    };
    fetchData();
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

  const handleEdit = (id: any) => {
    setEditId(id);
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
      <p>{JSON.stringify(selectedSpecialties)}</p>
      <CustomTable
        headers={headers}
        items={mokGroups}
        onSelectRow={handleEdit}
      />
      <Dialog open={open} className="max-w-sm mx-auto">
        <DialogTitle className="text-sm">
          {editId ? "Editar grupo" : "Nuevo grupo"}
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
                  label="Grado"
                  name="grade"
                  type="number"
                  value={formData.grade}
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
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full max-w-xs leading-normal text-gray-900 bg-white rounded-md focus:outline-none focus:shadow-outline"
                variant="outlined"
                size="small"
              />
            </FormControl>
            <FormControl>
              <InputLabel id="turn-select">Turno</InputLabel>
              <Select
                labelId="turn-select"
                value={formData.turnId}
                onChange={() => {}}
                input={<OutlinedInput label="Turno" />}
              >
                {turns.map((turn) => (
                  <MenuItem key={turn.id} value={turn.id}>
                    {turn.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className="w-full my-4">
              <InputLabel id="specialties-select">Materias</InputLabel>
              <Select
                required
                labelId="specialties-select"
                multiple
                value={selectedSpecialtiesNames}
                onChange={handleSpecialtyChange}
                input={<OutlinedInput label="Materias" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {specialties.map((specialty: any, index) => (
                  <MenuItem
                    className="h-[20px]"
                    key={index}
                    value={specialty.label}
                    onClick={() => {
                      handleSelectSpecialty(specialty);
                    }}
                  >
                    <Checkbox
                      checked={
                        selectedSpecialtiesNames.indexOf(specialty.label) > -1
                      }
                    />
                    <ListItemText primary={specialty.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className="w-full my-4">
              <FormLabel id="radio-active">Estado</FormLabel>
              <RadioGroup
                aria-labelledby="radio-active"
                name="active"
                defaultValue={formData.active}
                onChange={handleActiveChange}
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
