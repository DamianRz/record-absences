
import React from "react";
import Drawer from "../drawer/drawer";
import Toolbar from "../toolbar/toolbar";

interface LayoutProps {
    children: React.ReactChild
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="block absolute w-full h-full bg-zinc-900">
            <div className="w-full h-full flex">
                <Drawer isAdmin={false} />
                <div className="w-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
export default Layout;
