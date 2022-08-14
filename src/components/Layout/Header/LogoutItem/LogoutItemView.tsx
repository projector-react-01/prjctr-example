import React, { MouseEventHandler, PropsWithChildren } from "react";

export type ViewProps = {
    readonly onClick: () => void;
};

export const LogoutItemView: React.FC<PropsWithChildren<ViewProps>> = ({ children, onClick }) => {
    const onClickCallback: MouseEventHandler<HTMLAnchorElement> = e => {
        e.preventDefault();
        onClick();
    };
    return (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a href="#" onClick={onClickCallback}>
            {children}
        </a>
    );
};
