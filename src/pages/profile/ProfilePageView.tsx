import { Box } from "@mui/material";
import React from "react";
import { ContentLayout } from "../../components/Layout/ContentLayout";
import { GeneralLayout } from "../../components/Layout/GeneralLayout";

export type ViewProps = {
    readonly username: string;
};

export const ProfilePageView: React.FC<ViewProps> = ({ username }) => (
    <GeneralLayout>
        <ContentLayout>
            <h1>Profile</h1>

            <Box>
                <b>Username:</b> {username}
            </Box>
        </ContentLayout>
    </GeneralLayout>
);
