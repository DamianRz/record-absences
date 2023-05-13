export const fieldMaxWidth = (value: string) => {
    if (value.length > 30) return "El campo debe tener menos de 30 caracteres"
    return undefined
}

export const validateFields = (formData: any, errors: any) => {
    let failed = false
    let error = {}
    Object.keys(errors).map((fieldName: string) => {
        if (formData[fieldName].length > 30) {
            const newError = {
                [fieldName]: {
                    visible: true,
                    error: "El texto es muy largo"
                }
            }
            Object.assign(error, newError)
            failed = true
        }
    })
}
