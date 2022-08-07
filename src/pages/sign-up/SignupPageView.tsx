import React from "react";
import { Layout } from "../../components/Layout/Layout";
import { RegisterForm } from "./RegisterForm/RegisterForm";

export const SignupPageView: React.FC = () => (
    <Layout>
        <h1>SignUp</h1>
        <RegisterForm />
    </Layout>
);
