
import React from "react";
import Drawer from "../drawer/drawer";
import Toolbar from "../toolbar/toolbar";
import styles from "./layout.module.scss";

interface LayoutProps {
    children: React.ReactChild
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className={styles.layout}>
            <Toolbar isAdmin={false} />
            <div className={styles.container}>
                <Drawer isAdmin={false} />
                <div className={styles.toolbox}>
                    {children}
                </div>
            </div>
        </div>
    );
}
export default Layout;
