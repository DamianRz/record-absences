import React, { useEffect, useState } from "react";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CustomTable from "../table";
import { signIn } from "../../libs/usersApi";
import { createMatter, deleteMatter, getMatters, saveMatter } from "../../libs/mattersApi";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  FormLabel,
} from "@mui/material";

const Matters = () => {
  const headers = [
    { name: "id", value: "ID" },
    { name: "name", value: "Nombre" },
    { name: "description", value: "Descripcion" },
  ];

  const DEFAULT_FORM_DATA = {
    id: "",
    name: "",
    description: "",
  };

  const [matters, setMatters] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [editId, setEditId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  useEffect(() => {
    const fetchToken = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        await getMatterList(true)
      } else {
        window.location.href = '/';
      }
    }
    fetchToken()
  }, []);

  const getMatterList = async (active: boolean) => {
    const response: any = await getMattersFormatted(active)
    if (response) setMatters(response)
  }

  const getMattersFormatted = async (active: boolean) => {
    const matters = await getMatters()
    if (matters) {
      const formattedMatters: any = []
      matters.map(async (matter: any) => {
        formattedMatters.push({
          ...matter
        })
      })
      return formattedMatters.sort((a: any, b: any) => a.id - b.id);
    }
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
    setOpen(false);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (editId) {
      const matter = { name: formData.name, description: formData.description }
      const responseSave = await saveMatter(editId, matter)
      if (responseSave) {
        setOpen(false);
        await getMatterList(true)
        setEditId(null)
      }
    } else {
      const matter = { name: formData.name, description: formData.description }
      const responseSave = await createMatter(matter)
      if (responseSave) {
        setOpen(false);
        await getMatterList(true)
        setEditId(null)
      }
    }
  };

  const handleEdit = (selectedRow: any) => {
    setEditId(selectedRow.id);
    setFormData({
      ...formData,
      ...selectedRow,
    })
    setOpen(true);
  };

  const handleDelete = async () => {
    const responseSave = await deleteMatter(Number(editId))
    if (responseSave) {
      setShowConfirmDelete(false)
      setOpen(false);
      await getMatterList(true)
      setEditId(null)
    }
  }

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
        className="max-h-[400px]"
        headers={headers}
        items={matters}
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
              />
            </FormControl>
            <FormControl className="w-full mt-4">
              <TextField
                label="Descripcion"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full max-w-xs leading-normal text-gray-900 bg-white rounded-md focus:outline-none focus:shadow-outline"
                variant="outlined"
              />
            </FormControl>
            {
              editId && (
                <FormControl className="w-full my-4">
                  <FormLabel id="radio-active">Eliminar</FormLabel>
                  <Button
                    className=""
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setShowConfirmDelete(true)
                    }}
                  >
                    ELIMINAR
                  </Button>
                </FormControl>
              )
            }
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
      <Dialog open={showConfirmDelete} className="max-w-xl mx-auto">
        <DialogTitle className="text-sm">
          Esta seguro de que desea ELIMINAR esta materia?
        </DialogTitle>
        <DialogActions className="pb-4 pr-4 space-x-4">
          <Button
            onClick={() => setShowConfirmDelete(false)}
            variant="outlined"
            size="small"
            className="normal-case"
          >
            Cancelar
          </Button>
          <Button
            color="error"
            variant="outlined"
            size="small"
            className="normal-case"
            onClick={() => handleDelete()}
          >
            Si, deseo ELIMINAR
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Matters;
