import React, { useState } from "react";
import TitleSection from "../title-section";
import Textfield from "@mui/material/TextField";
import { useFormik } from "formik";
import { loginSchema, ABSENCES_INITIAL_VALUES } from "./validation";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "@mui/material/Button";
import { FormControl, MenuItem, Select } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import styles from "./absences.module.scss";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

const Absences = () => {
  interface IGroup {
    id: number;
    name: string;
  }
  interface ICourse {
    id: number;
    name: string;
  }
  interface IShift {
    id: number;
    name: string;
  }

  const [startDate, setStartDate] = useState<any>(undefined);
  const [endDate, setEndDate] = useState<any>(undefined);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [shifts, setShifts] = useState<IShift[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<undefined>(undefined);
  const [selectedCourse, setSelectedCourse] = useState<undefined>(undefined);
  const [selectedShift, setSelectedShift] = useState<undefined>(undefined);

  const formik = useFormik({
    initialValues: ABSENCES_INITIAL_VALUES,
    validationSchema: loginSchema,
    onSubmit: () => {
      console.log("data", formik.values);
    },
  });

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
  }));

  /*
  pasos para crear la inasistencia

  ingresar docente, es necesario ya realizar una busqueda previa?
  a partir del nombre o del documento?

  A partir del documento. realizar consulta y retornar datos del docente




*/

  return (
    <div className={styles.tool}>
      <TitleSection title="Ingreso de Inasistencias Docente" />
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <p className={styles.info}>
          Ingrese los datos del docente, fechas, grupo, materia y turno
        </p>
        <div className={styles.row}>
          {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Nombre del docente"
              inputProps={{ "aria-label": "search" }}
            />
          </Search> */}

          {/* Insegre el documento sin puntos ni guiones */}

          <Textfield
            size="small"
            fullWidth={false}
            className="mb-4"
            id="document"
            name="document"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.document}
            autoComplete="off"
            error={
              (formik.touched.document && Boolean(formik.errors.document)) ||
              false
            }
            helperText={
              (formik.touched.document && formik.errors.document) || ""
            }
            label="C.I. del Docente"
          />
          {/* <Button
            className="mr-2"
            onClick={() => {}}
            color="success"
            variant="outlined"
            size="small"
          >
            buscar
          </Button> */}
        </div>
        <div className={styles.row}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Date desktop"
              inputFormat="DD/MM/YYYY"
              value={startDate}
              onChange={(value) => setStartDate(value)}
              minDate={new Date()}
              renderInput={(params) => (
                <Textfield
                  {...params}
                  size="small"
                  fullWidth={false}
                  className="mb-4 mr-4"
                  id="document"
                  name="document"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.startDate}
                  error={
                    (formik.touched.startDate &&
                      Boolean(formik.errors.startDate)) ||
                    false
                  }
                  helperText={
                    (formik.touched.startDate && formik.errors.startDate) || ""
                  }
                  label="Fecha Inicio"
                />
              )}
            />
            <DesktopDatePicker
              label="Date desktop"
              inputFormat="DD/MM/YYYY"
              value={endDate}
              onChange={(value) => setEndDate(value)}
              minDate={startDate || new Date()}
              renderInput={(params) => (
                <Textfield
                  {...params}
                  size="small"
                  fullWidth={false}
                  className="mb-4"
                  id="document"
                  name="document"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.endDate}
                  error={
                    (formik.touched.endDate &&
                      Boolean(formik.errors.endDate)) ||
                    false
                  }
                  helperText={
                    (formik.touched.endDate && formik.errors.endDate) || ""
                  }
                  label="Fecha Fin"
                />
              )}
            />
          </LocalizationProvider>
        </div>
        <div className={styles.row}>
          <FormControl sx={{ minWidth: 150 }} className="mr-4">
            <InputLabel id="demo-simple-select-label">Grupo</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedGroup}
              label="Grupo"
              fullWidth={false}
              onChange={(value) => setSelectedGroup(value)}
            >
              {groups.map((item: IGroup, index: number) => (
                <MenuItem value={item.id} key={index}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }} className="mr-4">
            <InputLabel id="demo-simple-select-label">Materia</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedCourse}
              label="Grupo"
              fullWidth={false}
              onChange={(value) => setSelectedCourse(value)}
            >
              {courses.map((item: ICourse, index: number) => (
                <MenuItem value={item.id} key={index}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="demo-simple-select-label">Turno</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedShift}
              label="Grupo"
              fullWidth={false}
              onChange={(value) => setSelectedShift(value)}
            >
              {shifts.map((item: IShift, index: number) => (
                <MenuItem value={item.id} key={index}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className={styles.row}>
          <Textfield
            size="small"
            fullWidth={true}
            className="mt-4"
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.name}
            error={
              (formik.touched.name && Boolean(formik.errors.name)) || false
            }
            helperText={(formik.touched.name && formik.errors.name) || ""}
            label="Motivo de inasistencia"
          />
        </div>
        <Button
          className="mt-8"
          onClick={() => {}}
          color="success"
          variant="outlined"
        >
          Crear
        </Button>
      </form>
    </div>
  );
};

export default Absences;
