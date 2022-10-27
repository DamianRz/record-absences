import * as yup from 'yup';
import { VALIDATIONS } from '../../constants/validations';

export const loginSchema = yup.object().shape({
    name: yup.string().required(VALIDATIONS.REQUIRED_FIELD),
    document: yup.string().required(VALIDATIONS.REQUIRED_FIELD),
    startDate: yup.string().required(VALIDATIONS.REQUIRED_FIELD),
    endDate: yup.string().required(VALIDATIONS.REQUIRED_FIELD)
})

export const ABSENCES_INITIAL_VALUES = {
    name: "",
    document: "",
    startDate: "",
    endDate: "",
}
