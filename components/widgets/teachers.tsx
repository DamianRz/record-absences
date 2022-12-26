import React, { useEffect, useState } from "react";
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
  ListItemText
} from "@mui/material";
import axios from "axios";
import CustomTable from "../table"

const Teachers2 = () => {

  const mokProffesors = [
      { id: 1, name: 'Juan', lastname: 'Pérez', ci: 123456, active: true },
      { id: 2, name: 'María', lastname: 'González', ci: 123457, active: false },
      { id: 3, name: 'Pedro', lastname: 'Rodríguez', ci: 123458, active: true },
      { id: 4, name: 'Ana', lastname: 'Sánchez', ci: 123459, active: false },
      { id: 5, name: 'Pablo', lastname: 'Martínez', ci: 123460, active: true },
      { id: 6, name: 'Sandra', lastname: 'Lopez', ci: 123461, active: false },
      { id: 7, name: 'Carlos', lastname: 'Gómez', ci: 123462, active: true },
      { id: 8, name: 'Laura', lastname: 'Díaz', ci: 123463, active: false },
      { id: 9, name: 'Alberto', lastname: 'Jiménez', ci: 123464, active: true },
      { id: 10, name: 'Sonia', lastname: 'Ruiz', ci: 123465, active: false },
  ]

  const specialties = [
      { value: 1, label: 'Matematicas' },
      { value: 2, label: 'Filosofia' },
      { value: 3, label: 'Sistemas Operativos' },
      { value: 4, label: 'Programacion' },
      { value: 5, label: 'Base de datos' },
      { value: 6, label: 'Logica' }
  ]

  const headers = [
    { name: "name", value: "Nombre" },
    { name: "lastname", value: "Apellido" },
    { name: "ci", value: "CI" },
    { name: "active", value: "Activo" },
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
    name: "",
    lastname: "",
    ci: "",
    active: true,
    specialty: ""
  }

  const [professors, setProfessors] = useState(mokProffesors);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [editId, setEditId] = useState(null);
  const [persons, setPersons] = useState([]);
  
  const [selectedSpecialtiesNames, setSelectedSpecialtiesNames] = useState<string[]>(['Matematicas']);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);

  const [selectedRow, setSelectedRow] = useState()

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
    console.log(event)
    setFormData({
      ...formData,
      active: event.target.value === "true"
    });
  };

  const handleOpen = () => {
    setEditId(null);
    setFormData(DEFAULT_FORM_DATA)
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedRow(undefined)
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

  const handleDelete = async (id: any) => {
    await axios.delete(`/api/professors/${id}`);
    const result = await axios("/api/professors");
    setProfessors(result.data);
  };

  const handleSpecialtyChange = (event: any) => {
    const {target: { value }} = event;
    setSelectedSpecialtiesNames( typeof value === 'string' ? value.split(',') : value)
  }

  const handleSelectSpecialty = (specialty: any) => {
    if (!(selectedSpecialtiesNames.indexOf(specialty.label) > -1)) {
      setSelectedSpecialties(prev => [...prev, specialty] )
    } else {
      const filtred = selectedSpecialties.filter((a: any) => a.value !== specialty.value)
      setSelectedSpecialties(filtred)
    }
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleOpen}>
        Nuevo profesor
      </Button>
      <CustomTable
        headers={headers}
        items={mokProffesors}
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
                name="ci"
                type="number"
                value={formData.ci}
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
                value={selectedSpecialtiesNames}
                onChange={handleSpecialtyChange}
                input={<OutlinedInput label="Especialidades" />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {specialties.map((specialty: any, index) => (
                  <MenuItem
                    className="h-[20px]"
                    key={index}
                    value={specialty.label}
                    onClick={() => { handleSelectSpecialty(specialty) }}
                  >
                    <Checkbox
                      checked={selectedSpecialtiesNames.indexOf(specialty.label) > -1}
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
                <FormControlLabel value={true} control={<Radio size="small" />} label="Activo" />
                <FormControlLabel value={false} control={<Radio size="small" />} label="Inactivo" />
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

export default Teachers2;
