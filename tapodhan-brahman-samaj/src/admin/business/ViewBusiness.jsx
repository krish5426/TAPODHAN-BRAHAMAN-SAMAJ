import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";
import MDButton from "../components/MDButton";
import AdminLayout from "../layout/AdminLayout";
import Header from "../layout/Header";
import { API_URL } from "../services/api";

function ViewBusiness() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchBusiness = async () => {
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`${API_URL}/api/admin/business/${id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            setBusiness(data);
        } catch (err) {
            console.error("Failed to fetch business:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (status) => {
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`${API_URL}/api/admin/business/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                alert(`Business ${status} successfully!`);
                setBusiness(prev => ({ ...prev, status }));
            } else {
                alert("Failed to update status");
            }
        } catch (err) {
            console.error("Status update error:", err);
            alert("Error updating status");
        }
    };

    useEffect(() => {
        fetchBusiness();
    }, [id]);

    if (loading) {
        return (
            <AdminLayout>
                <Header />
                <MDBox pt={3} pb={3}>
                    <MDTypography variant="h4">Loading...</MDTypography>
                </MDBox>
            </AdminLayout>
        );
    }

    if (!business) {
        return (
            <AdminLayout>
                <Header />
                <MDBox pt={3} pb={3}>
                    <MDTypography variant="h4">Business not found</MDTypography>
                </MDBox>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Header />
            <MDBox pt={3} pb={3}>
                <MDBox mb={3}>
                    <Card>
                        <MDBox p={3}>
                            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <MDBox>
                                    <MDTypography variant="h4" fontWeight="medium">
                                        {business.businessName}
                                    </MDTypography>
                                    <MDTypography variant="button" color="text">
                                        Business Details
                                    </MDTypography>
                                </MDBox>
                                <MDButton variant="outlined" color="secondary" onClick={() => navigate(-1)}>
                                    <Icon>arrow_back</Icon>&nbsp;Back
                                </MDButton>
                            </MDBox>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    {business.posterPhoto && (
                                        <MDBox mb={3}>
                                            <img 
                                                src={`${API_URL}/uploads/${business.posterPhoto}`}
                                                alt={business.businessName}
                                                style={{width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px'}}
                                            />
                                        </MDBox>
                                    )}
                                    
                                    <MDBox mb={3}>
                                        <MDTypography variant="h6" fontWeight="medium" mb={1}>Status</MDTypography>
                                        <MDTypography 
                                            variant="button" 
                                            color={business.status === 'pending' ? 'warning' : business.status === 'approved' ? 'success' : 'error'} 
                                            fontWeight="medium"
                                            sx={{ textTransform: 'capitalize' }}
                                        >
                                            {business.status}
                                        </MDTypography>
                                    </MDBox>

                                    <MDBox display="flex" gap={1} flexDirection="column">
                                        {business.status === 'pending' && (
                                            <>
                                                <MDButton variant="gradient" color="success" onClick={() => handleStatusUpdate('approved')}>
                                                    <Icon>check</Icon>&nbsp;Approve
                                                </MDButton>
                                                <MDButton variant="gradient" color="error" onClick={() => handleStatusUpdate('rejected')}>
                                                    <Icon>close</Icon>&nbsp;Reject
                                                </MDButton>
                                            </>
                                        )}
                                        {business.status === 'approved' && (
                                            <MDButton variant="gradient" color="error" onClick={() => handleStatusUpdate('rejected')}>
                                                <Icon>close</Icon>&nbsp;Reject
                                            </MDButton>
                                        )}
                                        {business.status === 'rejected' && (
                                            <MDButton variant="gradient" color="success" onClick={() => handleStatusUpdate('approved')}>
                                                <Icon>check</Icon>&nbsp;Approve
                                            </MDButton>
                                        )}
                                    </MDBox>
                                </Grid>

                                <Grid item xs={12} md={8}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <MDBox mb={2}>
                                                <MDTypography variant="button" fontWeight="medium" color="text">Owner Name</MDTypography>
                                                <MDTypography variant="body1">{business.ownerName}</MDTypography>
                                            </MDBox>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <MDBox mb={2}>
                                                <MDTypography variant="button" fontWeight="medium" color="text">Email</MDTypography>
                                                <MDTypography variant="body1">{business.email}</MDTypography>
                                            </MDBox>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <MDBox mb={2}>
                                                <MDTypography variant="button" fontWeight="medium" color="text">Contact Number</MDTypography>
                                                <MDTypography variant="body1">{business.contactNumber}</MDTypography>
                                            </MDBox>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <MDBox mb={2}>
                                                <MDTypography variant="button" fontWeight="medium" color="text">Category</MDTypography>
                                                <MDTypography variant="body1">{business.category || 'N/A'}</MDTypography>
                                            </MDBox>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <MDBox mb={2}>
                                                <MDTypography variant="button" fontWeight="medium" color="text">Business Type</MDTypography>
                                                <MDTypography variant="body1">{business.businessType || 'N/A'}</MDTypography>
                                            </MDBox>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <MDBox mb={2}>
                                                <MDTypography variant="button" fontWeight="medium" color="text">City</MDTypography>
                                                <MDTypography variant="body1">{business.city || 'N/A'}</MDTypography>
                                            </MDBox>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <MDBox mb={2}>
                                                <MDTypography variant="button" fontWeight="medium" color="text">Address</MDTypography>
                                                <MDTypography variant="body1">{business.address}</MDTypography>
                                            </MDBox>
                                        </Grid>
                                        {business.description && (
                                            <Grid item xs={12}>
                                                <MDBox mb={2}>
                                                    <MDTypography variant="button" fontWeight="medium" color="text">Description</MDTypography>
                                                    <MDTypography variant="body1">{business.description}</MDTypography>
                                                </MDBox>
                                            </Grid>
                                        )}
                                        {business.website && (
                                            <Grid item xs={12}>
                                                <MDBox mb={2}>
                                                    <MDTypography variant="button" fontWeight="medium" color="text">Website</MDTypography>
                                                    <MDTypography variant="body1">
                                                        <a href={business.website} target="_blank" rel="noopener noreferrer" style={{color: '#1976d2'}}>
                                                            {business.website}
                                                        </a>
                                                    </MDTypography>
                                                </MDBox>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </MDBox>
                    </Card>
                </MDBox>
            </MDBox>
        </AdminLayout>
    );
}

export default ViewBusiness;