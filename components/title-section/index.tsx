import React, { FC } from "react";

interface TitleSectionProps {
    children?: React.ReactChild,
    title: string
}

const TitleSection: FC<TitleSectionProps> = ({ children, title }) => {
    return (
        <div className="flex items-center w-full pt-4 pb-1 bg-zinc-900 text-white">
            <span className="text-xs">{title}</span>
            {children}
        </div>
    );
};

export default TitleSection;
