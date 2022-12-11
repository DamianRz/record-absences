import { Chip } from '@mui/material'
import React, { useState } from 'react'
import CustomTable from '../../custom-table'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch'
import { mokAbsences, mokUsers } from '../../../api/users.mok'
import { TableHeader } from '../../../types/customTable'
import TitleSection from '../../title-section'
import TeacherDialog from '../../teacherDialog'

const TeachersWidget: any = () => {
  const [selectedTeacher, setSelectedTeacher] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [teachers, setTeachers] = useState(mokUsers)
  const [absences, setAbsences] = useState(mokAbsences)
  const [showAbsences, setShowAbsences] = useState(false)

  const teacherColumns: TableHeader[] = [
    { name: 'document', value: 'Documento' },
    { name: 'name', value: 'Nombre' },
    { name: 'lastname', value: 'Apellido' }
  ]

  const absencesColumns: TableHeader[] = [
    { name: 'startDate', value: 'Fecha inicio' },
    { name: 'endDate', value: 'Fecha fin' },
    { name: 'motive', value: 'Motivo' }
  ]

  const handleSelectRow: any = (teacher: any) => {
    setShowAbsences(false)
    setSelectedTeacher(teacher)
  }

  const handleShowAbsences: any = () => {
    setShowAbsences(true)
  }

  return (
    <div className="bg-zing-900">
      <TitleSection title="Lista de profesores">
        <TeacherDialog />
      </TitleSection>
      <CustomTable
        isLoading={isLoading}
        headers={teacherColumns}
        items={teachers}
        className="mt-4"
        onSelectRow={handleSelectRow}
        footerButtons={
          <>
            <Chip
              className={'hover:bg-green-500'}
              label="Editar"
              icon={<EditIcon className="rounded-full " />}
              onClick={() => {}}
            />
            <Chip
              icon={<ContentPasteSearchIcon />}
              label="Ver Inasistencias"
              onClick={handleShowAbsences}
            />
          </>
        }
      />
      {selectedTeacher && showAbsences && (
        <>
          <TitleSection title="Inasistencias" />
          <CustomTable
            isLoading={isLoading}
            headers={absencesColumns}
            items={absences}
            className="mt-4"
            onSelectRow={setSelectedTeacher}
            footerButtons={
              <>
                <Chip
                  className={'hover:bg-green-500'}
                  label="Editar"
                  icon={<EditIcon className="rounded-full " />}
                  onClick={() => {}}
                />
                <Chip
                  className={'hover:bg-red-300'}
                  icon={<DeleteIcon />}
                  label="Eliminar"
                  onClick={() => {}}
                />
              </>
            }
          />
        </>
      )}
    </div>
  )
}

export default TeachersWidget
