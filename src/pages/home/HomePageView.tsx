import React from "react";
import { Layout } from "../../components/Layout/Layout";

export type ViewProps = {};
export const HomePageView: React.FC<ViewProps> = () => (
    <Layout>
        <h1>HomePage</h1>
    </Layout>
);
