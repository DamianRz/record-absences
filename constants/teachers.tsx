export const TEACHER_HEADERS = [
    { name: "id", value: "ID" },
    { name: "name", value: "Nombre" },
    { name: "lastname", value: "Apellido" },
    { name: "ci", value: "CI" },
    { name: "activeLabel", value: "Activo" },
];

export const GROUPS_HEADERS = [
    { name: "id", value: "ID" },
    { name: "groupName", value: "Grupo" },
    { name: "matterName", value: "Materia" },
    { name: "turnName", value: "Turno" },
    { name: "grade", value: "Grado" },
    { name: "activeLabel", value: "Estado" },
]

export const TEACHER_DEFAULT_FORM_DATA = {
    id: -1,
    personId: -1,
    teacherId: -1,
    document: "",
    groupId: "",
    matterId: "",
    gmpId: "",
    gmps: [],
    specialties: [],
    specialtyNames: [],
    matterSpecialtyIds: [],
    availableMGs: [],
    selectedGroupsNames: [],
    selectedMGIds: [],
    updatedGmps: [],
    turn: "",
    turnId: "",
    selectedGrade: "",
    name: "",
    lastname: "",
    active: true,
    activeLabel: ""
};

export interface IFormData {
    id: number,
    personId: number,
    teacherId: number,
    document: number | string,
    groupId: number | string,
    matterId: number | string,
    gmpId: number | string | null,
    gmps: any[],
    specialties: any[],
    specialtyNames: string[],
    matterSpecialtyIds: number[],
    availableMGs: any[],
    selectedGroupsNames: string[],
    selectedMGIds: number[],
    updatedGmps: any[],
    turn: number | string,
    turnId: number | string,
    selectedGrade: number | string,
    name: string,
    lastname: string,
    active: boolean,
    activeLabel: string
}

export interface IGmp {
    id: number | null,
    gmpId: null | number,
    matterName: string,
    groupName: string,
    turnName: string,
    grade: number | null,
    activeLabel: string,
    active: boolean
}

export const SELECTED_GMP = {
    id: null,
    gmpId: null,
    matterName: "",
    groupName: "",
    turnName: "",
    grade: null,
    activeLabel: "",
    active: false
}