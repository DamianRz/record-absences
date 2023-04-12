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
  FormLabel,
} from "@mui/material";
import { LoaderContext } from "../../contexts/loader";
import { getUserLogged } from "../../utils/user";

const Users = () => {
  const headers = [
    { name: "id", value: "ID" },
    { name: "name", value: "Documento" },
  ];

  const DEFAULT_FORM_DATA = {
    id: "",
    name: "",
    password: "",
  };

  const [users, setUsers] = useState<any[]>([]);
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
        await getUserList(true)
      } else {
        window.location.href = '/';
      }
      setLoading(false)
    }
    fetchToken()
  }, []);

  const getUserList = async (active: boolean) => {
    const users: { id: number, name: string }[] = await getUsers(active);
    const filteredUsers = users.filter((user) => user.name !== getUserLogged())
    if (filteredUsers) setUsers(filteredUsers)
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
      let data = { name: formData.name }
      if (formData.password) {
        Object.assign(data, { password: formData.password })
      }
      const responseSave = await setUser(editId, data);
      if (responseSave) {
        setOpen(false);
        await getUserList(true)
        setEditId(null)
      }
    } else {
      const responseSave = await signUp(Number(formData.name), formData.password)
      if (responseSave) {
        setOpen(false);
        await getUserList(true)
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
            <div className="mb-4">
              <FormControl className="w-full">
                <TextField
                  required
                  label="Documento"
                  name="name"
                  value={formData.name}
                  type="number"
                  onChange={handleChange}
                  className="w-full max-w-xs leading-normal text-gray-900 bg-white rounded-md focus:outline-none focus:shadow-outline"
                  variant="outlined"
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
