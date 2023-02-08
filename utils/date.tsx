export const formatToLocalDate = (newDate: string) => {
    const date = new Date(newDate);
    const options: any = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('es-ES', options)
}

export const formatToISO = (newDate: string) => {
    const dateArr = newDate.split("/");
    const day = Number(dateArr[0]);
    const month = Number(dateArr[1]);
    const year = Number(dateArr[2]);
    const date = new Date(year, month - 1, day);
    return date.toISOString();
}