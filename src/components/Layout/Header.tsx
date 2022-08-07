import React from "react";
import { Container, MenuItem, MenuList, Paper } from "@mui/material";
import { NavigateTo } from "../../routing/NavigatoTo/NavigateTo";
import { Route } from "../../routing/types";

export const Header: React.FC = () => (
    <Paper elevation={1}>
        <Container>
            <MenuList dense={true}>
                <NavigateTo route={Route.Home}>
                    <MenuItem>Home</MenuItem>
                </NavigateTo>

                <NavigateTo route={Route.Profile}>
                    <MenuItem>Profile</MenuItem>
                </NavigateTo>

                <MenuItem>SignIn/SignUp</MenuItem>
            </MenuList>
        </Container>
    </Paper>
);
