import React, { FC } from "react";

interface TitleSectionProps {
    title: string
}

const TitleSection: FC<TitleSectionProps> = ({ title }) => {
    return (
        <div className="w-full mb-1 px-4 py-1 bg-zinc-300 text-black rounded-sm">
            <span className="text-xl">{title}</span>
        </div>
    );
};

export default TitleSection;
