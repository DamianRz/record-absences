import React, {FC} from "react";
import styles from "./title-section.module.scss";

interface TitleSectionProps {
    title: string
}

const TitleSection: FC<TitleSectionProps> = ({title}) => {
    return (
        <div className={styles.titlesection}>
            <p>{title}</p>
        </div>
    );
};

export default TitleSection;
