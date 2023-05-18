import React, { useContext, useEffect, useState } from "react";
import { PersonAdd } from "@mui/icons-material";
import CustomTable from "../table";
import { deleteUser, getUsers, setUser, signUp } from "../../libs/usersApi";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
} from "@mui/material";
import { LoaderContext } from "../../contexts/loader";
import { getUserLogged } from "../../utils/user";
import { MenuProps } from "../../constants/styles";
import { USER_TYPES } from "../../constants/users";
import { fieldMaxWidth } from "../../utils/validation";

const Users = () => {
  const headers = [
    { name: "id", value: "ID" },
    { name: "name", value: "Documento" },
    { name: "firstname", value: "Nombre" },
    { name: "lastname", value: "Apellido" },
    { name: "type", value: "Tipo" },
  ];

  const DEFAULT_FORM_DATA = {
    id: "",
    name: "",
    firstname: "",
    lastname: "",
    password: "",
    type: "",
  };

  const DEFAULT_ERRORS = {
    firstname: { visible: false, error: "" },
    lastname: { visible: false, error: "" },
    name: { visible: false, error: "" },
    password: { visible: false, error: "" },
  }

  const [users, setUsers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<any>(DEFAULT_FORM_DATA);
  const [editId, setEditId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const { isLoading, setLoading } = useContext(LoaderContext)
  const [errors, setErrors] = useState(DEFAULT_ERRORS);

  useEffect(() => {
    const fetchToken = async () => {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (token) {
        await getUserList(true)
      } else {
        window.location.href = '/';
      }
      setLoading(false)
    }
    fetchToken()
  }, []);

  const getUserList = async (active: boolean) => {
    const users: { id: number, name: string, type: string }[] = await getUsers(active);
    const filteredUsers = users.filter((user) => user.name !== getUserLogged())
    if (filteredUsers) setUsers(filteredUsers)
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
      if (fieldName !== "name" && formData[fieldName].length > 30) {
        const newError = {
          [fieldName]: {
            visible: true,
            error: "El texto es muy largo"
          }
        }
        Object.assign(error, newError)
        failed = true
      }
      // DOCUMENTO
      if (fieldName === "name" && formData[fieldName].length > 10) {
        const newError = {
          [fieldName]: {
            visible: true,
            error: "El documento es muy largo"
          }
        }
        Object.assign(error, newError)
        failed = true
      }
      if (fieldName === "name" && formData[fieldName].length < 6) {
        const newError = {
          [fieldName]: {
            visible: true,
            error: "El documento es muy corto"
          }
        }
        Object.assign(error, newError)
        failed = true
      }
    })

    const existsName = Boolean(users.filter(user => user.name === formData.name).length)

    if (existsName) {
      if (!editId) {
        failed = true
        setErrors({
          ...errors,
          ...error,
          name: {
            visible: true,
            error: "Ya existe este documento, por favor ingrese un nuevo documento"
          }
        })
      }
    } else if (failed) {
      setErrors({
        ...errors,
        ...error,
      })
    }

    if (failed) return null;

    let data: any = {
      name: formData.name,
      type: formData.type,
      firstname: formData.firstname,
      lastname: formData.lastname
    }

    let response = null
    if (editId) {
      if (formData.password) {
        data = { ...data, password: formData.password }
      }
      response = await setUser(editId, data)
    } else {
      data = { ...data, password: formData.password }
      response = await signUp(data)
    }

    if (!response) alert(`Ocurrio un error al ${editId ? 'Editar' : 'Crear'} un usuario, vuelva a intentarlo mas tarde o cumuniquese con soporte`)

    setOpen(false);
    await getUserList(true)
    setEditId(null)
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
    const response = await deleteUser(Number(editId))
    if (response) {
      setShowConfirmDelete(false)
      setOpen(false);
      await getUserList(true)
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
          endIcon={<PersonAdd />}
          className="normal-case"
          disabled={isLoading}
        >
          Nuevo Usuario
        </Button>
      </div>
      <p className="my-4 text-xl">Usuarios</p>
      <CustomTable
        className="max-h-[400px]"
        headers={headers}
        items={users}
        onSelectRow={handleEdit}
      />
      <Dialog open={open} className="max-w-xl mx-auto">
        <DialogTitle className="text-sm">
          {`${editId ? "Editar" : "Nuevo"} usuario`}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent className="grid justify-center">
            <FormControl className="w-full mb-4">
              <InputLabel id="select-grade">Tipo de usuario</InputLabel>
              <Select
                name="type"
                required
                labelId="select-type"
                value={formData.type}
                onChange={handleChange}
                input={<OutlinedInput label="Tipo de usuario" />}
                MenuProps={MenuProps}
              >
                {USER_TYPES.map((type, index: number) => (
                  <MenuItem
                    key={index}
                    value={type.value}
                  >
                    {type.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="flex mb-4 space-x-2">
              <FormControl className="w-full">
                <TextField
                  required
                  label="Nombre"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="w-full max-w-xs leading-normal text-gray-900 bg-white rounded-md focus:outline-none focus:shadow-outline"
                  variant="outlined"
                  size="small"
                  error={errors.firstname.visible}
                  helperText={errors.firstname.visible && errors.firstname.error}
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
                  error={errors.lastname.visible}
                  helperText={errors.lastname.visible && errors.lastname.error}
                />
              </FormControl>
            </div>
            <div className="mb-4">
              <FormControl className="w-full">
                <TextField
                  required
                  label="Documento"
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
              {editId && <p>Nueva contraseña (Opcional)</p>}
              <FormControl className="w-full mt-4">
                <TextField
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full max-w-xs leading-normal text-gray-900 bg-white rounded-md focus:outline-none focus:shadow-outline"
                  variant="outlined"
                  required={!editId}
                  error={errors.password.visible}
                  helperText={errors.password.visible && errors.password.error}
                />
              </FormControl>
            </div>
            {
              editId && (
                <div className="mb-4">
                  <FormControl className="w-full mt-4">
                    <Button
                      className="m-auto"
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        setShowConfirmDelete(true)
                      }}
                    >
                      ELIMINAR USUARIO
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
            >
              {editId ? "Guardar" : "Crear"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={showConfirmDelete} className="max-w-xl mx-auto">
        <DialogTitle className="text-sm">
          Esta seguro de que desea ELIMINAR esta usuario?
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

export default Users;
