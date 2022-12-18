import React, { useState } from 'react'
import {
  Button,
  Dialog,
  IconButton
} from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useFormik } from 'formik'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'
import CustomTextField from '../custom-text-field'
import { TEACHER_INITIAL_VALUES, TEACHER_SCHEMA } from '../widgets/absences/validation'
import AlertDialog from '../alertDialog'
import { TableHeader } from '../../types/customTable'
import SelectList from '../selectList'

const TeacherDialog: any = () => {

  const [open, setOpen] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [selectedSpecialties, setSelectedSpecialties] = useState([])
  
  const specialtiesd = [
    { value: 1, label: 'Matematicas' },
    { value: 2, label: 'Filosofia' },
    { value: 3, label: 'Sistemas Operativos' },
    { value: 4, label: 'Programacion' },
    { value: 5, label: 'Base de datos' },
    { value: 6, label: 'Logica' }
  ]

  const specialtiesColumns: TableHeader[] = [
    {  value: 'Especialidad', label: 'label' },
  ]

  const { fieldDocument, fieldName, fieldLastName } = {
    fieldName: {
      label: 'Nombre',
      name: 'name'
    },
    fieldLastName: {
      label: 'Apellido',
      name: 'lastName'
    },
    fieldDocument: {
      label: 'Documento',
      name: 'document'
    }
  }

  const alertDialog = {
    title: 'Seguro que desea salir?',
    info: 'Los cambios no seran guardados',
    accept: 'Si, deseo salir',
    back: 'Volver'
  }

  const formik: any = useFormik({
    initialValues: TEACHER_INITIAL_VALUES,
    validationSchema: TEACHER_SCHEMA,
    onSubmit: (values, errors) => {
      console.log(values, errors)
    }
  })

  const getValidatorError = (name: string) => {
    return formik.touched[name] && formik.errors[name] ? formik.errors[name] : ''
  }

  const handleCancelConfirm: any = () => {
    setOpenConfirm(false)
    setOpen(false)
  }

  const handleCancel: any = () => {
    setOpenConfirm(true)
  }

  return (
    <>
      <AlertDialog
        open={openConfirm}
        onAccept={handleCancelConfirm}
        onClose={() => setOpenConfirm(false)}
        title={alertDialog.title}
        info={alertDialog.info}
        acceptLabel={alertDialog.accept}
        backLabel={alertDialog.back}
      />
      <Button
        className="p-0 ml-6 text-xs normal-case align-center"
        size="small"
        type="button"
        onClick={() => setOpen(true)}
      >
        <PersonAddIcon className="mr-1 w-[20px]" />
        Crear Nuevo Profesor
      </Button>
      <Dialog
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <div className="px-6 py-8 bg-white">
          <span className="flex justify-center text-center">Nuevo Profesor</span>
          <IconButton
          onClick={() => setOpenConfirm(true)}
          className='absolute top-0 right-0' aria-label="delete">
            <CloseIcon />
          </IconButton>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex mt-[40px]">
              <CustomTextField
                name={fieldDocument.name}
                label={fieldDocument.label}
                onChange={formik.handleChange}
                value={formik.values.document}
                error={!!(getValidatorError(fieldDocument.name))}
                helperText={getValidatorError(fieldDocument.name)}
              />
            </div>
            <div className="flex mt-4 space-x-4">
            <CustomTextField
                name={fieldName.name}
                label={fieldName.label}
                onChange={formik.handleChange}
                value={formik.values.name}
                error={!!(getValidatorError(fieldName.name))}
                helperText={getValidatorError(fieldName.name)}
              />
            <CustomTextField
                name={fieldLastName.name}
                label={fieldLastName.label}
                onChange={formik.handleChange}
                value={formik.values.lastName}
                error={!!(getValidatorError(fieldLastName.name))}
                helperText={getValidatorError(fieldLastName.name)}
              />
            </div>
            <div className='flex justify-center w-full mt-4'>
            <SelectList
              headers={specialtiesColumns}
              items={specialtiesd}
              onChange={setSelectedSpecialties}
              title="Seleccione especialidades"
              label="Especialidad"
              name='specialties'
              error={false}
              helperText={""}
            />
            </div>
            <div className="flex items-center justify-center mt-8 space-x-4">
            <Button
                type='submit'
                className='normal-case'
                variant='outlined'
                color='success'
                endIcon={<SaveIcon />}
                disabled={formik.errors && selectedSpecialties.length === 0}
            >
                Guardar
            </Button>
            <Button
                onClick={handleCancel}
                className='normal-case'
                variant='outlined'
                color='inherit'
            >
                Cancelar
            </Button>
            </div>
          </form>
        </div>
      </Dialog>
    </>
  )
}

export default TeacherDialog
