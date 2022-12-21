import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
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
import { useSnackbar } from 'notistack';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import { previousMonday } from "date-fns";

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
      // { id: 11, name: 'Rocío', lastname: 'Molina', ci: 123466, active: true },
      // { id: 1, name: 'Juan', lastname: 'Pérez', ci: 123456, active: true },
      // { id: 2, name: 'María', lastname: 'González', ci: 123457, active: false },
      // { id: 3, name: 'Pedro', lastname: 'Rodríguez', ci: 123458, active: true },
      // { id: 4, name: 'Ana', lastname: 'Sánchez', ci: 123459, active: false },
      // { id: 5, name: 'Pablo', lastname: 'Martínez', ci: 123460, active: true },
      // { id: 6, name: 'Sandra', lastname: 'Lopez', ci: 123461, active: false },
      // { id: 7, name: 'Carlos', lastname: 'Gómez', ci: 123462, active: true },
      // { id: 8, name: 'Laura', lastname: 'Díaz', ci: 123463, active: false },
      // { id: 9, name: 'Alberto', lastname: 'Jiménez', ci: 123464, active: true },
      // { id: 10, name: 'Sonia', lastname: 'Ruiz', ci: 123465, active: false },
      // { id: 11, name: 'Rocío', lastname: 'Molina', ci: 123466, active: true },
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
    "Nombre", "Apellido", "CI", "Activo"
  ]

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };



  //   const classes = useStyles();
  const [professors, setProfessors] = useState(mokProffesors);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    ci: "",
    active: true,
    specialty: ""
  });
  const [editId, setEditId] = useState(null);
  const [persons, setPersons] = useState([]);
  
  const [selectedSpecialtiesNames, setSelectedSpecialtiesNames] = useState<string[]>(['Matematicas']);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);

  const [selectedRow, setSelectedRow] = useState()


//   const { enqueueSnackbar } = useSnackbar();

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

  const handleSelectRow = (row: any) => {
    setSelectedRow(row)
    handleEdit(row.id)
  }








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

      <div className="w-full relative max-h-[400px] h-[400px]">
        <Paper className="w-full p-4 rounded-lg shadow-lg" sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader className="w-full text-left">
            <TableHead>
              <TableRow>
                {headers.map((header, key) => (
                  <TableCell key={key} className="p-3 font-bold text-gray-700 bg-gray-200 select-none">
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {professors.map((row: any) => (
                <TableRow
                  key={row.id}
                  onClick={() => handleSelectRow(row)}
                  className={`${selectedRow === row && 'bg-teal-50'} text-center cursor-pointer hover:bg-teal-50`}
                >
                  <TableCell className="p-3 font-mono text-sm border-t border-gray-200">
                    {row.name}
                  </TableCell>
                  <TableCell className="p-3 font-mono text-sm border-t border-gray-200">
                    {row.lastname}
                  </TableCell>
                  <TableCell className="p-3 font-mono text-sm border-t border-gray-200">
                    {row.ci}
                  </TableCell>
                  <TableCell className="p-3 font-mono text-sm border-t border-gray-200">
                    {row.active ? "Sí" : "No"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
        </Paper>
      </div>
      <Dialog open={open} className="max-w-xl mx-auto">
        <DialogTitle className="text-3xl font-bold">
          {editId ? "Editar profesor" : "Nuevo profesor"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent className="grid justify-center ">
              <div className="flex space-x-2">
                <FormControl className="w-full my-4">
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

                <FormControl className="w-full my-4">
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
              <FormLabel id="radio-active">Estado</FormLabel>
              <RadioGroup
                aria-labelledby="radio-active"
                name="active"
                defaultValue={formData.active}
                onChange={handleActiveChange}
              >
                <FormControlLabel value={true} control={<Radio />} label="Activo" />
                <FormControlLabel value={false} control={<Radio />} label="Inactivo" />
              </RadioGroup>
            </FormControl>


            <FormControl className="w-full my-4">
              <InputLabel id="specialties-select">Especialidades</InputLabel>
              <Select
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
            <p>{JSON.stringify(selectedSpecialties)}</p>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" color="primary">
              Guardar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Teachers2;
