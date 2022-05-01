import * as yup from 'yup';
import { VALIDATIONS } from '../../constants/validations';

export const loginSchema = yup.object().shape({
    document: yup.number().required(VALIDATIONS.REQUIRED_FIELD),
    password: yup.string().required(VALIDATIONS.REQUIRED_FIELD)
})

export const LOGIN_INITIAL_VALUES = {
    document: "",
    password: ""
}
