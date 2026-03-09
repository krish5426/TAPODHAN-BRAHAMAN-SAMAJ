import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";
import MDButton from "../components/MDButton";
import MDInput from "../components/MDInput";
import AdminCustomDialog from "../components/AdminCustomDialog";
import AdminLayout from "../layout/AdminLayout";
import Header from "../layout/Header";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { fetchAdminBusinessById, updateAdminBusiness, API_URL } from "../services/api";
import { MenuItem } from "@mui/material";
import { INDUSTRY_OPTIONS } from "../../config/constants";

function EditBusiness() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const [poster, setPoster] = useState(null); // New file
    const [posterPreview, setPosterPreview] = useState(null);
    const [dialog, setDialog] = useState({ isOpen: false, message: '', type: 'success' });

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchAdminBusinessById(id);
                setFormData(data);
                if (data.posterPhoto) {
                    setPosterPreview(`${API_URL}${data.posterPhoto}`);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setDialog({ isOpen: true, message: 'Failed to load business', type: 'error' });
            }
        };
        loadData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPoster(file);
            setPosterPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        try {
            const data = new FormData();
            data.append("businessName", formData.businessName);
            data.append("ownerName", formData.ownerName);
            data.append("email", formData.email);
            data.append("contactNumber", formData.contactNumber);
            data.append("address", formData.address);
            data.append("status", formData.status);
            data.append("category", formData.category);
            data.append("businessType", formData.businessType);
            data.append("description", formData.description);
            data.append("website", formData.website);
            data.append("city", formData.city);
            data.append("state", formData.state);

            if (poster) {
                data.append("posterPhoto", poster);
            }

            await updateAdminBusiness(id, data);
            setDialog({ isOpen: true, message: 'Business Updated!', type: 'success' });
        } catch (err) {
            setDialog({ isOpen: true, message: 'Update failed', type: 'error' });
        }
    };

    return (
        <AdminLayout>
            <Header title="Edit Business" />
            <MDBox py={{ xs: 2, md: 3 }}>
                <Card sx={{ p: { xs: 1.5, md: 3 }, maxWidth: 800, mx: "auto" }}>
                    <MDTypography variant="h5" mb={2} sx={{ fontWeight: 700 }}>Edit Business</MDTypography>
                    <MDBox display="flex" flexDirection="column" gap={{ xs: 2, md: 3 }}>
                        <MDInput fullWidth label="Business Name" name="businessName" value={formData.businessName || ""} onChange={handleChange} />
                        <MDInput fullWidth label="Owner Name" name="ownerName" value={formData.ownerName || ""} onChange={handleChange} />
                        <MDInput fullWidth label="Status (approved/pending/rejected)" name="status" value={formData.status || ""} onChange={handleChange} />
                        <MDInput fullWidth label="Email" name="email" value={formData.email || ""} onChange={handleChange} />
                        <MDInput fullWidth label="Contact Number" name="contactNumber" value={formData.contactNumber || ""} onChange={handleChange} />
                        <MDInput fullWidth label="Website" name="website" value={formData.website || ""} onChange={handleChange} />
                        <MDInput
                            select
                            label="Industry"
                            name="category"
                            value={formData.category || ""}
                            onChange={handleChange}
                            fullWidth
                            type="text"
                            InputLabelProps={{ shrink: true }}
                            SelectProps={{ sx: { padding: '11px' } }}
                        >
                            <MenuItem value="">Select Industry</MenuItem>
                            {INDUSTRY_OPTIONS.map((industry) => (
                                <MenuItem key={industry} value={industry}>{industry}</MenuItem>
                            ))}
                        </MDInput>
                        <MDInput fullWidth label="Business Type" name="businessType" value={formData.businessType || ""} onChange={handleChange} />
                        <MDInput fullWidth label="City" name="city" value={formData.city || ""} onChange={handleChange} />
                        <MDInput fullWidth label="State" name="state" value={formData.state || ""} onChange={handleChange} />
                        <MDInput fullWidth multiline rows={3} label="Description" name="description" value={formData.description || ""} onChange={handleChange} />
                        <MDInput fullWidth multiline rows={3} label="Address" name="address" value={formData.address || ""} onChange={handleChange} />
                    </MDBox>

                    <MDBox mt={3}>
                        <MDTypography variant="button" display="block" mb={1}>Poster Photo</MDTypography>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            id="poster-upload-edit"
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="poster-upload-edit" style={{ width: '100%', display: 'block' }}>
                            <MDButton
                                variant="outlined"
                                color="dark"
                                component="span"
                                fullWidth
                                sx={{
                                    py: 1.5,
                                    borderStyle: 'dashed',
                                    borderWidth: 2,
                                    '&:hover': {
                                        borderStyle: 'dashed',
                                        borderWidth: 2,
                                    }
                                }}
                            >
                                <CloudUploadIcon sx={{ mr: 1 }} />
                                {posterPreview ? 'Change Photo' : 'Choose Photo'}
                            </MDButton>
                        </label>
                        {posterPreview && (
                            <MDBox mt={2} borderRadius={1} sx={{ overflow: 'hidden', width: '100%', maxWidth: 300, mx: 'auto', border: '1px solid rgba(0,0,0,0.06)' }}>
                                <img src={posterPreview} alt="Preview" style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                            </MDBox>
                        )}
                    </MDBox>

                    <MDBox mt={3} display="flex" flexDirection="column" gap={2}>
                        <MDButton
                            variant="outlined"
                            color="secondary"
                            onClick={() => navigate(-1)}
                            fullWidth
                        >
                            <ArrowBackIcon sx={{ mr: 1 }} /> Cancel
                        </MDButton>
                        <MDButton
                            variant="gradient"
                            color="info"
                            onClick={handleSave}
                            fullWidth
                        >
                            <SaveIcon sx={{ mr: 1 }} /> Save Changes
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

export default EditBusiness;
