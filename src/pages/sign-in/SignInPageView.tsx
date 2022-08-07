import React from "react";
import { GeneralLayout } from "../../components/Layout/GeneralLayout";
import { ContentLayout } from "../../components/Layout/ContentLayout";
import { LoginForm } from "./LoginForm/LoginForm";

export const SignInPageView: React.FC = () => (
    <GeneralLayout>
        <ContentLayout>
            <h1>SignIn</h1>
            <LoginForm />
        </ContentLayout>
    </GeneralLayout>
);
