import React, { ChangeEventHandler, ReactEventHandler } from "react";
import { Box, Button, TextField } from "@mui/material";

export type ViewProps = {
    readonly username: string;
    readonly password: string;
    readonly onUsernameUpdate: (username: string) => void;
    readonly onPasswordUpdate: (password: string) => void;
    readonly onSubmit: () => void;
    readonly error: string | undefined;
};

export const RegisterFormView: React.FC<ViewProps> = ({
    onSubmit,
    username,
    password,
    onPasswordUpdate,
    onUsernameUpdate,
    error
}) => {
    const onUsernameChange: ChangeEventHandler<HTMLInputElement> = e => {
        e.preventDefault();
        onUsernameUpdate(e.target.value);
    };

    const onPasswordChange: ChangeEventHandler<HTMLInputElement> = e => {
        e.preventDefault();
        onPasswordUpdate(e.target.value);
    };

    const onSubmitCallback: ReactEventHandler = e => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={onSubmit}>
            <Box display="flex" gap={1} flexDirection="column">
                {error && (
                    <Box color="red" padding="10px 0">
                        {error}
                    </Box>
                )}
                <TextField
                    required={true}
                    value={username}
                    label="Username"
                    onChange={onUsernameChange}
                    margin="dense"
                />

                <TextField
                    required={true}
                    value={password}
                    label="Password"
                    onChange={onPasswordChange}
                    margin="dense"
                />

                <Button type="button" variant="contained" onClick={onSubmitCallback}>
                    Register
                </Button>
            </Box>
        </form>
    );
};
