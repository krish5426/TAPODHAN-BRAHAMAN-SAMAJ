import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";
import MDButton from "../components/MDButton";
import AdminLayout from "../layout/AdminLayout";
import Header from "../layout/Header";
import DataTable from "../components/Tables/DataTable";
import MDAvatar from "../components/MDAvatar";
import { API_URL } from "../services/api";

function PendingBusinessRequests() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [actionType, setActionType] = useState('');

    const columns = [
        { Header: "Business", accessor: "business", width: "35%", align: "left" },
        { Header: "Contact", accessor: "contact", align: "left" },
        { Header: "Status", accessor: "status", align: "center" },
        { Header: "Action", accessor: "action", align: "center" },
    ];

    const handleActionClick = (business, action) => {
        setSelectedBusiness(business);
        setActionType(action);
        setModalOpen(true);
    };

    const handleConfirmAction = async () => {
        if (selectedBusiness && actionType) {
            await handleStatusUpdate(selectedBusiness.id, actionType);
            setModalOpen(false);
            setSelectedBusiness(null);
            setActionType('');
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`${API_URL}/api/admin/business`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            
            const formattedRows = data.map((business) => ({
                ...business,
                business: (
                    <MDBox display="flex" alignItems="center" lineHeight={1}>
                        <MDAvatar
                            src={business.posterPhoto ? `${API_URL}/uploads/${business.posterPhoto}` : null}
                            name={business.businessName}
                            size="sm"
                            variant="rounded"
                        />
                        <MDBox ml={2} lineHeight={1}>
                            <MDTypography display="block" variant="button" fontWeight="medium">
                                {business.businessName}
                            </MDTypography>
                            <MDTypography variant="caption">{business.ownerName}</MDTypography>
                        </MDBox>
                    </MDBox>
                ),
                contact: (
                    <MDBox lineHeight={1}>
                        <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
                            {business.contactNumber}
                        </MDTypography>
                        <MDTypography variant="caption" color="text">{business.email}</MDTypography>
                    </MDBox>
                ),
                status: (
                    <MDTypography 
                        variant="caption" 
                        color={business.status === 'pending' ? 'warning' : business.status === 'approved' ? 'success' : 'error'} 
                        fontWeight="medium"
                    >
                        {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
                    </MDTypography>
                ),
                action: (
                    <MDBox display="flex" gap={1}>
                        <MDButton variant="outlined" color="info" size="small" onClick={() => navigate(`/admin/business/view/${business.id}`)}>
                            <Icon>visibility</Icon>&nbsp;View
                        </MDButton>
                        {business.status === 'pending' && (
                            <>
                                <MDButton variant="gradient" color="success" size="small" onClick={() => handleActionClick(business, 'approved')}>
                                    <Icon>check</Icon>&nbsp;Approve
                                </MDButton>
                                <MDButton variant="gradient" color="error" size="small" onClick={() => handleActionClick(business, 'rejected')}>
                                    <Icon>close</Icon>&nbsp;Reject
                                </MDButton>
                            </>
                        )}
                        {business.status === 'approved' && (
                            <MDButton variant="gradient" color="error" size="small" onClick={() => handleActionClick(business, 'rejected')}>
                                <Icon>close</Icon>&nbsp;Reject
                            </MDButton>
                        )}
                        {business.status === 'rejected' && (
                            <MDButton variant="gradient" color="success" size="small" onClick={() => handleActionClick(business, 'approved')}>
                                <Icon>check</Icon>&nbsp;Approve
                            </MDButton>
                        )}
                    </MDBox>
                )
            }));
            setRows(formattedRows);
        } catch (err) {
            console.error("Failed to fetch business requests:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (businessId, status) => {
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`${API_URL}/api/admin/business/${businessId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                alert(`Business ${status} successfully!`);
                fetchPendingRequests();
            } else {
                alert("Failed to update status");
            }
        } catch (err) {
            console.error("Status update error:", err);
            alert("Error updating status");
        }
    };

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    return (
        <AdminLayout>
            <Header />
            <MDBox pt={3} pb={3}>
                <MDBox mb={3}>
                    <Card>
                        <MDBox p={3} lineHeight={1}>
                            <MDTypography variant="h5" fontWeight="medium">
                                Business Requests
                            </MDTypography>
                            <MDTypography variant="button" color="text">
                                Manage business registrations - approve or reject
                            </MDTypography>
                        </MDBox>
                        <DataTable
                            table={{ columns, rows }}
                            showTotalEntries={true}
                            isSorted={true}
                            noEndBorder
                            entriesPerPage={false}
                        />
                    </Card>
                </MDBox>
            </MDBox>
            
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <MDTypography variant="h4" fontWeight="medium">
                        {actionType === 'approved' ? 'Approve' : 'Reject'} Business Registration
                    </MDTypography>
                </DialogTitle>
                <DialogContent>
                    {selectedBusiness && (
                        <MDBox>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    {selectedBusiness.posterPhoto && (
                                        <MDBox mb={2}>
                                            <img 
                                                src={`${API_URL}/uploads/${selectedBusiness.posterPhoto}`}
                                                alt={selectedBusiness.businessName}
                                                style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px'}}
                                            />
                                        </MDBox>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <MDBox mb={2}>
                                        <MDTypography variant="h5" fontWeight="medium" color="info">
                                            {selectedBusiness.businessName}
                                        </MDTypography>
                                    </MDBox>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <MDTypography variant="button" fontWeight="medium">Owner:</MDTypography>
                                            <MDTypography variant="body2">{selectedBusiness.ownerName}</MDTypography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <MDTypography variant="button" fontWeight="medium">Email:</MDTypography>
                                            <MDTypography variant="body2">{selectedBusiness.email}</MDTypography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <MDTypography variant="button" fontWeight="medium">Contact:</MDTypography>
                                            <MDTypography variant="body2">{selectedBusiness.contactNumber}</MDTypography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <MDTypography variant="button" fontWeight="medium">Category:</MDTypography>
                                            <MDTypography variant="body2">{selectedBusiness.category || 'N/A'}</MDTypography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <MDTypography variant="button" fontWeight="medium">Business Type:</MDTypography>
                                            <MDTypography variant="body2">{selectedBusiness.businessType || 'N/A'}</MDTypography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <MDTypography variant="button" fontWeight="medium">City:</MDTypography>
                                            <MDTypography variant="body2">{selectedBusiness.city || 'N/A'}</MDTypography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <MDTypography variant="button" fontWeight="medium">Address:</MDTypography>
                                            <MDTypography variant="body2">{selectedBusiness.address}</MDTypography>
                                        </Grid>
                                        {selectedBusiness.description && (
                                            <Grid item xs={12}>
                                                <MDTypography variant="button" fontWeight="medium">Description:</MDTypography>
                                                <MDTypography variant="body2">{selectedBusiness.description}</MDTypography>
                                            </Grid>
                                        )}
                                        {selectedBusiness.website && (
                                            <Grid item xs={12}>
                                                <MDTypography variant="button" fontWeight="medium">Website:</MDTypography>
                                                <MDTypography variant="body2">
                                                    <a href={selectedBusiness.website} target="_blank" rel="noopener noreferrer" style={{color: '#1976d2'}}>
                                                        {selectedBusiness.website}
                                                    </a>
                                                </MDTypography>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </MDBox>
                    )}
                </DialogContent>
                <DialogActions>
                    <MDButton variant="outlined" color="secondary" onClick={() => setModalOpen(false)}>
                        Cancel
                    </MDButton>
                    <MDButton 
                        variant="gradient" 
                        color={actionType === 'approved' ? 'success' : 'error'} 
                        onClick={handleConfirmAction}
                    >
                        {actionType === 'approved' ? 'Approve' : 'Reject'} Business
                    </MDButton>
                </DialogActions>
            </Dialog>
        </AdminLayout>
    );
}

export default PendingBusinessRequests;