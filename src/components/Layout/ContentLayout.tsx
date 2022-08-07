import React, { PropsWithChildren } from "react";
import { Box, Grid } from "@mui/material";

export const ContentLayout: React.FC<PropsWithChildren<{}>> = ({ children }) => (
    <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} columns={12}>
            <Grid item xs={3} />
            <Grid item xs={6}>
                {children}
            </Grid>
            <Grid item xs={3} />
        </Grid>
    </Box>
);
