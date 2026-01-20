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
import AdminCustomDialog from "../components/AdminCustomDialog";
import AdminLayout from "../layout/AdminLayout";
import Header from "../layout/Header";
import DataTable from "../components/Tables/DataTable";
import MDAvatar from "../components/MDAvatar";
import { fetchPendingProfiles, updateProfileStatus, API_URL } from "../services/api";

function PendingProfiles() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: '', onConfirm: null });
    const [dialog, setDialog] = useState({ isOpen: false, message: '', type: 'success' });

    const columns = [
        { Header: "Profile", accessor: "profile", width: "35%", align: "left" },
        { Header: "Contact", accessor: "contact", align: "left" },
        { Header: "Status", accessor: "status", align: "center" },
        { Header: "Action", accessor: "action", align: "center" },
    ];

    const handleViewClick = (profile) => {
        console.log('Profile data:', profile); // Debug log
        setSelectedProfile(profile);
        setViewModalOpen(true);
    };

    const handleActionClick = (profile, action) => {
        console.log('Profile for action:', profile); // Debug log
        const profileId = profile._id || profile.id;
        if (!profileId) {
            console.error('Profile ID not found:', profile);
            setDialog({ isOpen: true, message: 'Error: Profile ID not found', type: 'error' });
            return;
        }
        setConfirmDialog({
            isOpen: true,
            message: `Are you sure you want to ${action === 'approved' ? 'approve' : 'reject'} this profile?`,
            onConfirm: () => {
                handleStatusUpdate(profileId, action);
                setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
            }
        });
    };



    const fetchPendingProfilesData = async () => {
        try {
            const data = await fetchPendingProfiles();
            
            const formattedRows = data.map((profile) => ({
                ...profile,
                profile: (
                    <MDBox display="flex" alignItems="center" lineHeight={1}>
                        <MDAvatar
                            src={profile.images?.[0] ? `${API_URL}${profile.images[0]}` : null}
                            name={profile.firstName || profile.name}
                            size="sm"
                        />
                        <MDBox ml={2} lineHeight={1}>
                            <MDTypography display="block" variant="button" fontWeight="medium">
                                {profile.firstName ? `${profile.firstName} ${profile.surname || ''}` : profile.name}
                            </MDTypography>
                            <MDTypography variant="caption">
                                {profile.gender} • {profile.dateOfBirth ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() : 'N/A'} yrs • {profile.city || 'N/A'}
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                ),
                contact: (
                    <MDBox lineHeight={1}>
                        {profile.contactpersonnumber && (
                            <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
                                📞 {profile.contactpersonnumber}
                            </MDTypography>
                        )}
                        {profile.contactpersonemail && (
                            <MDTypography variant="caption" color="text">
                                ✉️ {profile.contactpersonemail}
                            </MDTypography>
                        )}
                        {profile.educationQualification && (
                            <MDTypography variant="caption" color="text" display="block">
                                🎓 {profile.educationQualification}
                            </MDTypography>
                        )}
                    </MDBox>
                ),
                status: (
                    <MDTypography 
                        variant="caption" 
                        color={profile.status === 'pending' ? 'warning' : profile.status === 'approved' ? 'success' : 'error'} 
                        fontWeight="medium"
                    >
                        {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                    </MDTypography>
                ),
                action: (
                    <MDBox display="flex" gap={1}>
                        <MDButton variant="outlined" color="info" size="small" onClick={() => handleViewClick(profile)}>
                            <Icon>visibility</Icon>&nbsp;View
                        </MDButton>
                        {profile.status === 'pending' && (
                            <>
                                <MDButton variant="gradient" color="success" size="small" onClick={() => handleActionClick(profile, 'approved')}>
                                    <Icon>check</Icon>&nbsp;Approve
                                </MDButton>
                                <MDButton variant="gradient" color="error" size="small" onClick={() => handleActionClick(profile, 'rejected')}>
                                    <Icon>close</Icon>&nbsp;Reject
                                </MDButton>
                            </>
                        )}
                    </MDBox>
                )
            }));
            setRows(formattedRows);
        } catch (err) {
            console.error("Failed to fetch pending profiles:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (profileId, status) => {
        try {
            await updateProfileStatus(profileId, status);
            setDialog({ isOpen: true, message: `Profile ${status} successfully!`, type: 'success' });
            fetchPendingProfilesData();
        } catch (err) {
            console.error("Status update error:", err);
            setDialog({ isOpen: true, message: 'Error updating status', type: 'error' });
        }
    };

    useEffect(() => {
        fetchPendingProfilesData();
    }, []);

    return (
        <AdminLayout>
            <Header />
            <MDBox pt={3} pb={3}>
                <MDBox mb={3}>
                    <Card>
                        <MDBox p={3} lineHeight={1}>
                            <MDTypography variant="h5" fontWeight="medium">
                                Profile Requests
                            </MDTypography>
                            <MDTypography variant="button" color="text">
                                Manage profile registrations - approve or reject
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
            
            <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="lg" fullWidth>
                <DialogTitle>
                    <MDTypography variant="h4" fontWeight="medium">
                        Profile Details
                    </MDTypography>
                </DialogTitle>
                <DialogContent>
                    {selectedProfile && (
                        <MDBox>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    {selectedProfile.images?.[0] && (
                                        <MDBox mb={2}>
                                            <img 
                                                src={`${API_URL}${selectedProfile.images[0]}`}
                                                alt={selectedProfile.firstName || selectedProfile.name}
                                                style={{width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px'}}
                                            />
                                        </MDBox>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <MDBox mb={2}>
                                        <MDTypography variant="h5" fontWeight="medium" color="info">
                                            {selectedProfile.firstName ? `${selectedProfile.firstName} ${selectedProfile.surname || ''}` : selectedProfile.name}
                                        </MDTypography>
                                    </MDBox>
                                    <Grid container spacing={2}>
                                        {Object.entries(selectedProfile).map(([key, value]) => {
                                            // Skip certain fields that shouldn't be displayed
                                            if (['_id', '__v', 'images', 'createdAt', 'updatedAt', 'id', 'userId', 'approvedBy', 'approvedAt'].includes(key)) {
                                                return null;
                                            }
                                            
                                            // Format the key for display
                                            const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                            
                                            // Format date of birth
                                            let displayValue = value;
                                            if (key === 'dateOfBirth' && value) {
                                                displayValue = new Date(value).toLocaleDateString('en-GB');
                                            }
                                            
                                            return (
                                                <Grid item xs={6} key={key}>
                                                    <MDTypography variant="button" fontWeight="medium">{displayKey}:</MDTypography>
                                                    <MDTypography variant="body2">
                                                        {Array.isArray(displayValue) ? displayValue.join(', ') : (displayValue || '')}
                                                    </MDTypography>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </MDBox>
                    )}
                </DialogContent>
                <DialogActions>
                    <MDButton variant="outlined" color="secondary" onClick={() => setViewModalOpen(false)}>
                        Close
                    </MDButton>
                    {selectedProfile?.status === 'pending' && (
                        <>
                            <MDButton variant="gradient" color="success" onClick={() => {
                                setViewModalOpen(false);
                                handleActionClick(selectedProfile, 'approved');
                            }}>
                                <Icon>check</Icon>&nbsp;Approve
                            </MDButton>
                            <MDButton variant="gradient" color="error" onClick={() => {
                                setViewModalOpen(false);
                                handleActionClick(selectedProfile, 'rejected');
                            }}>
                                <Icon>close</Icon>&nbsp;Reject
                            </MDButton>
                        </>
                    )}
                </DialogActions>
            </Dialog>
            
            <Dialog open={confirmDialog.isOpen} onClose={() => setConfirmDialog({ isOpen: false, message: '', onConfirm: null })} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <MDBox display="flex" alignItems="center" gap={1}>
                        <Icon color="warning" fontSize="large">warning</Icon>
                        <MDTypography variant="h5" color="warning">
                            Confirm Action
                        </MDTypography>
                    </MDBox>
                </DialogTitle>
                <DialogContent>
                    <MDTypography variant="body1" color="text">
                        {confirmDialog.message}
                    </MDTypography>
                </DialogContent>
                <DialogActions>
                    <MDButton variant="outlined" color="secondary" onClick={() => setConfirmDialog({ isOpen: false, message: '', onConfirm: null })}>
                        Cancel
                    </MDButton>
                    <MDButton variant="gradient" color="warning" onClick={confirmDialog.onConfirm}>
                        Confirm
                    </MDButton>
                </DialogActions>
            </Dialog>
            
            <AdminCustomDialog 
                isOpen={dialog.isOpen}
                message={dialog.message}
                type={dialog.type}
                onClose={() => setDialog({ isOpen: false, message: '', type: 'success' })}
            />
        </AdminLayout>
    );
}

export default PendingProfiles;