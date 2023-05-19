import React, { useContext, useEffect, useState } from "react";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CustomTable from "../table";
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
import { UserContext } from "../../contexts/userContext";
import { useRouter } from "next/router";

const Matters = () => {
  const headers = [
    { name: "id", value: "ID" },
    { name: "code", value: "Codigo" },
    { name: "name", value: "Nombre" },
    { name: "description", value: "Descripcion" },
  ];

  const DEFAULT_FORM_DATA = {
    id: "",
    name: "",
    code: "",
    description: "",
  };

  const DEFAULT_ERRORS = {
    name: { visible: false, error: "" },
    description: { visible: false, error: "" },
    code: { visible: false, error: "" },
  }

  const [matters, setMatters] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<any>(DEFAULT_FORM_DATA);
  const [editId, setEditId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [errors, setErrors] = useState(DEFAULT_ERRORS);

  const { isLoading, setLoading } = useContext(LoaderContext)
  const { userIsNormal } = useContext(UserContext)
  const router = useRouter()

  useEffect(() => {
    const fetchToken = async () => {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (token) {
        await getMatterList(true)
      } else {
        router.push('/');
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
    setErrors(DEFAULT_ERRORS)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    // validation
    let failed = false
    let error = {}
    // validate length
    Object.keys(errors).map((fieldName: string) => {
      if (formData[fieldName].length > 30) {
        const newError = {
          [fieldName]: {
            visible: true,
            error: "El texto es muy largo"
          }
        }
        Object.assign(error, newError)
        failed = true
      }
      if (formData[fieldName].length < 4) {
        const newError = {
          [fieldName]: {
            visible: true,
            error: "El texto es muy corto"
          }
        }
        Object.assign(error, newError)
        failed = true
      }
    })

    const existsCode = Boolean(
      matters.filter(
        (matter: { id: number, code: string, name: string, active: boolean }) => (
          (matter.id !== editId) &&
          matter.code.toLowerCase() === formData.code.toLowerCase()
        )).length)

    if (existsCode) {
      failed = true
      setErrors({
        ...errors,
        ...error,
        code: {
          visible: true,
          error: "Ya existe este codigo, por favor ingrese un nuevo codigo"
        }
      })
    } else if (failed) {
      setErrors({
        ...errors,
        ...error,
      })
    }
    if (failed) return null;

    setLoading(true)

    let responseSave = null

    if (editId) {
      const matter = { name: formData.name, description: formData.description, code: formData.code }
      responseSave = await saveMatter(editId, matter)
    } else {
      const matter = { name: formData.name, description: formData.description, code: formData.code }
      responseSave = await createMatter(matter)
    }

    if (!responseSave) alert(`Ocurrio un error al ${editId ? 'Editar' : 'Crear'} una materia, vuelva a intentarlo mas tarde o cumuniquese con soporte`)

    setOpen(false);
    await getMatterList(true)
    setEditId(null)
    setLoading(false)
  };

  const handleEdit = (selectedRow: any) => {
    setEditId(selectedRow.id);
    setErrors(DEFAULT_ERRORS)
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
      {!userIsNormal() && (
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
      )}
      <p className="my-4 text-xl">Materias</p>
      <CustomTable
        className="max-h-[400px]"
        headers={headers}
        items={matters}
        onSelectRow={handleEdit}
        disabledSelectRow={userIsNormal()}
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
                  error={errors.name.visible}
                  helperText={errors.name.visible && errors.name.error}
                />
              </FormControl>
            </div>
            <div className="mb-4">
              <FormControl className="w-full mt-4">
                <TextField
                  label="Codigo"
                  required
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full max-w-xs leading-normal text-gray-900 bg-white rounded-md focus:outline-none focus:shadow-outline"
                  variant="outlined"
                  error={errors.code.visible}
                  helperText={errors.code.visible && errors.code.error}
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
                  error={errors.description.visible}
                  helperText={errors.description.visible && errors.description.error}
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
              onClick={() => setErrors(DEFAULT_ERRORS)}
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
