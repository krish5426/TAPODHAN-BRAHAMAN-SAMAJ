import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";
import MDButton from "../components/MDButton";
import MDInput from "../components/MDInput";
import { MenuItem } from "@mui/material";
import AdminCustomDialog from "../components/AdminCustomDialog";
import AdminLayout from "../layout/AdminLayout";
import Header from "../layout/Header";
import { createAdminBusiness } from "../services/api";

function AddBusiness() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        businessName: "",
        ownerName: "",
        email: "",
        contactNumber: "",
        address: "",
        status: "approved",
        category: "",
        businessType: "",
        description: "",
        website: "",
        city: "",
        state: ""
    });
    const [poster, setPoster] = useState(null);
    const [posterPreview, setPosterPreview] = useState(null);
    const [dialog, setDialog] = useState({ isOpen: false, message: '', type: 'success' });

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
        if (!formData.businessName || !formData.ownerName || !formData.contactNumber || !formData.address) {
            setDialog({ isOpen: true, message: 'Please fill all required fields: Business Name, Owner Name, Contact Number, Address.', type: 'error' });
            return;
        }

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            if (poster) {
                data.append("posterPhoto", poster);
            }

            await createAdminBusiness(data);
            setDialog({ isOpen: true, message: 'Business Created!', type: 'success' });
        } catch (err) {
            setDialog({ isOpen: true, message: err.message || 'Creation failed', type: 'error' });
        }
    };

    return (
        <AdminLayout>
            <Header />
            <MDBox py={3}>
                <Card sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
                    <MDTypography variant="h4" mb={2}>Add Business</MDTypography>
                    <Grid container spacing={3}>
                        {/* Left Column */}
                        <Grid item xs={12} md={6}>
                            <MDBox display="flex" flexDirection="column" gap={3}>
                                <MDInput fullWidth label="Business Name*" name="businessName" value={formData.businessName} onChange={handleChange} required />
                                <MDInput fullWidth label="Owner Name*" name="ownerName" value={formData.ownerName} onChange={handleChange} required />
                                <MDInput
                                    select
                                    label="Category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    fullWidth
                                    type="text"
                                    InputLabelProps={{ shrink: true }}
                                >
                                    <MenuItem value="">Select Category</MenuItem>
                                    <MenuItem value="Restaurant">Restaurant</MenuItem>
                                    <MenuItem value="Shop">Shop</MenuItem>
                                    <MenuItem value="Service">Service</MenuItem>
                                    <MenuItem value="Freelancer">Freelancer</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </MDInput>
                                <MDInput fullWidth label="Business Type" name="businessType" value={formData.businessType} onChange={handleChange} />
                                <MDInput
                                    select
                                    label="Status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    fullWidth
                                    type="text"
                                    InputLabelProps={{ shrink: true }}
                                >
                                    <MenuItem value="approved">Approved</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="rejected">Rejected</MenuItem>
                                </MDInput>
                                <MDInput fullWidth multiline rows={3} label="Description" name="description" value={formData.description} onChange={handleChange} />
                            </MDBox>
                        </Grid>

                        {/* Right Column */}
                        <Grid item xs={12} md={6}>
                            <MDBox display="flex" flexDirection="column" gap={3}>
                                <MDInput fullWidth label="Contact Number*" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
                                <MDInput fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} />
                                <MDInput fullWidth label="Website" name="website" value={formData.website} onChange={handleChange} />
                                <MDInput fullWidth multiline rows={3} label="Address*" name="address" value={formData.address} onChange={handleChange} required />
                                <MDInput fullWidth label="City" name="city" value={formData.city} onChange={handleChange} />
                                <MDInput fullWidth label="State" name="state" value={formData.state} onChange={handleChange} />
                            </MDBox>
                        </Grid>
                    </Grid>

                    <MDBox mt={3}>
                        <MDTypography variant="button" display="block" mb={1}>Poster Photo</MDTypography>
                        <input type="file" onChange={handleImageChange} />
                        {posterPreview && (
                            <MDBox mt={2} border="1px solid #ccc" borderRadius="8px" p={1} width="fit-content">
                                <img src={posterPreview} alt="Preview" style={{ height: 150, borderRadius: "8px" }} />
                            </MDBox>
                        )}
                    </MDBox>

                    <MDBox mt={3} display="flex" justifyContent="flex-end">
                        <MDButton variant="outlined" color="secondary" onClick={() => navigate(-1)} sx={{ mr: 2 }}>Cancel</MDButton>
                        <MDButton variant="gradient" color="info" onClick={handleSave}>Create Business</MDButton>
                    </MDBox>
                </Card>
            </MDBox>
            <AdminCustomDialog 
                isOpen={dialog.isOpen}
                message={dialog.message}
                type={dialog.type}
                onClose={() => {
                    if (dialog.type === 'success') {
                        setDialog({ isOpen: false, message: '', type: 'success' });
                        navigate("/admin/business");
                    } else {
                        setDialog({ ...dialog, isOpen: false });
                    }
                }}
            />
        </AdminLayout>
    );
}

export default AddBusiness;
