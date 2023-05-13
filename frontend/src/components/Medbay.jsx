import React from "react";
import Medicine from "../components/Medicine";
import Doses from "../components/Doses";

export default function Dashboard() {
    return (
        <React.Fragment>
            <Medicine />
            <Doses />
        </React.Fragment>
    );
}
