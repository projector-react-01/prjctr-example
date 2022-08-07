import React, { PropsWithChildren } from "react";
import { Header } from "./Header";

export const Layout: React.FC<PropsWithChildren<{}>> = ({ children }) => (
    <>
        <Header />
        {children}
    </>
);
