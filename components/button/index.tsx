import React, { FC } from "react";
import MIButton from  "@mui/material/Button";
import styles from "./button.module.scss";

interface buttonProps {
    label: string,
    type: "error" | "accept" | "cancel"
}

const Button: FC<buttonProps> = ({ label, type }) => {
    return <MIButton 
        className={styles.button}
        variant="contained"
        >
            { label }
        </MIButton>
};

export default Button;
