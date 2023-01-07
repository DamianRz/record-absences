export const getSpecialties = async () => {
    return [
            { id: 1, name: "Matematicas" },
            { id: 2, name: "Filosofia" },
            { id: 3, name: "Sistemas Operativos" },
            { id: 4, name: "Programacion" },
            { id: 5, name: "Base de datos" },
            { id: 6, name: "Logica" },
    ]
}

export const getSpecialtiesByTeacher = async (teacherId: number) => {
    return [
        { id: 2, name: "Matematicas" },
        { id: 2, name: "Geometria" },
    ]
    // return await fetch("/api/professors")
    //     .then(response => response.json)
}
