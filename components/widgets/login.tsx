import React, { useContext, useEffect, useState } from "react";
import { signIn } from "../../libs/usersApi";
import {
    Button,
    TextField,
    FormControl,
} from "@mui/material";
import { UserContext } from "../../contexts/userContext";
import { useRouter } from "next/router";
import { LoaderContext } from "../../contexts/loader";

const Login = () => {

    const DEFAULT_FORM_DATA = {
        ci: "",
        password: "",
    };

    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
    const [error, setError] = useState({ visible: false, error: "" })

    const { setUserType } = useContext(UserContext)
    const { isLoading, setLoading } = useContext(LoaderContext);
    const router = useRouter();

    useEffect(() => {
        setLoading(false)
        localStorage.setItem("token", "")
    }, [])

    const handleLogin = async () => {
        setError({ visible: false, error: "" })
        const { token, type } = await signIn(formData.ci, formData.password);
        if (token) {
            setLoading(true)
            setUserType(type)
            localStorage.setItem("user", type)
            localStorage.setItem("token", token)
            router.push('/absences');
        } else {
            setError({ visible: true, error: "No se pudo iniciar sesión, verifique usuario o contraseña" })
        }
    }

    const handleChange = (event: any) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    return (
        <div className="">
            <form className="m-auto mt-[200px] max-w-[350px] max-h-[600px]">
                <img
                    className="w-[100px] m-auto text-center align-center"
                    src="/favicon.ico" alt="" />
                <img
                    className="w-[100px] m-auto text-center align-center"
                    src="/title.PNG" alt="" />
                <p className="my-4 text-xl text-center">Administrador de Inasistencias Docentes</p>
                <div className="mb-4">
                    <FormControl className="w-full">
                        <TextField
                            required
                            label="Documento"
                            name="ci"
                            value={formData.ci}
                            onChange={handleChange}
                            className="w-full leading-normal text-gray-900 bg-white rounded-md focus:outline-none focus:shadow-outline"
                            variant="outlined"
                            disabled={isLoading}
                        />
                    </FormControl>
                </div>
                <div className="mb-4">
                    <FormControl className="w-full">
                        <TextField
                            required
                            label="Contraseña"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full leading-normal text-gray-900 bg-white rounded-md focus:outline-none focus:shadow-outline"
                            variant="outlined"
                            disabled={isLoading}
                        />
                    </FormControl>
                </div>

                {error.visible && (
                    <p className="mt-2 text-sm text-red-400">{error.error}</p>
                )}
                <div className="flex justify-center space-x-2">
                    <Button
                        className="w-full align-middle max-w-[200px] m-auto items-center flex mt-4"
                        variant="outlined"
                        color="success"
                        size="small"
                        onClick={() => {
                            handleLogin()
                        }}
                        disabled={isLoading}
                    >
                        Acceder
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Login;
