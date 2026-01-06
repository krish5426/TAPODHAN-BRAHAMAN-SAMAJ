import { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";
import SidenavRoot from "../components/Sidenav/SidenavRoot";
import sidenavLogoLabel from "../components/Sidenav/styles/sidenav";
import { useMaterialUIController, setMiniSidenav, setTransparentSidenav, setWhiteSidenav } from "../context";

// Styles from SidenavCollapse
import { collapseItem, collapseIconBox, collapseIcon, collapseText } from "../components/Sidenav/styles/sidenavCollapse";

function Sidebar({ brand, brandName, ...rest }) {
    const [controller, dispatch] = useMaterialUIController();
    const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
    const location = useLocation();
    const { pathname } = location;

    const [openMatrimony, setOpenMatrimony] = useState(false);

    // Close sidenav on mobile
    const closeSidenav = () => setMiniSidenav(dispatch, true);

    useEffect(() => {
        function handleMiniSidenav() {
            setMiniSidenav(dispatch, window.innerWidth < 1200);
            setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
            setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
        }
        window.addEventListener("resize", handleMiniSidenav);
        handleMiniSidenav();
        return () => window.removeEventListener("resize", handleMiniSidenav);
    }, [dispatch, location]);

    // Check active state
    const isActive = (route) => pathname.includes(route);

    // Helper to render Item
    const SidebarItem = ({ name, icon, route, onClick, hasCollapse, isOpen }) => {
        return (
            <ListItem component="li">
                <MDBox
                    component={route ? NavLink : "div"}
                    to={route}
                    onClick={onClick}
                    sx={(theme) =>
                        collapseItem(theme, {
                            active: route ? isActive(route) : false,
                            transparentSidenav,
                            whiteSidenav,
                            darkMode,
                            sidenavColor,
                        })
                    }
                >
                    <ListItemIcon
                        sx={(theme) =>
                            collapseIconBox(theme, { transparentSidenav, whiteSidenav, darkMode, active: route ? isActive(route) : false })
                        }
                    >
                        <Icon sx={(theme) => collapseIcon(theme, { active: route ? isActive(route) : false })}>{icon}</Icon>
                    </ListItemIcon>

                    <ListItemText
                        primary={name}
                        sx={(theme) =>
                            collapseText(theme, {
                                miniSidenav,
                                transparentSidenav,
                                whiteSidenav,
                                active: route ? isActive(route) : false,
                            })
                        }
                    />
                    {hasCollapse && (
                        <Icon sx={{ fontWeight: "bold", ml: -2 }}>{isOpen ? "expand_less" : "expand_more"}</Icon>
                    )}
                </MDBox>
            </ListItem>
        );
    };

    let textColor = "white";
    if (transparentSidenav || (whiteSidenav && !darkMode)) {
        textColor = "dark";
    } else if (whiteSidenav && darkMode) {
        textColor = "inherit";
    }

    return (
        <SidenavRoot
            {...rest}
            variant="permanent"
            ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
        >
            <MDBox pt={3} pb={1} px={4} textAlign="center">
                <MDBox
                    display={{ xs: "block", xl: "none" }}
                    position="absolute"
                    top={0}
                    right={0}
                    p={1.625}
                    onClick={closeSidenav}
                    sx={{ cursor: "pointer" }}
                >
                    <MDTypography variant="h6" color="secondary">
                        <Icon sx={{ fontWeight: "bold" }}>close</Icon>
                    </MDTypography>
                </MDBox>
                <MDBox component={NavLink} to="/admin/dashboard" display="flex" alignItems="center">
                    {brand && <MDBox component="img" src={brand} alt="Brand" width="2rem" />}
                    <MDBox
                        width={!brandName && "100%"}
                        sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
                    >
                        <MDTypography component="h6" variant="button" fontWeight="medium" color={textColor}>
                            {brandName}
                        </MDTypography>
                    </MDBox>
                </MDBox>
            </MDBox>
            <Divider />

            <List>
                <SidebarItem name="Dashboard" icon="dashboard" route="/admin/dashboard" />

                {/* Matrimony - Collapsible */}
                <SidebarItem
                    name="Matrimony"
                    icon="favorite"
                    onClick={() => setOpenMatrimony(!openMatrimony)}
                    hasCollapse={true}
                    isOpen={openMatrimony}
                />
                <Collapse in={openMatrimony} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 2 }}>
                        <SidebarItem name="Brides" icon="woman" route="/admin/matrimony/brides" />
                        <SidebarItem name="Grooms" icon="man" route="/admin/matrimony/grooms" />
                    </List>
                </Collapse>

                <SidebarItem name="Business" icon="business" route="/admin/business" />
                <SidebarItem name="Events" icon="event" route="/admin/events" />
                <SidebarItem name="Master" icon="settings" route="/admin/master" />

            </List>
        </SidenavRoot>
    );
}

Sidebar.defaultProps = {
    brand: "",
};

Sidebar.propTypes = {
    brand: PropTypes.string,
    brandName: PropTypes.string.isRequired,
};

export default Sidebar;
