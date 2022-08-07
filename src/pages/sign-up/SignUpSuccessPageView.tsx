import { Box, Button } from "@mui/material";
import React from "react";
import { GeneralLayout } from "../../components/Layout/GeneralLayout";
import { ContentLayout } from "../../components/Layout/ContentLayout";
import { NavigateTo } from "../../routing/NavigatoTo/NavigateTo";
import { Route } from "../../routing/types";

export const SignUpSuccessPageView: React.FC = () => (
    <GeneralLayout>
        <ContentLayout>
            <Box color="green">
                <h1>You was successful registered! 👏</h1>
                <NavigateTo route={Route.SignIn}>
                    <Button>Sign In</Button>
                </NavigateTo>
            </Box>
        </ContentLayout>
    </GeneralLayout>
);
