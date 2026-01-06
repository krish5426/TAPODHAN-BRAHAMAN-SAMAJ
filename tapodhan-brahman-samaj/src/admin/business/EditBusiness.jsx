import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";
import MDButton from "../components/MDButton";
import MDInput from "../components/MDInput";
import AdminLayout from "../layout/AdminLayout";
import Header from "../layout/Header";
import { fetchAdminBusinessById, updateAdminBusiness, API_URL } from "../services/api";

function EditBusiness() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const [poster, setPoster] = useState(null); // New file
    const [posterPreview, setPosterPreview] = useState(null);

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
                alert("Failed to load business");
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

            if (poster) {
                data.append("posterPhoto", poster);
            }

            await updateAdminBusiness(id, data);
            alert("Business Updated!");
            navigate(-1);
        } catch (err) {
            alert("Update failed");
        }
    };

    return (
        <AdminLayout>
            <Header />
            <MDBox py={3}>
                <Card sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
                    <MDTypography variant="h4" mb={2}>Edit Business</MDTypography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <MDInput fullWidth label="Business Name" name="businessName" value={formData.businessName || ""} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MDInput fullWidth label="Owner Name" name="ownerName" value={formData.ownerName || ""} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MDInput fullWidth label="Status (approved/pending/rejected)" name="status" value={formData.status || ""} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MDInput fullWidth label="Email" name="email" value={formData.email || ""} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MDInput fullWidth label="Contact Number" name="contactNumber" value={formData.contactNumber || ""} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <MDInput fullWidth multiline rows={3} label="Address" name="address" value={formData.address || ""} onChange={handleChange} />
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
                        <MDButton variant="gradient" color="info" onClick={handleSave}>Save Changes</MDButton>
                    </MDBox>
                </Card>
            </MDBox>
        </AdminLayout>
    );
}

export default EditBusiness;
