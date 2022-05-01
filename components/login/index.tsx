import React from "react";
import styles from "./login.module.scss";
import Textfield from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { loginSchema, LOGIN_INITIAL_VALUES } from "./validation";
interface LoginProps {
  onSuccess: () => void;
  onError: () => void;
}
export const Login: React.FC<LoginProps> = () => {
  const formik = useFormik({
    initialValues: LOGIN_INITIAL_VALUES,
    validationSchema: loginSchema,
    onSubmit: () => {
        console.log("data", formik.values)
        // TODO
        /*
            Router controller, token controller by permissions
        */
    },
  });
  return (
    <div className="p-4 m-auto bg-white rounded shadow-xl w-80">
      <p className="mb-4 text-center">Iniciar de Sesion</p>
      <form onSubmit={formik.handleSubmit}>
        <Textfield
          fullWidth
          className="mb-2"
          id="document"
          name="document"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.document}
          error={formik.touched.document && Boolean(formik.errors.document)}
          helperText={formik.touched.document && formik.errors.document}
          label="Documento"
        />
        <Textfield
          fullWidth
          id="password"
          name="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          label="Contrasena"
          type="password"
        />
        <Button
          color="primary"
          className="flex w-40 m-auto mt-4 custom-button"
          variant="contained"
          disableElevation
          onClick={() => formik.handleSubmit()}
        >
          Acceder
        </Button>
      </form>
    </div>
  );
};
