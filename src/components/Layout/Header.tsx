import React from "react";
import { Container, Grid, MenuItem, MenuList, Paper } from "@mui/material";
import { NavigateTo } from "../../routing/NavigatoTo/NavigateTo";
import { Route } from "../../routing/types";

type MenuNavigationItem = {
    readonly route: Route;
    readonly title: string;
};

type MenuProps = {
    readonly leftMenu: readonly MenuNavigationItem[];
    readonly rightMenu: readonly MenuNavigationItem[];
};

export const MenuGrid: React.FC<MenuProps> = ({ leftMenu, rightMenu }) => (
    <MenuList dense={true}>
        <Grid container justifyContent="space-between" columns={leftMenu.length + rightMenu.length}>
            <Grid item xs={leftMenu.length - 1}>
                <Grid container columns={leftMenu.length - 1}>
                    {leftMenu.map(item => (
                        <Grid item xs={0.5}>
                            <NavigateTo route={item.route}>
                                <MenuItem>{item.title}</MenuItem>
                            </NavigateTo>
                        </Grid>
                    ))}
                </Grid>
            </Grid>

            <Grid item xs={rightMenu.length - 1}>
                <Grid container columns={rightMenu.length - 1}>
                    {rightMenu.map(item => (
                        <Grid item xs={0.5}>
                            <NavigateTo route={item.route}>
                                <MenuItem>{item.title}</MenuItem>
                            </NavigateTo>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    </MenuList>
);

const LeftMenu: readonly MenuNavigationItem[] = [
    {
        route: Route.Home,
        title: "Home"
    },
    {
        route: Route.Profile,
        title: "Profile"
    }
];

export const RightMenu: readonly MenuNavigationItem[] = [
    {
        route: Route.SignIn,
        title: "SignIn"
    },
    {
        route: Route.SignUp,
        title: "SignUp"
    }
];
export const Header: React.FC = () => (
    <Paper elevation={1}>
        <Container>
            <MenuGrid leftMenu={LeftMenu} rightMenu={RightMenu} />
        </Container>
    </Paper>
);
