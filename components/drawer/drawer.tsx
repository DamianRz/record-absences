import React, { useEffect, useState } from "react";
import EventBusyIcon from '@mui/icons-material/EventBusy';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';

import Link from 'next/link';
import { useRouter } from 'next/router';

interface DrawerProps {
    isAdmin: boolean
}

const tools = [
    {
        label: "Usuarios",
        icon: PersonIcon,
        page: "/users"
    },
    {
        label: "Inasistencias",
        icon: EventBusyIcon,
        page: "/absences"
    },
    {
        label: "Grupos",
        icon: GroupIcon,
        page: "/groups"
    },
    {
        label: "Materias",
        icon: AssignmentIcon,
        page: "/matter"
    },
    {
        label: "Reportes",
        icon: AssessmentIcon,
        page: "/reports"
    }
];

const Drawer: React.FC<DrawerProps> = ({ isAdmin }) => {
    const [selected, setSelected] = useState(0);
    const { asPath } = useRouter();

    useEffect(() => {
        tools.map((item, index) => {
            if (item.page === `/${asPath.split("/")[1]}`) {
                setSelected(index)
            }
        })
    }, [])

    return (
        <div className="w-max h-full text-center">
            <ul className="pt-0">
                {tools.map((item, index) =>
                    <Link href={item.page}>
                        <li
                            key={index}
                            className={`flex items-center mb-1 px-4 py-1 cursor-pointer
                            ${selected === index ? "bg-gray-300 rounded-md" : ""}`}
                        >
                            <span className="flex">
                                <item.icon className="mr-1" />
                                {item.label}
                            </span>
                        </li>
                    </Link>
                )}
            </ul>
        </div>
    );
};

export default Drawer;
