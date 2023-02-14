import React, { useContext, useEffect, useState } from "react";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PersonIcon from "@mui/icons-material/Person";

import EventBusyIcon from "@mui/icons-material/EventBusy";


import { LoaderContext } from "../contexts/loader-context";

import Link from "next/link";
import { useRouter } from "next/router";
import { ExitToApp } from "@mui/icons-material";

interface DrawerProps {
  isAdmin: boolean;
}

const tools = [
  {
    label: "Inasistencias",
    icon: EventBusyIcon,
    page: "/absences",
  },
  {
    label: "Profesores",
    icon: PersonIcon,
    page: "/teachers",
  },
  {
    label: "Grupos",
    icon: GroupIcon,
    page: "/groups",
  },
  {
    label: "Materias",
    icon: AssignmentIcon,
    page: "/matters",
  },
  {
    label: "Reportes",
    icon: AssessmentIcon,
    page: "/lista",
  },
  {
    label: "Salir",
    icon: ExitToApp,
    page: "/",
  },
];

const Drawer: React.FC<DrawerProps> = ({ isAdmin }) => {
  const [selected, setSelected] = useState(0);
  const { asPath } = useRouter();

  const { setLoading } = useContext(LoaderContext);

  useEffect(() => {
    tools.map((item, index) => {
      if (item.page === `/${asPath.split("/")[1]}`) {
        setLoading(true);
        setSelected(index);
        setLoading(false);
      }
    });
  }, []);

  return (
    <div className="h-full w-max min-w-[150px]">
      <ul className="pt-4 pl-4">
        {tools.map((item, index) => (
          <Link href={item.page} key={index}>
            <li
              className={`${selected === index ? "rounded-md bg-teal-100" : "text-zinc-900"
                } mb-1 py-1 cursor-pointer text-xs`}
            >
              <span className="flex items-center pl-2">
                <item.icon
                  className={`mr-1 w-[20px] ${selected === index && "text-teal-600"
                    }`}
                />
                {item.label}
              </span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Drawer;
