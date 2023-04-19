import React, { useContext, useEffect, useState } from "react";
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
import { LoaderContext } from "../../contexts/loader";

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
  const { isLoading, setLoading } = useContext(LoaderContext)

  useEffect(() => {
    const fetchToken = async () => {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (token) {
        await getMatterList(true)
      } else {
        window.location.href = '/';
      }
      setLoading(false)
    }
    fetchToken()
  }, []);

  const getMatterList = async (active: boolean) => {
    setLoading(true)
    const response: any = await getMattersFormatted(active)
    if (response) setMatters(response)
    setLoading(false)
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
    setLoading(true)
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
    setLoading(false)
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
      <div className="my-4 space-x-4">
        <Button
          variant="outlined"
          color="success"
          onClick={handleOpen}
          endIcon={<PostAddIcon />}
          className="normal-case"
          disabled={isLoading}
        >
          Nuevo materia
        </Button>
      </div>
      <p className="my-4 text-xl">Materias</p>
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
            <div className="mb-4">
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
            </div>
            <div className="mb-4">
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
            </div>
            {
              editId && (
                <div className="mb-4">
                  <FormControl className="w-full">
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
                </div>
              )
            }
          </DialogContent>
          <DialogActions className="pb-4 pr-4 space-x-4">
            <Button
              onClick={handleClose}
              variant="outlined"
              size="small"
              className="normal-case"
              disabled={isLoading}
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
