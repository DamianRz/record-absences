import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React, { useState } from "react"
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useFormik } from "formik";
import TextField from "@mui/material/TextField"

import CustomTextField from "../custom-text-field";
import { ABSENCES_INITIAL_VALUES, loginSchema } from "../sections/absences/validation";

interface UserDialogProps {
    // show: boolean
}

const UserDialog: React.FC<UserDialogProps> = ({ }) => {
    const [open, setOpen] = useState(false);

    const formik = useFormik({
        initialValues: ABSENCES_INITIAL_VALUES,
        validationSchema: loginSchema,
        onSubmit: () => {
            console.log("data", formik.values);
        },
    });


    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            <Button
                className='ml-6 align-center text-xs p-0 normal-case'
                size='small'
                type='button'
                onClick={handleOpen}>
                <PersonAddIcon className='mr-1 w-[20px]' />
                Nuevo Usuario
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <div className="p-4 bg-white">
                    <span className="text-xs">Nuevo Usuario</span>
                    <form className="" onSubmit={formik.handleSubmit}>
                        <span className="text-xs">
                            Ingrese los datos del docente, fechas, grupo, materia y turno
                        </span>
                        <div className="flex mt-4">
                            <CustomTextField
                                name="document"
                                label={"Documento"}
                                value={formik.values.document}
                                onChange={formik.handleChange}
                                error={Boolean(formik.touched.document && Boolean(formik.errors.document))}
                                helperText={(formik.touched.document && formik.errors.document) || ""}
                            />
                        </div>
                        <div className="flex mt-4">
                            <CustomTextField
                                name="name"
                                label={"Nombre"}
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={Boolean(formik.touched.name && Boolean(formik.errors.name))}
                                helperText={(formik.touched.name && formik.errors.name) || ""}
                            />
                            <CustomTextField
                                name="lastname"
                                label={"Apellido"}
                                className="ml-2"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={Boolean(formik.touched.name && Boolean(formik.errors.name))}
                                helperText={(formik.touched.name && formik.errors.name) || ""}
                            />
                        </div>
                        <div className="flex mt-4">
                            <CustomTextField
                                name="name"
                                label={"Materia"}
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={Boolean(formik.touched.name && Boolean(formik.errors.name))}
                                helperText={(formik.touched.name && formik.errors.name) || ""}
                            />
                            <CustomTextField
                                name="lastname"
                                label={"Grupo"}
                                className="ml-2"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={Boolean(formik.touched.name && Boolean(formik.errors.name))}
                                helperText={(formik.touched.name && formik.errors.name) || ""}
                            />
                        </div>
                    </form>
                </div>
            </Dialog>
        </>
    )
};

export default UserDialog;
