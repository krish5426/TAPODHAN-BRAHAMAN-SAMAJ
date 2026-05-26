import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";
import MDButton from "../components/MDButton";
import MDInput from "../components/MDInput";
import AdminCustomDialog from "../components/AdminCustomDialog";
import AdminLayout from "../layout/AdminLayout";
import Header from "../layout/Header";
import { updateAdminProfile, fetchAdminProfileById, API_URL } from "../services/api";

function EditProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [dialog, setDialog] = useState({ isOpen: false, message: '', type: 'success' });
    const fileInputRef = useRef(null);

    const loadProfile = async () => {
        try {
            const data = await fetchAdminProfileById(id);
            const safeData = {};
            if (data) {
                Object.keys(data).forEach(key => {
                    safeData[key] = data[key] === null || data[key] === undefined ? "" : data[key];
                });
                setFormData(safeData);
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (!['id', '_id', '__v', 'createdAt', 'updatedAt', 'images', 'userId', 'approvedBy', 'approvedAt'].includes(key)) {
                    let val = formData[key];
                    // Ensure date is in YYYY-MM-DD format
                    if (key === 'dateOfBirth' && val && val.includes('/')) {
                        const parts = val.split('/');
                        if (parts.length === 3) {
                            const [d, m, y] = parts;
                            val = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
                        }
                    }
                    data.append(key, val);
                }
            });
            if (profilePhoto) {
                data.append("profilePhoto", profilePhoto);
            }

            await updateAdminProfile(id, data);
            setDialog({ isOpen: true, message: 'Profile updated successfully!', type: 'success' });
        } catch (err) {
            setDialog({ isOpen: true, message: 'Update failed: ' + err.message, type: 'error' });
        }
    };

    const formatLabel = (key) => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
    };

    const getSelectOptions = (key) => {
        switch (key) {
            case 'gender': return ['Male', 'Female'];
            case 'status': return ['approved', 'pending', 'rejected'];
            case 'maritalStatus': return ['Unmarried', 'Married', 'Divorced', 'Widowed', 'Separated'];
            case 'profileFor': return ['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Friend', 'Relative'];
            case 'jobType': return ['Private Job', 'Govt. Job', 'Business', 'Self Employed', 'Not Working', 'Student', 'Household'];
            case 'physicalDisability': return ['No', 'Yes'];
            case 'glasses': return ['No', 'Yes'];
            case 'mangal': return ['Yes', 'No', 'Partial'];
            case 'familyType': return ['Joint', 'Nuclear'];
            case 'familyValues': return ['Traditional', 'Moderate', 'Liberal'];
            default: return [];
        }
    };

    const sections = [
        {
            title: "Personal Information",
            icon: "person",
            color: "#1976d2",
            fields: ['firstName', 'surname', 'fatherName', 'gender', 'dateOfBirth', 'timeOfBirth', 'birthPlace', 'profileFor', 'maritalStatus', 'noOfChildren']
        },
        {
            title: "Physical Details",
            icon: "straighten",
            color: "#9c27b0",
            fields: ['height', 'weight', 'physicalDisability', 'glasses', 'mangal']
        },
        {
            title: "Education & Career",
            icon: "school",
            color: "#ed6c02",
            fields: ['educationQualification', 'educationDetails', 'jobType', 'jobDescription', 'designation', 'currentLocation', 'incomeCurrency', 'monthlyIncome']
        },
        {
            title: "Family Details",
            icon: "family_restroom",
            color: "#2e7d32",
            fields: ['fatherFullName', 'motherFullName', 'fatherOccupation', 'motherOccupation', 'totalFamilyMembers', 'totalBrothers', 'totalSisters', 'marriedBrothers', 'marriedSisters', 'familyType', 'familyValues', 'familyLocation', 'nativePlace', 'familyWealth']
        },
        {
            title: "Contact Information",
            icon: "phone",
            color: "#0288d1",
            fields: ['contactPersonName', 'contactPersonRelation', 'contactPersonNumber', 'contactPersonEmail', 'contactPersonAddress']
        },
        {
            title: "Expectations",
            icon: "favorite",
            color: "#d32f2f",
            fields: ['expectation']
        },
        {
            title: "Status",
            icon: "verified",
            color: "#388e3c",
            fields: ['status']
        }
    ];

    const selectFields = ['gender', 'status', 'maritalStatus', 'profileFor', 'jobType', 'physicalDisability', 'glasses', 'mangal', 'familyType', 'familyValues'];
    const dateFields = ['dateOfBirth'];
    const textareaFields = ['expectation', 'educationDetails', 'jobDescription', 'contactPersonAddress'];

    const renderField = (key) => {
        if (!Object.prototype.hasOwnProperty.call(formData, key)) return null;

        const value = formData[key] || "";
        const label = formatLabel(key);
        const isSelect = selectFields.includes(key);
        const isDate = dateFields.includes(key);
        const isTextarea = textareaFields.includes(key);

        const mdSize = isTextarea ? 12 : 6;

        let displayValue = value;
        if (isDate && value) {
            try {
                displayValue = new Date(value).toISOString().split('T')[0];
            } catch { /* keep original */ }
        }

        if (isSelect) {
            const options = getSelectOptions(key);
            const finalOptions = [...options];
            if (value && !finalOptions.includes(value)) {
                finalOptions.push(value);
            }
            return (
                <Grid item xs={12} sm={6} md={mdSize} key={key}>
                    <MDInput
                        fullWidth
                        select
                        label={label}
                        name={key}
                        value={displayValue}
                        onChange={handleChange}
                        type="text"
                        InputLabelProps={{ shrink: true }}
                        SelectProps={{ sx: { padding: '11px' } }}
                    >
                        {finalOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </MDInput>
                </Grid>
            );
        }

        return (
            <Grid item xs={12} sm={6} md={mdSize} key={key}>
                <MDInput
                    fullWidth
                    label={label}
                    name={key}
                    value={displayValue}
                    onChange={handleChange}
                    type={isDate ? 'date' : 'text'}
                    InputLabelProps={{ shrink: true }}
                    multiline={isTextarea}
                    rows={isTextarea ? 3 : undefined}
                />
            </Grid>
        );
    };

    if (loading) {
        return (
            <AdminLayout>
                <Header />
                <MDBox p={6} display="flex" justifyContent="center" alignItems="center">
                    <MDTypography variant="h6" color="text">Loading profile...</MDTypography>
                </MDBox>
            </AdminLayout>
        );
    }

    const currentPhoto = photoPreview || (formData.profilePhoto ? `${API_URL}/uploads/profile/${formData.profilePhoto}` : null);

    return (
        <AdminLayout>
            <Header />
            <MDBox py={3}>
                {/* Profile Header Card */}
                <Card sx={{ mb: 3, overflow: "visible" }}>
                    <MDBox
                        sx={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            borderRadius: "12px 12px 0 0",
                            p: 3,
                            pb: 8
                        }}
                    />
                    <MDBox px={3} sx={{ mt: -6 }}>
                        <MDBox display="flex" alignItems="flex-end" gap={2} flexWrap="wrap">
                            {/* Profile Photo */}
                            <MDBox
                                sx={{
                                    position: "relative",
                                    width: 110,
                                    height: 110,
                                    borderRadius: "50%",
                                    border: "4px solid #fff",
                                    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                                    overflow: "hidden",
                                    backgroundColor: "#f5f5f5",
                                    cursor: "pointer",
                                    "&:hover .photo-overlay": { opacity: 1 }
                                }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {currentPhoto ? (
                                    <MDBox
                                        component="img"
                                        src={currentPhoto}
                                        alt="Profile"
                                        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                ) : (
                                    <MDBox display="flex" alignItems="center" justifyContent="center" height="100%">
                                        <Icon sx={{ fontSize: 40, color: "#bbb" }}>person</Icon>
                                    </MDBox>
                                )}
                                <MDBox
                                    className="photo-overlay"
                                    sx={{
                                        position: "absolute",
                                        top: 0, left: 0, right: 0, bottom: 0,
                                        backgroundColor: "rgba(0,0,0,0.5)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        opacity: 0,
                                        transition: "opacity 0.2s"
                                    }}
                                >
                                    <Icon sx={{ color: "#fff", fontSize: 28 }}>camera_alt</Icon>
                                </MDBox>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    hidden
                                    onChange={handlePhotoChange}
                                    accept="image/jpeg,image/png,image/webp"
                                />
                            </MDBox>

                            {/* Name & Info */}
                            <MDBox pb={1}>
                                <MDTypography variant="h4" fontWeight="bold">
                                    {formData.firstName} {formData.surname}
                                </MDTypography>
                                <MDTypography variant="body2" color="text" sx={{ opacity: 0.8 }}>
                                    {formData.gender}{formData.maritalStatus ? ` • ${formData.maritalStatus}` : ""}{formData.currentLocation ? ` • ${formData.currentLocation}` : ""}
                                </MDTypography>
                            </MDBox>

                            {/* Actions */}
                            <MDBox ml="auto" pb={1} display="flex" gap={1}>
                                <MDButton variant="outlined" color="dark" size="small" onClick={() => navigate(-1)}>
                                    <Icon>arrow_back</Icon>&nbsp;Back
                                </MDButton>
                            </MDBox>
                        </MDBox>
                    </MDBox>
                    <MDBox px={3} pb={2} pt={1}>
                        <MDTypography variant="caption" color="text">
                            Click on the profile photo to change it
                        </MDTypography>
                    </MDBox>
                </Card>

                {/* Form Sections */}
                {sections.map((section, idx) => (
                    <Card key={idx} sx={{ p: 0, mb: 2, overflow: "hidden" }}>
                        <MDBox
                            px={3} py={1.5}
                            display="flex"
                            alignItems="center"
                            gap={1}
                            sx={{ backgroundColor: "#fafafa", borderBottom: "1px solid #eee" }}
                        >
                            <Icon sx={{ color: section.color, fontSize: 22 }}>{section.icon}</Icon>
                            <MDTypography variant="h6" fontWeight="bold" sx={{ color: section.color }}>
                                {section.title}
                            </MDTypography>
                        </MDBox>
                        <MDBox p={3}>
                            <Grid container spacing={3}>
                                {section.fields.map(key => renderField(key))}
                            </Grid>
                        </MDBox>
                    </Card>
                ))}

                {/* Save Actions */}
                <Card sx={{ p: 2, position: "sticky", bottom: 16, zIndex: 10 }}>
                    <MDBox display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                        <MDTypography variant="caption" color="text" sx={{ mr: "auto" }}>
                            Make sure all details are correct before saving.
                        </MDTypography>
                        <MDButton variant="outlined" color="dark" onClick={() => navigate(-1)}>
                            Cancel
                        </MDButton>
                        <MDButton variant="gradient" color="info" onClick={handleSave}>
                            <Icon>save</Icon>&nbsp;Save Changes
                        </MDButton>
                    </MDBox>
                </Card>
            </MDBox>

            <AdminCustomDialog
                isOpen={dialog.isOpen}
                message={dialog.message}
                type={dialog.type}
                onClose={() => {
                    setDialog({ isOpen: false, message: '', type: 'success' });
                    if (dialog.type === 'success') {
                        navigate(-1);
                    }
                }}
            />
        </AdminLayout>
    );
}

export default EditProfile;
