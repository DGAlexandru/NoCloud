import {Route} from "react-router";
import {Navigate, Routes} from "react-router-dom";
import NoCloudOptions from "./NoCloudOptions";
import React from "react";
import ConnectivityOptionsRouter from "./ConnectivityOptionsRouter";
import MapManagementOptionsRouter from "./MapManagementOptionsRouter";
import RobotOptionsRouter from "./RobotOptionsRouter";

const OptionsRouter = (): React.ReactElement => {

    return (
        <Routes>
            <Route path={"map_management/*"} element={<MapManagementOptionsRouter />} />
            <Route path={"connectivity/*"} element={<ConnectivityOptionsRouter />} />
            <Route path={"robot/*"} element={<RobotOptionsRouter />} />

            <Route path={"NoCloud"} element={<NoCloudOptions />} />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default OptionsRouter;
