import React, { useEffect, useState } from "react";
import PostAddIcon from "@mui/icons-material/PostAdd";
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

const Matters = () => {
  const mokMatters = [
    {
      id: 1,
      name: "Matemáticas",
      description:
        "Asignatura que estudia las relaciones entre cantidades, medidas y formas.",
    },
    {
      id: 2,
      name: "Física",
      description:
        "Asignatura que estudia la naturaleza y sus leyes, utilizando métodos matemáticos.",
    },
    {
      id: 3,
      name: "Química",
      description:
        "Asignatura que estudia la composición y propiedades de la materia, así como las reacciones químicas.",
    },
    {
      id: 4,
      name: "Historia",
      description:
        "Asignatura que estudia el pasado de la humanidad a través de la investigación y el análisis de documentos y artefactos.",
    },
    {
      id: 5,
      name: "Inglés",
      description:
        "Asignatura que se centra en el estudio y uso del idioma inglés, incluyendo gramática, vocabulario y conversación.",
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
    { name: "description", value: "Descripcion" },
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

  const [matters, setMatters] = useState(mokMatters);
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
      const result = await axios("/api/matters");
      setMatters(result.data);
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
    setMatters(result.data);
  };

  const handleEdit = (id: any) => {
    setEditId(id);
    setOpen(true);
    setFormData(matters.find((p) => p.id === id));
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="success"
        onClick={handleOpen}
        endIcon={<PostAddIcon />}
        className="mx-4 my-4 normal-case"
      >
        Nuevo materia
      </Button>
      <CustomTable
        headers={headers}
        items={mokMatters}
        onSelectRow={handleEdit}
      />
      <Dialog open={open} className="max-w-xl mx-auto">
        <DialogTitle className="text-sm">
          {editId ? "Editar materia" : "Nueva materia"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent className="grid justify-center">
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
            <FormControl className="w-full mt-4">
              <TextField
                multiline
                required
                label="Descripcion"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full max-w-xs leading-normal text-gray-900 bg-white rounded-md focus:outline-none focus:shadow-outline"
                variant="outlined"
                size="small"
              />
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

export default Matters;
