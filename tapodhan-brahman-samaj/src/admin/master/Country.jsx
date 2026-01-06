import PropTypes from "prop-types";
import Autocomplete from "@mui/material/Autocomplete";
import MDInput from "../components/MDInput";
import MDBox from "../components/MDBox";

function Country({ countries, selectedCountry, onCountryChange }) {
    const options = countries.map((c) => c.name);

    return (
        <MDBox mb={2}>
            <Autocomplete
                options={options}
                value={selectedCountry}
                onChange={(event, newValue) => onCountryChange(newValue)}
                renderInput={(params) => <MDInput {...params} label="Select Country" />}
            />
        </MDBox>
    );
}

Country.propTypes = {
    countries: PropTypes.array.isRequired,
    selectedCountry: PropTypes.string,
    onCountryChange: PropTypes.func.isRequired,
};

export default Country;
