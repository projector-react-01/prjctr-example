import React from "react";
import { GeneralLayout } from "../../components/Layout/GeneralLayout";
import { ContentLayout } from "../../components/Layout/ContentLayout";

export type ViewProps = {};
export const HomePageView: React.FC<ViewProps> = () => (
    <GeneralLayout>
        <ContentLayout>
            <h1>HomePage</h1>
        </ContentLayout>
    </GeneralLayout>
);
