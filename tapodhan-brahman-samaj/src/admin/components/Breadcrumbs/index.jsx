/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router-dom components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "../MDBox";
import MDTypography from "../MDTypography";

function Breadcrumbs({ icon, title, route, light }) {
  const routes = route.slice(0, -1);

  // Build cumulative paths for breadcrumb links
  const buildPath = (index) => {
    return "/" + route.slice(0, index + 1).join("/");
  };

  // Map certain route segments to better destinations
  const getLink = (el, index) => {
    const path = buildPath(index);
    // If the segment is "matrimony", link to brides list
    if (el === "matrimony") return "/admin/matrimony/brides";
    // If the segment is "business", link to business list
    if (el === "business") return "/admin/business";
    // If it's a number (ID) or "edit"/"view", don't make it a link
    if (!isNaN(el) || el === "edit" || el === "view") return null;
    return path;
  };

  return (
    <MDBox mr={{ xs: 0, xl: 8 }}>
      <MuiBreadcrumbs
        sx={{
          "& .MuiBreadcrumbs-separator": {
            color: ({ palette: { white, grey } }) => (light ? white.main : grey[600]),
          },
        }}
      >
        <Link to="/admin/dashboard">
          <MDTypography
            component="span"
            variant="body2"
            color={light ? "white" : "dark"}
            opacity={light ? 0.8 : 0.5}
            sx={{ lineHeight: 0 }}
          >
            <Icon>{icon}</Icon>
          </MDTypography>
        </Link>
        {routes.map((el, index) => {
          const link = getLink(el, index);
          if (link) {
            return (
              <Link to={link} key={el}>
                <MDTypography
                  component="span"
                  variant="button"
                  fontWeight="regular"
                  textTransform="capitalize"
                  color={light ? "white" : "dark"}
                  opacity={light ? 0.8 : 0.5}
                  sx={{ lineHeight: 0 }}
                >
                  {el}
                </MDTypography>
              </Link>
            );
          }
          return (
            <MDTypography
              key={el}
              component="span"
              variant="button"
              fontWeight="regular"
              textTransform="capitalize"
              color={light ? "white" : "dark"}
              opacity={light ? 0.5 : 0.3}
              sx={{ lineHeight: 0 }}
            >
              {el}
            </MDTypography>
          );
        })}
        <MDTypography
          variant="button"
          fontWeight="regular"
          textTransform="capitalize"
          color={light ? "white" : "dark"}
          sx={{ lineHeight: 0 }}
        >
          {title.replace("-", " ")}
        </MDTypography>
      </MuiBreadcrumbs>
      <MDTypography
        fontWeight="bold"
        textTransform="capitalize"
        variant="h6"
        color={light ? "white" : "dark"}
        noWrap
      >
        {title.replace("-", " ")}
      </MDTypography>
    </MDBox>
  );
}

// Setting default values for the props of Breadcrumbs
Breadcrumbs.defaultProps = {
  light: false,
};

// Typechecking props for the Breadcrumbs
Breadcrumbs.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  route: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  light: PropTypes.bool,
};

export default Breadcrumbs;
