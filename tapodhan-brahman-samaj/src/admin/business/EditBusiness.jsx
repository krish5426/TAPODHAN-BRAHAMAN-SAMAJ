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
import { fetchAdminBusinessById, updateAdminBusiness, API_URL } from "../services/api";

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
            <MDBox py={3}>
                <Card sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
                    <MDTypography variant="h5" mb={2} sx={{ fontWeight: 700 }}>Edit Business</MDTypography>
                    <MDBox
                        display="grid"
                        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
                        columnGap={3}
                        rowGap={3}
                    >
                        <MDBox>
                            <MDInput fullWidth label="Business Name" name="businessName" value={formData.businessName || ""} onChange={handleChange} />
                        </MDBox>
                        <MDBox>
                            <MDInput fullWidth label="Owner Name" name="ownerName" value={formData.ownerName || ""} onChange={handleChange} />
                        </MDBox>
                        <MDBox>
                            <MDInput fullWidth label="Status (approved/pending/rejected)" name="status" value={formData.status || ""} onChange={handleChange} />
                        </MDBox>
                        <MDBox>
                            <MDInput fullWidth label="Email" name="email" value={formData.email || ""} onChange={handleChange} />
                        </MDBox>
                        <MDBox>
                            <MDInput fullWidth label="Contact Number" name="contactNumber" value={formData.contactNumber || ""} onChange={handleChange} />
                        </MDBox>
                        <MDBox>
                            <MDInput fullWidth label="Website" name="website" value={formData.website || ""} onChange={handleChange} />
                        </MDBox>
                        <MDBox>
                            <MDInput fullWidth label="Category" name="category" value={formData.category || ""} onChange={handleChange} />
                        </MDBox>
                        <MDBox>
                            <MDInput fullWidth label="Business Type" name="businessType" value={formData.businessType || ""} onChange={handleChange} />
                        </MDBox>
                        <MDBox>
                            <MDInput fullWidth label="City" name="city" value={formData.city || ""} onChange={handleChange} />
                        </MDBox>
                        <MDBox>
                            <MDInput fullWidth label="State" name="state" value={formData.state || ""} onChange={handleChange} />
                        </MDBox>
                        <MDBox sx={{ gridColumn: { md: "span 2" } }}>
                            <MDInput fullWidth multiline rows={3} label="Description" name="description" value={formData.description || ""} onChange={handleChange} />
                        </MDBox>
                        <MDBox sx={{ gridColumn: { md: "span 2" } }}>
                            <MDInput fullWidth multiline rows={3} label="Address" name="address" value={formData.address || ""} onChange={handleChange} />
                        </MDBox>
                    </MDBox>

                    <MDBox mt={3}>
                        <MDTypography variant="button" display="block" mb={1.5} sx={{ fontWeight: 600 }}>Poster Photo</MDTypography>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            id="poster-upload-edit"
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="poster-upload-edit">
                            <MDButton
                                variant="outlined"
                                color="info"
                                component="span"
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    px: 3,
                                    py: 1
                                }}
                            >
                                Choose File
                            </MDButton>
                        </label>
                        {posterPreview && (
                            <MDBox mt={2} borderRadius={2} sx={{ overflow: 'hidden', width: 200, border: '2px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <img src={posterPreview} alt="Preview" style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                            </MDBox>
                        )}
                    </MDBox>

                    <MDBox mt={3} display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
                        <MDButton
                            variant="outlined"
                            color="secondary"
                            onClick={() => navigate(-1)}
                            sx={{ flex: 1 }}
                            fullWidth
                        >
                            <ArrowBackIcon sx={{ mr: 1 }} /> Cancel
                        </MDButton>
                        <MDButton
                            variant="gradient"
                            color="info"
                            onClick={handleSave}
                            sx={{ flex: 1 }}
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
