import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";
import MDButton from "../components/MDButton";
import AdminLayout from "../layout/AdminLayout";
import Header from "../layout/Header";
import DataTable from "../components/Tables/DataTable";
import MDAvatar from "../components/MDAvatar";
import { API_URL } from "../services/api";

function PendingBusinessRequests() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        { Header: "Business", accessor: "business", width: "35%", align: "left" },
        { Header: "Contact", accessor: "contact", align: "left" },
        { Header: "Status", accessor: "status", align: "center" },
        { Header: "Action", accessor: "action", align: "center" },
    ];

    const fetchPendingRequests = async () => {
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`${API_URL}/api/admin/business`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            
            const formattedRows = data.map((business) => ({
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
                        {business.status === 'pending' && (
                            <>
                                <MDButton variant="gradient" color="success" size="small" onClick={() => handleStatusUpdate(business.id, 'approved')}>
                                    <Icon>check</Icon>&nbsp;Approve
                                </MDButton>
                                <MDButton variant="gradient" color="error" size="small" onClick={() => handleStatusUpdate(business.id, 'rejected')}>
                                    <Icon>close</Icon>&nbsp;Reject
                                </MDButton>
                            </>
                        )}
                        {business.status === 'approved' && (
                            <MDButton variant="gradient" color="error" size="small" onClick={() => handleStatusUpdate(business.id, 'rejected')}>
                                <Icon>close</Icon>&nbsp;Reject
                            </MDButton>
                        )}
                        {business.status === 'rejected' && (
                            <MDButton variant="gradient" color="success" size="small" onClick={() => handleStatusUpdate(business.id, 'approved')}>
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
                fetchPendingRequests(); // Refresh the list
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
        </AdminLayout>
    );
}

export default PendingBusinessRequests;