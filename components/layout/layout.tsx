
import { CircularProgress } from "@mui/material";
import React, { useContext } from "react";
import { LoaderContext } from "../../contexts/loader-context";
import Drawer from "../drawer/drawer";

interface LayoutProps {
    children: React.ReactChild
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

    const { isLoading } = useContext(LoaderContext)

    return (
        <div className="block absolute w-full h-full">
            <div className="w-full h-full flex">
                <Drawer isAdmin={false} />
                {
                    isLoading ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <CircularProgress />
                        </div>
                    ) : (
                        <div className="w-full px-4">
                            {children}
                        </div>
                    )
                }

            </div>
        </div>
    );
}
export default Layout;
