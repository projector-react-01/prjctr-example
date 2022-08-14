import React from "react";
import { Container, Grid, MenuItem, MenuList, Paper } from "@mui/material";
import { MenuItemType, NavigationMenuItemTypeToRoute } from "./types";
import { assertNever } from "../../../ts-utils";
import { NavigateTo } from "../../../routing/NavigatoTo/NavigateTo";
import { LogoutItem } from "./LogoutItem/LogoutItem";

function menuItemTypeToLabel(menuItemType: MenuItemType): string {
    switch (menuItemType) {
        case MenuItemType.Home:
            return "Home";
        case MenuItemType.Profile:
            return "Profile";
        case MenuItemType.SignIn:
            return "SignIn";
        case MenuItemType.SignUp:
            return "SignUp";
        case MenuItemType.Logout:
            return "Logout";
        default:
            return assertNever(menuItemType);
    }
}

type MenuProps = {
    readonly leftMenu: readonly MenuItemType[];
    readonly rightMenu: readonly MenuItemType[];
};

function renderMenuItem(menuItemType: MenuItemType) {
    switch (menuItemType) {
        case MenuItemType.Home:
        case MenuItemType.Profile:
        case MenuItemType.SignIn:
        case MenuItemType.SignUp: {
            const route = NavigationMenuItemTypeToRoute[menuItemType];

            return (
                <NavigateTo route={route}>
                    <MenuItem>{menuItemTypeToLabel(menuItemType)}</MenuItem>
                </NavigateTo>
            );
        }

        case MenuItemType.Logout:
            return <LogoutItem>{menuItemTypeToLabel(menuItemType)}</LogoutItem>;
        default:
            return assertNever(menuItemType);
    }
}

export const MenuGrid: React.FC<MenuProps> = ({ leftMenu, rightMenu }) => (
    <MenuList dense={true}>
        <Grid container justifyContent="space-between" columns={leftMenu.length + rightMenu.length}>
            <Grid item xs={leftMenu.length - 1}>
                <Grid container columns={leftMenu.length - 1}>
                    {leftMenu.map(item => (
                        <Grid item xs={0.5}>
                            {renderMenuItem(item)}
                        </Grid>
                    ))}
                </Grid>
            </Grid>

            <Grid item xs={rightMenu.length - 1}>
                <Grid container columns={rightMenu.length - 1}>
                    {rightMenu.map(item => (
                        <Grid item xs={0.5}>
                            <Grid item xs={0.5}>
                                {renderMenuItem(item)}
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    </MenuList>
);

export type ViewProps = MenuProps;

export const HeaderView: React.FC<MenuProps> = ({ rightMenu, leftMenu }) => (
    <Paper elevation={1}>
        <Container>
            <MenuGrid leftMenu={leftMenu} rightMenu={rightMenu} />
        </Container>
    </Paper>
);
