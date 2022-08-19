import React from "react";
import styles from "./drawer.module.scss";

interface DrawerProps {
    isAdmin: boolean
}

const tools = [
    {
        label: "",
        name: "d",
        icon: "s"
    }
];

const Drawer: React.FC<DrawerProps> = ({ isAdmin }) => {
    return (
        <div className={styles.drawer}>
        </div>
    );
};

export default Drawer;
