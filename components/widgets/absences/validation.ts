import * as yup from 'yup'
import { VALIDATIONS } from '../../../constants/validations'

export const TEACHER_SCHEMA = yup.object().shape({
  name: yup.string().required(VALIDATIONS.REQUIRED_FIELD),
  document: yup.string().required(VALIDATIONS.REQUIRED_FIELD),
  // startDate: yup.string().required(VALIDATIONS.REQUIRED_FIELD),
  // endDate: yup.string().required(VALIDATIONS.REQUIRED_FIELD)
})

export const TEACHER_INITIAL_VALUES = {
  name: '',
  lastName: '',
  document: '',
  // startDate: '',
  // endDate: ''
}
