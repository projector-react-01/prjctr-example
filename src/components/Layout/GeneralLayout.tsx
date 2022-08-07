import React, { PropsWithChildren } from "react";
import { Grid } from "@mui/material";
import { Header } from "./Header";

export const GeneralLayout: React.FC<PropsWithChildren<{}>> = ({ children }) => (
    <Grid container spacing={2}>
        <Grid item xs={12}>
            <Header />
        </Grid>

        <Grid item xs={12}>
            {children}
        </Grid>
    </Grid>
);
