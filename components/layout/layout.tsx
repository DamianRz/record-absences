
import React from "react";
import Drawer from "../drawer/drawer";
import Toolbar from "../toolbar/toolbar";
import styles from "./layout.module.scss";

const Layout: React.FC = ({ }) => {
    return (
        <div className={styles.layout}>
            {/* Contextos para mostrar herramientas y pantallas */}
            <Toolbar isAdmin={false} />
            <div className={styles.container}>
                <Drawer isAdmin={false} />
                <div className={styles.toolbox}></div>
            </div>
        </div>
    );
}
export default Layout;
