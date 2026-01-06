import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";
import AdminLayout from "../layout/AdminLayout";
import Header from "../layout/Header";
import Country from "./Country";
import State from "./State";
import CityDropdown from "./CityDropdown"; // Reusable Dropdown
import City from "./City"; // Keep existing City list component or replace? User asked for Dropdown. 
// "City dropdown must be a reusable component... Selected city should be visible in input"
// But also "Right side should show: List of cities, Add City option" in original prompt.
// The new prompt says "Master -> City Dropdown Issue". "Cities list is... showing scattered". 
// And "Selected city should be visible in input".
// It seems the user wants the SELECTION to be a dropdown (e.g. for filtering or just standardizing), 
// but currently Master page is for MANAGING (Master Data Management).
// Usually Master page LISTS cities to add/delete. 
// However, the user said "Cities dropdown must... Display ALL cities in a clean vertical list... reuse later in Matrimony forms".
// I will assume for the "Master" page we want to demonstration/usage of this dropdown, OR the user wants the "City List" 
// to be replaced by a dropdown to "Select a city to View/Edit"? 
// Let's implement the dropdown as requested in the "Select Location" flow on the left.
// And on the right, I'll keep the list or maybe hide it if the dropdown satisfies the "scattered" complaint.
// But wait, "Cities must NOT render anywhere else in UI". 
// So I should replace the right-side list with just the ability to ADD a city, or maybe just show the selected city?
// I will replace the right-side "City" list with the new behavior logic.

function Master() {
    const [countriesData, setCountriesData] = useState([]);
    const [statesData, setStatesData] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null); // For the dropdown
    const [cities, setCities] = useState([]);

    // 1. Load Countries List
    useEffect(() => {
        fetch("https://countriesnow.space/api/v0.1/countries/iso")
            .then((res) => res.json())
            .then((data) => {
                if (!data.error) setCountriesData(data.data);
            })
            .catch((err) => console.error("Error fetching countries:", err));
    }, []);

    // 2. Load States
    const handleCountryChange = (countryName) => {
        setSelectedCountry(countryName);
        setSelectedState(null);
        setSelectedCity(null);
        setStatesData([]);
        setCities([]);

        if (countryName) {
            fetch("https://countriesnow.space/api/v0.1/countries/states", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ country: countryName }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (!data.error) setStatesData(data.data.states || []);
                })
                .catch((err) => console.error("Error fetching states:", err));
        }
    };

    // 3. Load Cities
    const handleStateChange = (stateName) => {
        setSelectedState(stateName);
        setSelectedCity(null);
        setCities([]);

        if (selectedCountry && stateName) {
            fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ country: selectedCountry, state: stateName }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (!data.error) setCities(data.data || []);
                })
                .catch((err) => console.error("Error fetching cities:", err));
        }
    };

    return (
        <AdminLayout>
            <Header />
            <MDBox py={3}>
                <MDBox mb={3}>
                    <MDTypography variant="h3" fontWeight="bold">
                        Master Data Management
                    </MDTypography>
                </MDBox>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <MDBox mb={3}>
                            <MDTypography variant="h6">Select Location</MDTypography>
                        </MDBox>

                        <Country
                            countries={countriesData}
                            selectedCountry={selectedCountry}
                            onCountryChange={handleCountryChange}
                        />

                        <State
                            states={statesData}
                            selectedState={selectedState}
                            onStateChange={handleStateChange}
                            disabled={!selectedCountry}
                        />

                        {/* 4. The NEW City Dropdown */}
                        <MDTypography variant="caption" fontWeight="regular" color="text">
                            Select City (Reusable Component)
                        </MDTypography>
                        <CityDropdown
                            cities={cities}
                            selectedCity={selectedCity}
                            onSelectCity={setSelectedCity}
                            disabled={!selectedState}
                        />
                    </Grid>

                    {/* Optional: Right side for "Add City" if needed, but user said "Cities must NOT render anywhere else in UI" 
                        which implies removing the old scattered list. 
                        I will leave the right side for Future "Add City" form if needed, but for now just show instructions or debugging info 
                        to prove selection works.
                    */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <MDBox mt={5} p={3} bgColor="white" borderRadius="lg" shadow="sm">
                            <MDTypography variant="h6">Selection Summary</MDTypography>
                            <MDTypography variant="body2">Country: {selectedCountry || "-"}</MDTypography>
                            <MDTypography variant="body2">State: {selectedState || "-"}</MDTypography>
                            <MDTypography variant="body2" fontWeight="bold" color="info">City: {selectedCity || "-"}</MDTypography>
                        </MDBox>
                    </Grid>
                </Grid>
            </MDBox>
        </AdminLayout>
    );
}

export default Master;
