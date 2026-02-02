import "regenerator-runtime/runtime";
import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import MDBox from "./components/MDBox";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
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

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("admin_token");
    const location = useLocation();

    if (!token) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
};

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem("admin_token");

    if (token) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
};

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
                const relativePath = route.route.replace(/^\/admin\//, "");

                // Allow public access only to login
                if (route.key === "sign-in") {
                    return (
                        <Route
                            exact
                            path={relativePath}
                            element={<PublicRoute>{route.component}</PublicRoute>}
                            key={route.key}
                        />
                    );
                }

                return (
                    <Route
                        exact
                        path={relativePath}
                        element={<ProtectedRoute>{route.component}</ProtectedRoute>}
                        key={route.key}
                    />
                );
            }

            return null;
        });

    const configsButton = (
        <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="3.5rem"
            height="3.5rem"
            shadow="lg"
            borderRadius="50%"
            position="fixed"
            right={{ xs: "1rem", sm: "1.5rem", md: "2rem" }}
            bottom={{ xs: "1rem", sm: "1.5rem", md: "2rem" }}
            zIndex={120}
            sx={{
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: openConfigurator
                    ? "linear-gradient(135deg, rgba(44,62,80,1) 0%, rgba(32,45,60,1) 100%)"
                    : "linear-gradient(135deg, rgba(74,144,226,1) 0%, rgba(114,181,255,1) 100%)",
                color: "white",
                boxShadow: openConfigurator ? "0 12px 30px rgba(0,0,0,0.18)" : undefined,
            }}
            onClick={handleConfiguratorOpen}
            aria-label={openConfigurator ? "close-configurator" : "open-configurator"}
            title={openConfigurator ? "Close Configurator" : "Open Configurator"}
        >
{openConfigurator ? <CloseIcon sx={{ fontSize: "24px" }} /> : <SettingsIcon sx={{ fontSize: "24px" }} />}
        </MDBox>
    );

    // Check if we are on the login page to decide layout rendering
    const isLoginPage = pathname.indexOf("/admin/login") !== -1;

    return direction === "rtl" ? (
        <CacheProvider value={rtlCache}>
            <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
                <CssBaseline />
                {layout === "dashboard" && !isLoginPage && (
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
                    <Route path="/" element={<Navigate to="/admin/dashboard" />} />
                    <Route path="*" element={<Navigate to="/admin/dashboard" />} />
                </Routes>
            </ThemeProvider>
        </CacheProvider>
    ) : (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
            <CssBaseline />
            {layout === "dashboard" && !isLoginPage && (
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
                <Route path="/" element={<Navigate to="/admin/dashboard" />} />
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
