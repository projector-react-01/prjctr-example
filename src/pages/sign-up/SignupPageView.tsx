import React from "react";
import { GeneralLayout } from "../../components/Layout/GeneralLayout";
import { RegisterForm } from "./RegisterForm/RegisterForm";
import { ContentLayout } from "../../components/Layout/ContentLayout";

export const SignupPageView: React.FC = () => (
    <GeneralLayout>
        <ContentLayout>
            <h1>SignUp</h1>
            <RegisterForm />
        </ContentLayout>
    </GeneralLayout>
);
