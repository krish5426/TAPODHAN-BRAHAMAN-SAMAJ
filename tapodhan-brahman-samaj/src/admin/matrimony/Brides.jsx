import { useEffect, useState, useRef } from "react";
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
import { fetchAdminBrides, importAdminProfiles, API_URL } from "../services/api";

function Brides() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

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
                        <MDBox display="flex" gap={1}>
                            <MDButton variant="gradient" color="info" size="small" onClick={() => navigate(`/admin/matrimony/view/${profile.id}`)}>
                                View
                            </MDButton>
                            <MDButton variant="outlined" color="dark" size="small" onClick={() => navigate(`/admin/matrimony/edit/${profile.id}`)}>
                                Edit
                            </MDButton>
                        </MDBox>
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

    const handleImportClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const response = await importAdminProfiles(file);
            const { summary } = response;
            let msg = `Successfully imported ${summary.success} profiles.\n`;
            if (summary.errors && summary.errors.length > 0) {
                msg += `Encountered ${summary.errors.length} errors:\n${summary.errors.slice(0, 10).join('\n')}`;
            }
            alert(msg);
            window.location.reload();
        } catch (error) {
            console.error("Import failed:", error);
            alert("Failed to import profiles. " + error.message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <AdminLayout>
            <Header />
            <MDBox pt={3} pb={3}>
                <MDBox mb={3}>
                    <Card>
                        <MDBox p={3} lineHeight={1} display="flex" justifyContent="space-between" alignItems="center">
                            <MDBox>
                                <MDTypography variant="h5" fontWeight="medium">
                                    Brides List
                                </MDTypography>
                                <MDTypography variant="button" color="text">
                                    All approved female profiles
                                </MDTypography>
                            </MDBox>
                            <MDBox display="flex" gap={1}>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept=".xlsx,.xls,.csv"
                                    style={{ display: "none" }}
                                />
                                <MDButton
                                    variant="gradient"
                                    color="success"
                                    onClick={handleImportClick}
                                    disabled={uploading}
                                >
                                    <Icon>upload_file</Icon>&nbsp;{uploading ? "Importing..." : "Import Excel"}
                                </MDButton>
                            </MDBox>
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
