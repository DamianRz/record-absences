import React, { useEffect, useState } from "react";
import { signIn } from "../../libs/usersApi";
import {
    Button,
    TextField,
    FormControl,
} from "@mui/material";

const Login = () => {

    const DEFAULT_FORM_DATA = {
        ci: "",
        password: "",
    };

    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
    const [error, setError] = useState({ visible: false, error: "" })

    useEffect(() => {
        localStorage.setItem("token", "")
    }, [])

    const handleLogin = async () => {
        setError({ visible: false, error: "" })
        const { token } = await signIn(Number(formData.ci), formData.password);
        if (token) {
            localStorage.setItem("token", token)
            window.location.href = '/absences';
        } else {
            setError({ visible: true, error: "No se pudo iniciar sesion verifique usuario o contrasena" })
        }
    }

    const handleChange = (event: any) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
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

    return (
        <div className="">
            <form onSubmit={handleSubmit} className="m-auto mt-[200px] max-w-[350px] max-h-[600px]">
                <p className="my-4 text-xl text-center">Bienvenido al Adminstrador de Inasistencias Docentes</p>
                <FormControl className="w-full">
                    <TextField
                        required
                        label="Documento"
                        name="ci"
                        value={formData.ci}
                        onChange={handleChange}
                        className="w-full leading-normal text-gray-900 bg-white rounded-md focus:outline-none focus:shadow-outline"
                        variant="outlined"
                    />
                </FormControl>
                <FormControl className="w-full mt-4">
                    <TextField
                        label="Contrasena"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full leading-normal text-gray-900 bg-white rounded-md focus:outline-none focus:shadow-outline"
                        variant="outlined"
                    />
                </FormControl>
                {error.visible && (
                    <p className="mt-2 text-sm text-red-400">{error.error}</p>
                )}
                <Button
                    className="w-full align-middle max-w-[200px] m-auto items-center flex mt-4"
                    variant="outlined"
                    color="success"
                    onClick={() => {
                        handleLogin()
                    }}
                >
                    Acceder
                </Button>
            </form>
        </div>
    );
};

export default Login;
