import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";
import MDButton from "../components/MDButton";
import MDInput from "../components/MDInput"; // For adding city
import { useState } from "react";

function City({ cities, onAddCity }) {
    const [newCity, setNewCity] = useState("");

    const handleAdd = () => {
        if (newCity.trim()) {
            onAddCity(newCity);
            setNewCity("");
        }
    };

    return (
        <Card sx={{ height: "100%" }}>
            <MDBox p={2}>
                <MDTypography variant="h6" fontWeight="medium">
                    Cities List
                </MDTypography>
                <MDBox display="flex" gap={2} my={2}>
                    <MDInput
                        label="New City Name"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        fullWidth
                    />
                    <MDButton variant="gradient" color="info" onClick={handleAdd}>
                        Add
                    </MDButton>
                </MDBox>
                <MDBox sx={{ maxHeight: "400px", overflowY: "auto" }}>
                    {cities.length === 0 ? (
                        <MDTypography variant="button" color="text">No cities found.</MDTypography>
                    ) : (
                        <Grid container spacing={1}>
                            {cities.map((city, index) => (
                                <Grid item key={index} xs={12}>
                                    <MDBox p={1} borderBottom="1px solid #f0f2f5" display="flex" alignItems="center">
                                        <Icon fontSize="small" sx={{ mr: 1 }}>location_city</Icon>
                                        <MDTypography variant="button" fontWeight="regular">{city}</MDTypography>
                                    </MDBox>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </MDBox>
            </MDBox>
        </Card>
    );
}

City.propTypes = {
    cities: PropTypes.array.isRequired,
    onAddCity: PropTypes.func.isRequired,
};

export default City;
