import PropTypes from "prop-types";
import Autocomplete from "@mui/material/Autocomplete";
import MDInput from "../components/MDInput";
import MDBox from "../components/MDBox";

function CityDropdown({ cities, selectedCity, onSelectCity, disabled }) {
    return (
        <MDBox mb={2}>
            <Autocomplete
                options={cities}
                value={selectedCity}
                onChange={(event, newValue) => onSelectCity(newValue)}
                disabled={disabled}
                renderInput={(params) => (
                    <MDInput
                        {...params}
                        label="Select City"
                        variant="outlined"
                        fullWidth
                    />
                )}
                // Ensure proper dropdown behavior
                disablePortal={false}
                id="city-dropdown"
                noOptionsText="No cities available"
            />
        </MDBox>
    );
}

CityDropdown.propTypes = {
    cities: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedCity: PropTypes.string,
    onSelectCity: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default CityDropdown;
