import { filter, map, Observable } from "rxjs";
import { ComposeFunction, connect } from "../../connect";
import { ProfilePageView, ViewProps } from "./ProfilePageView";
import { isNotUndefined } from "../../ts-utils";

type AccountInfo = {
    readonly username: string;
};

export function composeProfileStreams(
    accountInfo$: Observable<AccountInfo | undefined>
): ComposeFunction<{}, ViewProps> {
    return () => {
        const username$ = accountInfo$.pipe(
            filter(isNotUndefined),
            map(({ username }) => username)
        );
        return {
            props: {
                username: [username$, ""]
            },
            effects: []
        };
    };
}

type ProfileDefinition = {
    ProfilePageStreamComposer: ComposeFunction<{}, ViewProps>;
};

export const ProfilePage = connect<{}, ViewProps, ProfileDefinition>(
    ProfilePageView,
    "ProfilePageStreamComposer"
);
