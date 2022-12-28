import React, { useContext, useEffect, useState } from "react";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PersonIcon from "@mui/icons-material/Person";
import { LoaderContext } from "../../contexts/loader-context";

import Link from "next/link";
import { useRouter } from "next/router";

interface DrawerProps {
  isAdmin: boolean;
}

const tools = [
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
    page: "/reports",
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
    <div className="h-full px-4 py-4 w-max">
      <span className="m-auto text-xs cursor-default ">Dashboard</span>
      <ul className="pt-4">
        {tools.map((item, index) => (
          <Link href={item.page} key={index}>
            <li
              className={`${
                selected === index ? "rounded-md bg-blue-50" : "text-zinc-900"
              } mb-1 py-1 cursor-pointer text-xs`}
            >
              <span className="flex items-center">
                <item.icon
                  className={`mr-1 w-[20px] ${
                    selected === index && "text-[#1976d2]"
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
