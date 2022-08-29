import React, { useState } from "react";
import styles from "./drawer.module.scss";
import EventBusyIcon from '@mui/icons-material/EventBusy';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';

interface DrawerProps {
    isAdmin: boolean
}

const tools = [
    {
        label: "Inasistencias",
        icon: EventBusyIcon
    },
    {
        label: "Grupos",
        icon: GroupIcon
    },
    {
        label: "Materias",
        icon: AssignmentIcon
    },
    {
        label: "Reportes",
        icon: AssessmentIcon
    },
    {
        label: "Usuarios",
        icon: PersonIcon
    }
];

const Drawer: React.FC<DrawerProps> = ({ isAdmin }) => {
    const [selected, setSelected] = useState(0);
    return (
        <div className={styles.drawer}>
            {/* <p className={styles.title}>Herramientas</p> */}
            <ul>
                { tools.map((item, index) => 
                    <li 
                        key={index} 
                        className={selected === index ? styles.selected : ""}
                        onClick={()=> { setSelected(index) }}
                    >
                        <item.icon />
                        {item.label}
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Drawer;
