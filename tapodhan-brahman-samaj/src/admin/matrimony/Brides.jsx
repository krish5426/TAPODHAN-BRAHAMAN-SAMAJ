import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";
import MDButton from "../components/MDButton";
import AdminLayout from "../layout/AdminLayout";
import Header from "../layout/Header";
import DataTable from "../components/Tables/DataTable";
import MDAvatar from "../components/MDAvatar";
import { fetchAdminBrides, API_URL } from "../services/api";

function Brides() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const columns = [
        { Header: "Profile", accessor: "profile", width: "35%", align: "left" },
        { Header: "Education", accessor: "education", align: "left" },
        { Header: "Job", accessor: "job", align: "left" },
        { Header: "City", accessor: "city", align: "center" },
        { Header: "Age", accessor: "age", align: "center" },
        { Header: "Action", accessor: "action", align: "center" },
    ];

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchAdminBrides();
                const formattedRows = data.map((profile) => ({
                    profile: (
                        <MDBox display="flex" alignItems="center" lineHeight={1}>
                            <MDAvatar
                                src={profile.images?.[0] ? `${API_URL}${profile.images[0]}` : null}
                                name={profile.firstName}
                                size="sm"
                            />
                            <MDBox ml={2} lineHeight={1}>
                                <MDTypography display="block" variant="button" fontWeight="medium">
                                    {profile.firstName} {profile.surname}
                                </MDTypography>
                                <MDTypography variant="caption">{profile.email || profile.parentContactNo}</MDTypography>
                            </MDBox>
                        </MDBox>
                    ),
                    education: (
                        <MDTypography variant="caption" color="text" fontWeight="medium">
                            {profile.educationQualification}
                        </MDTypography>
                    ),
                    job: (
                        <MDTypography variant="caption" color="text" fontWeight="medium">
                            {profile.jobType}
                        </MDTypography>
                    ),
                    city: (
                        <MDTypography variant="caption" color="text" fontWeight="medium">
                            {profile.city}
                        </MDTypography>
                    ),
                    age: (
                        <MDTypography variant="caption" color="text" fontWeight="medium">
                            {profile.dateOfBirth ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() : "N/A"}
                        </MDTypography>
                    ),
                    action: (
                        <MDButton variant="text" color="info" onClick={() => navigate(`/admin/matrimony/edit/${profile._id}`)}>
                            <Icon>edit</Icon>&nbsp;Edit
                        </MDButton>
                    )
                }));
                setRows(formattedRows);
            } catch (err) {
                console.error("Failed to fetch brides:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [navigate]);

    return (
        <AdminLayout>
            <Header />
            <MDBox pt={3} pb={3}>
                <MDBox mb={3}>
                    <Card>
                        <MDBox p={3} lineHeight={1}>
                            <MDTypography variant="h5" fontWeight="medium">
                                Brides List
                            </MDTypography>
                            <MDTypography variant="button" color="text">
                                All approved female profiles
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

export default Brides;
