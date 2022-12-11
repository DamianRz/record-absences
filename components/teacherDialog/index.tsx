import React, { useState } from 'react'
import {
  Button,
  Chip,
  Dialog,
  IconButton
} from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useFormik } from 'formik'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'
import CustomTextField from '../custom-text-field'
import { TEACHER_INITIAL_VALUES, TEACHER_SCHEMA } from '../widgets/absences/validation'
import AlertDialog from '../alertDialog'
import CustomSelectField from '../custom-select-field'
import CustomTable from '../custom-table'
import { TableHeader } from '../../types/customTable'

const TeacherDialog: any = () => {

  const groupsd = [
    { value: 1, name: '1A' },
    { value: 2, name: '1B' },
    { value: 3, name: '1C' },
    { value: 4, name: '1D' }
  ]

  const mattersd = [
    { value: 1, name: 'Matematicas' },
    { value: 2, name: 'Geometria' }
  ]

  const specialtiesd = [
    { value: 1, name: 'Matematicas' },
    { value: 2, name: 'Filosofia' },
    { value: 3, name: 'Sistemas Operativos' },
    { value: 4, name: 'Programacion' },
    { value: 5, name: 'Base de datos' },
    { value: 6, name: 'Logica' }
  ]


  const [open, setOpen] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)

  const [groups, setGroups] = useState(groupsd)
  const [selectedGroup, setSelectedGroup] = useState(undefined)

  const [matters, setMatters] = useState(mattersd)
  const [selectedMatter, setSelectedMatter] = useState(undefined)

  const [specialties, setSpecialties] = useState(specialtiesd)
  const [selectedSpecialty, setSelectedSpecialty] = useState(undefined)

  const [selectedRowSpecialty, setSelectedRowSpecialty] = useState(undefined)


  const [selectedSpecialties, setSelectedSpecialties] = useState([])

  // groups and matters selected by new teacher
  const [GMs, setGMs] = useState([{group: "3-A", matter: "Matematicas"}])

  const formik: any = useFormik({
    initialValues: TEACHER_INITIAL_VALUES,
    validationSchema: TEACHER_SCHEMA,
    onSubmit: (values, errors) => {
      console.log(values, errors)
    }
  })

  const alertDialog = {
    title: 'Seguro que desea salir?',
    info: 'Los cambios no seran guardados',
    accept: 'Si, deseo salir',
    back: 'Volver'
  }

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

  const GMsColumns: TableHeader[] = [
    { name: 'group', value: 'Grupo' },
    { name: 'matter', value: 'Materia' },
  ]

  const specialtiesColumns: TableHeader[] = [
    {  value: 'Especialidad', name: 'name' },
    {  value: 'Acciones', name: 'actions' }
  ]




  const getValidatorError = (name: string) => {
    return formik.touched[name] && formik.errors[name] ? formik.errors[name] : ''
  }

  const handleCancelConfirm: any = () => {
    setOpenConfirm(false)
    setOpen(false)
  }

  const handleAddSpecialty: any = () => {
    console.log(selectedSpecialty)
    setSelectedSpecialties(data => [...data, selectedSpecialty])
    setSelectedSpecialty(undefined)
  }

  const filterSpecialties = specialties.filter(a => {
      let found = true;
      selectedSpecialties.forEach(b => {
        if(b == a) found = false
      })
      return found
    })
  
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

            {/* <div className='mt-4'>
              <span className=''>Seleccione el grupo y la asignatura correspondiente</span>
              <div className='flex mt-4 space-x-4'>
                <CustomSelectField
                    items={groups}
                    value={selectedGroup}
                    label="Grupo"
                    name="groups"
                    onChange={setSelectedGroup}
                    className="min-w-[160px]"
                  />
                  <CustomSelectField
                    items={matters}
                    value={selectedMatter}
                    label="Asignatura"
                    name="matters"
                    onChange={setSelectedMatter}
                    className="min-w-[160px]"
                  />
                  <Button
                    className='normal-case'
                    variant='outlined'
                    color='success'
                    endIcon={<AddIcon />}
                  >
                    Agregar
                  </Button>
              </div>
              <CustomTable
                isLoading={false}
                headers={GMsColumns}
                items={GMs}
                className="mt-4"
                onSelectRow={()=> {}}
                footerButtons={<></>}
              />
            </div> */}
            
            <div className='mt-4'>
              <span className=''>Seleccione especialidades</span>
              <div className='flex mt-4 space-x-4'>
                <CustomSelectField
                    items={filterSpecialties}
                    value={selectedSpecialty}
                    label="Especialidad"
                    name="specialties"
                    onChange={setSelectedSpecialty}
                    className="min-w-[160px]"
                  />
                  <Button
                    className='normal-case'
                    variant='outlined'
                    color='success'
                    endIcon={<AddIcon />}
                    onClick={handleAddSpecialty}
                    disabled={false}
                  >
                    Agregar
                  </Button>
              </div>
              <CustomTable
                isLoading={false}
                headers={specialtiesColumns}
                items={selectedSpecialties}
                className="mt-4"
                onSelectRow={setSelectedRowSpecialty}
                footerButtons={<>
                <Chip
                  className={'hover:bg-red-300'}
                  icon={<DeleteIcon />}
                  label="Eliminar"
                  onClick={() => {
                    setSelectedSpecialties(selectedSpecialties.filter((a: any) => a != selectedRowSpecialty))
                    setSelectedRowSpecialty(undefined)
                  }}
                />
                </>}
              />
            </div>

            <div className="flex items-center justify-center mt-8 space-x-4">
            <Button
                type='submit'
                className='normal-case'
                variant='outlined'
                color='success'
                  endIcon={<SaveIcon />}
            >
                Guardar
            </Button>
            <Button
                onClick={() => {}}
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
