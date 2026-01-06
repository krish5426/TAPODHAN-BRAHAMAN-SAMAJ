import "regenerator-runtime/runtime";
import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import MDBox from "./components/MDBox";
import Sidebar from "./layout/Sidebar"; // New Sidebar
import Configurator from "./components/Configurator";
import theme from "./assets/theme";
import themeRTL from "./assets/theme/theme-rtl";
import themeDark from "./assets/theme-dark";
import themeDarkRTL from "./assets/theme-dark/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import routes from "./routes/routes";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator, MaterialUIControllerProvider } from "./context";
import brandWhite from "./assets/images/logo-ct.png";
import brandDark from "./assets/images/logo-ct-dark.png";

function AdminAppContent() {
    const [controller, dispatch] = useMaterialUIController();
    const {
        miniSidenav,
        direction,
        layout,
        openConfigurator,
        sidenavColor,
        transparentSidenav,
        whiteSidenav,
        darkMode,
    } = controller;
    const [onMouseEnter, setOnMouseEnter] = useState(false);
    const [rtlCache, setRtlCache] = useState(null);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    // Authenticated Check
    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        // Block all routes if not authenticated, except login
        if (!token && !pathname.includes("/admin/login")) {
            // If trying to access anything else, redirect to login
            // Note: pathname might be partial match, so just check if not login
            navigate("/admin/login");
        }
    }, [pathname, navigate]);

    useMemo(() => {
        const cacheRtl = createCache({
            key: "rtl",
            stylisPlugins: [rtlPlugin],
        });

        setRtlCache(cacheRtl);
    }, []);

    const handleOnMouseEnter = () => {
        if (miniSidenav && !onMouseEnter) {
            setMiniSidenav(dispatch, false);
            setOnMouseEnter(true);
        }
    };

    const handleOnMouseLeave = () => {
        if (onMouseEnter) {
            setMiniSidenav(dispatch, true);
            setOnMouseEnter(false);
        }
    };

    const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

    useEffect(() => {
        document.body.setAttribute("dir", direction);
    }, [direction]);

    useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
    }, [pathname]);

    const getRoutes = (allRoutes) =>
        allRoutes.map((route) => {
            if (route.collapse) {
                return getRoutes(route.collapse);
            }

            if (route.route) {
                // Strip the absolute /admin prefix if present for proper relative routing within AdminApp (path relative to /admin/* ? No, Routes here are usually relative if under a nested Router, but here AdminApp is likely top level or under /admin basename?)
                // Looking at routes.js, paths are /admin/dashboard.
                // Looking at AdminApp usage in main App, it seems mapped to /admin/*.
                // Original code: const relativePath = route.route.replace(/^\/admin\//, "");
                // So I will keep that logic.
                const relativePath = route.route.replace(/^\/admin\//, "");
                return <Route exact path={relativePath} element={route.component} key={route.key} />;
            }

            return null;
        });

    const configsButton = (
        <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="3.25rem"
            height="3.25rem"
            bgColor="white"
            shadow="sm"
            borderRadius="50%"
            position="fixed"
            right="2rem"
            bottom="2rem"
            zIndex={99}
            color="dark"
            sx={{ cursor: "pointer" }}
            onClick={handleConfiguratorOpen}
        >
            <Icon fontSize="small" color="inherit">
                settings
            </Icon>
        </MDBox>
    );

    return direction === "rtl" ? (
        <CacheProvider value={rtlCache}>
            <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
                <CssBaseline />
                {layout === "dashboard" && (
                    <>
                        <Sidebar
                            color={sidenavColor}
                            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                            brandName="Admin Panel"
                            onMouseEnter={handleOnMouseEnter}
                            onMouseLeave={handleOnMouseLeave}
                        />
                        <Configurator />
                        {configsButton}
                    </>
                )}
                {layout === "vr" && <Configurator />}
                <Routes>
                    {getRoutes(routes)}
                    <Route path="*" element={<Navigate to="dashboard" />} />
                </Routes>
            </ThemeProvider>
        </CacheProvider>
    ) : (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
            <CssBaseline />
            {layout === "dashboard" && (
                <>
                    <Sidebar
                        color={sidenavColor}
                        brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                        brandName="Admin Panel"
                        onMouseEnter={handleOnMouseEnter}
                        onMouseLeave={handleOnMouseLeave}
                    />
                    <Configurator />
                    {configsButton}
                </>
            )}
            {layout === "vr" && <Configurator />}
            <Routes>
                {getRoutes(routes)}
                <Route path="*" element={<Navigate to="/admin/dashboard" />} />
            </Routes>
        </ThemeProvider>
    );
}

export default function AdminApp() {
    return (
        <MaterialUIControllerProvider>
            <AdminAppContent />
        </MaterialUIControllerProvider>
    );
}
