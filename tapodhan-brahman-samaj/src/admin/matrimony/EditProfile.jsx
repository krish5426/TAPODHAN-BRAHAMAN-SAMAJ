import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";
import MDButton from "../components/MDButton";
import MDInput from "../components/MDInput";
import AdminLayout from "../layout/AdminLayout";
import Header from "../layout/Header";
import { updateAdminProfile, fetchAdminProfileById } from "../services/api";

function EditProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const [images, setImages] = useState({ existing: [], new: [], previews: [] });

    useEffect(() => {
        loadProfile();
    }, [id]);

    const loadProfile = async () => {
        try {
            const data = await fetchAdminProfileById(id);
            // Sanitize data: ensure no nulls/undefined for controlled inputs
            const safeData = {};
            if (data) {
                Object.keys(data).forEach(key => {
                    safeData[key] = data[key] === null || data[key] === undefined ? "" : data[key];
                });
                setFormData(safeData);
                setImages(prev => ({ ...prev, existing: data.images || [] }));
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImages(prev => ({
            ...prev,
            new: [...prev.new, ...files],
            previews: [...prev.previews, ...newPreviews]
        }));
    };

    const handleSave = async () => {
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (!['_id', '__v', 'createdAt', 'updatedAt', 'images'].includes(key)) {
                    data.append(key, formData[key]);
                }
            });
            images.new.forEach(file => data.append("images", file));

            await updateAdminProfile(id, data);
            alert("Profile Updated!");
            navigate(-1);
        } catch (err) {
            alert("Update failed");
        }
    };

    const formatLabel = (key) => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
    };

    const getFieldType = (key, value) => {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('date') || lowerKey === 'dob') return 'date';
        if (typeof value === 'boolean') return 'checkbox';
        if (['gender', 'status', 'maritalStatus', 'profileFor', 'jobType', 'educationQualification'].includes(key)) return 'select';
        return 'text';
    };

    const getSelectOptions = (key) => {
        switch (key) {
            case 'gender': return ['Male', 'Female'];
            case 'status': return ['approved', 'pending', 'rejected'];
            case 'maritalStatus': return ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'];
            case 'profileFor': return ['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Friend', 'Relative'];
            case 'jobType': return ['Private', 'Government', 'Business', 'Self Employed', 'Not Working'];
            case 'educationQualification': return ['High School', 'Bachelor', 'Master', 'PhD', 'Diploma', 'Other'];
            default: return [];
        }
    };

    const renderField = (key) => {
        if (['_id', '__v', 'createdAt', 'updatedAt', 'images', 'id'].includes(key)) return null;

        const value = formData[key];
        const type = getFieldType(key, value);
        const label = formatLabel(key);

        if (type === 'checkbox') {
            return (
                <Grid item xs={12} md={4} key={key}>
                    <MDBox display="flex" alignItems="center" height="100%" pl={1}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={Boolean(value)}
                                    onChange={handleChange}
                                    name={key}
                                />
                            }
                            label={label}
                        />
                    </MDBox>
                </Grid>
            );
        }

        let displayValue = value;
        if (type === 'date' && value) {
            try {
                // Ensure date string is in YYYY-MM-DD
                displayValue = new Date(value).toISOString().split('T')[0];
            } catch (e) {
                // keep original if parsing fails
            }
        }

        const isSelect = type === 'select';
        const options = isSelect ? getSelectOptions(key) : [];

        // If the current value is NOT in the predefined options, add it temporarily so it shows up
        const finalOptions = [...options];
        if (isSelect && value && !finalOptions.includes(value)) {
            finalOptions.push(value);
        }

        return (
            <Grid item xs={12} md={4} key={key}>
                <MDInput
                    fullWidth
                    select={isSelect}
                    label={label}
                    name={key}
                    value={displayValue}
                    onChange={handleChange}
                    type={isSelect ? 'text' : (type === 'date' ? 'date' : 'text')}
                    InputLabelProps={type === 'date' ? { shrink: true } : {}}
                    multiline={!isSelect && typeof value === 'string' && value.length > 60}
                >
                    {isSelect && finalOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </MDInput>
            </Grid>
        );
    };

    if (loading) return <MDBox p={3}><MDTypography>Loading...</MDTypography></MDBox>;

    return (
        <AdminLayout>
            <Header />
            <MDBox py={3}>
                <Card sx={{ p: 3 }}>
                    <MDTypography variant="h4" mb={2}>Edit Profile</MDTypography>
                    <Grid container spacing={2}>
                        {Object.keys(formData).map(key => renderField(key))}
                    </Grid>

                    <MDBox mt={3}>
                        <MDTypography variant="button" fontWeight="bold">Images</MDTypography>
                        <MDBox display="flex" gap={2} flexWrap="wrap" my={2}>
                            {/* Existing Images */}
                            {images.existing.map((img, index) => (
                                <MDBox key={`existing-${index}`} component="img" src={img} alt="profile" width={100} height={100} sx={{ objectFit: "cover", borderRadius: "8px" }} />
                            ))}
                            {/* New Previews */}
                            {images.previews.map((img, index) => (
                                <MDBox key={`new-${index}`} component="img" src={img} alt="preview" width={100} height={100} sx={{ objectFit: "cover", borderRadius: "8px", border: "2px solid green" }} />
                            ))}
                        </MDBox>
                        <input type="file" multiple onChange={handleImageChange} accept="image/*" />
                    </MDBox>

                    <MDBox mt={3}>
                        <MDButton variant="gradient" color="info" onClick={handleSave}>Save Changes</MDButton>
                    </MDBox>
                </Card>
            </MDBox>
        </AdminLayout>
    );
}

export default EditProfile;
