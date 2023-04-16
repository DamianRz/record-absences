export const HEADERS = [
    { name: "id", value: "id" },
    { name: "document", value: "CI" },
    { name: "name", value: "Nombre" },
    { name: "lastname", value: "Apellido" },
    { name: "group", value: "Grupo" },
    { name: "matter", value: "Materia" },
    { name: "startDate", value: "Fecha Incio" },
    { name: "endDate", value: "Fecha Fin" },
    { name: "activeLabel", value: "Activo" },
];

export const TURNS =
    [
        { id: 1, name: "Matutino" },
        { id: 2, name: "Vespertino" },
        { id: 3, name: "Nocturno" }
    ]

const ITEM_HEIGHT = 30;
const ITEM_PADDING_TOP = 8;

export const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export interface IAbsence {
    id: number,
    gmpId: number,
    turnId: number,
    startDate: string,
    endDate: string,
    reason: string,
    active: boolean,
    gmp: {
        id: number,
        mgId: number,
        proffessorId: number,
        active: boolean
    },
    turn: {
        id: number,
        name: string
    }
}

export const ABSENCES_FORM = {
    id: -1,
    groupId: "",
    matterId: "",
    gmpId: "",
    gmps: [],
    turn: "",
    turnId: -1,
    startDate: "",
    endDate: "",
    document: "",
    name: "",
    lastname: "",
    reason: "",
    groupMatter: [],
    active: false
};

export interface IAbsencesFormatted {
    id: number,
    document: number,
    name: string,
    lastname: string,
    group: string,
    groupId: number,
    matter: string,
    matterId: number,
    gmpId: number,
    gmps: any, // TODO
    gmpData: any, // TODO
    reason: string,
    startDate: string,
    endDate: string,
    turnName: string,
    turnId: number,
    active: boolean,
    activeLabel: string
}