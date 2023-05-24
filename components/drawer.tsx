import React, { useContext, useEffect, useState } from "react";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PersonIcon from "@mui/icons-material/Person";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { LoaderContext } from "../contexts/loader";
import { useRouter } from "next/router";
import { AccountBox, ExitToApp } from "@mui/icons-material";
import { Button } from "@mui/material";
import { UserContext } from "../contexts/userContext";

interface DrawerProps {
  isAdmin: boolean;
}

const TOOLS = [
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
    label: "Visualizar",
    icon: AssessmentIcon,
    page: "/lista",
  },
  {
    label: "Usuarios",
    icon: AccountBox,
    page: "/users",
  },
  {
    label: "Salir",
    icon: ExitToApp,
    page: "/",
  },
];

const Drawer: React.FC<DrawerProps> = ({ isAdmin }) => {
  const [selected, setSelected] = useState(0);
  const [tools, setTools] = useState(TOOLS)
  const router = useRouter();

  const { isLoading, setLoading } = useContext(LoaderContext);
  const { userIsNormal, userIsAdmin } = useContext(UserContext)

  useEffect(() => {
    const loadData = async () => {
      if (userIsNormal() || userIsAdmin()) {
        const filteredTools = tools.filter(item => item.page !== "/users")
        setTools(filteredTools)
      }
      tools.map((item, index) => {
        if (item.page === `/${router.asPath.split("/")[1]}`) {
          setSelected(index);
          setLoading(true)
        }
      });
    }
    loadData()
  }, []);

  return (
    <div className="mt-3 h-full w-max min-w-[150px] inline-grid">
      {tools.map((item, index) => (
        <Button
          key={index}
          className="p-0 px-4 normal-case mb-1 h-[30px] min-w-[150px]"
          onClick={() => {
            setLoading(true)
            if (selected !== index) {
              router.push(item.page);
            }
          }}
          sx={{
            minWidth: "150px",
            display: "inline-flex",
            justifyContent: "start",
            color: "#000",
            margin: "0 40px 0 16px",
            textTransform: "none"
          }}
          startIcon={
            <item.icon
              className={`mr-1 w-[20px] ${selected === index ? "text-teal-300" : "text-teal-600"
                }`}
            />
          }
          disabled={isLoading || (selected == index)}
        >
          {item.label}
        </Button>
      ))}

    </div>
  );
};

export default Drawer;
