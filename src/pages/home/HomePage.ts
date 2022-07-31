import { ComposeFunction, connect } from "../../connect";
import { HomePageView, ViewProps } from "./HomePageView";

export function composeHomePageStreams(): ComposeFunction<{}, ViewProps> {
    return () => ({
        props: {},
        effects: []
    });
}

export const HomePage = connect(HomePageView, "HomePage");
