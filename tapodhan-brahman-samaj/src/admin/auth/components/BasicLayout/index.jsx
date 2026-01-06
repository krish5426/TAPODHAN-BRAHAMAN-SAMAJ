import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import MDBox from "../../../components/MDBox";
import Footer from "../Footer";

// Removed DefaultNavbar and PageLayout to fix import errors and simplify Clean Admin Login
// The PageLayout was deleted, so we use MDBox as a container.

function BasicLayout({ image, children }) {
  return (
    <MDBox height="100%" width="100%" sx={{ overflowX: "hidden" }}>
      <MDBox
        position="absolute"
        width="100%"
        minHeight="100vh"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            image &&
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <MDBox px={1} width="100%" height="100vh" mx="auto">
        <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
            {children}
          </Grid>
        </Grid>
      </MDBox>
      <Footer light />
    </MDBox>
  );
}

BasicLayout.propTypes = {
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default BasicLayout;
