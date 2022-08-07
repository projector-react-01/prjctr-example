import React, { EventHandler, PropsWithChildren, MouseEvent } from "react";

export type ViewProps = {
    readonly onClick: () => void;
    readonly href: string;
};

export const NavigateToView: React.FC<PropsWithChildren<ViewProps>> = ({
    onClick,
    href,
    children
}) => {
    const onClickCallback: EventHandler<MouseEvent> = e => {
        e.preventDefault();
        onClick();
    };

    return (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a href={href} onClick={onClickCallback}>
            {children}
        </a>
    );
};
