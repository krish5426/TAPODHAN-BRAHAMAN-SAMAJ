import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";
import MDButton from "../components/MDButton";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import AdminLayout from "../layout/AdminLayout";
import Header from "../layout/Header";
import DataTable from "../components/Tables/DataTable";
import MDAvatar from "../components/MDAvatar";
import { fetchAdminBusiness, importAdminBusiness, API_URL } from "../services/api";

function Business() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const columns = [
        { Header: "Business", accessor: "business", width: "35%", align: "left" },
        { Header: "Contact", accessor: "contact", align: "left" },
        { Header: "Address", accessor: "address", align: "left" },
        { Header: "Action", accessor: "action", align: "center" },
    ];

    const loadData = async () => {
        try {
            const data = await fetchAdminBusiness();
                const formattedRows = data.map((biz) => ({
                    business: (
                        <MDBox display="flex" alignItems="center" lineHeight={1}>
                            <MDAvatar
                                src={biz.posterPhoto ? `${API_URL}/uploads/${biz.posterPhoto}` : null}
                                name={biz.businessName}
                                size="sm"
                                variant="rounded"
                            />
                            <MDBox ml={2} lineHeight={1}>
                                <MDTypography display="block" variant="button" fontWeight="medium">
                                    {biz.businessName}
                                </MDTypography>
                                <MDTypography variant="caption">{biz.ownerName}</MDTypography>
                            </MDBox>
                        </MDBox>
                    ),
                    contact: (
                        <MDBox lineHeight={1}>
                            <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
                                {biz.contactNumber}
                            </MDTypography>
                            <MDTypography variant="caption" color="text">{biz.email}</MDTypography>
                        </MDBox>
                    ),
                    address: (
                        <MDTypography variant="caption" color="text" fontWeight="medium">
                            {biz.address}
                        </MDTypography>
                    ),
                    action: (
                        <MDBox display="flex" gap={1}>
                            <MDButton variant="outlined" color="info" size="small" onClick={() => navigate(`/admin/business/view/${biz.id}`)}>
                                <VisibilityIcon sx={{ fontSize: "18px" }} />&nbsp;View
                            </MDButton>
                            <MDButton variant="text" color="info" onClick={() => navigate(`/admin/business/edit/${biz.id}`)}>
                                <EditIcon sx={{ fontSize: "18px" }} />&nbsp;Edit
                            </MDButton>
                        </MDBox>
                    )
                }));
                setRows(formattedRows);
            } catch (err) {
                console.error("Failed to fetch business:", err);
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
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
            const response = await importAdminBusiness(file);
            const { summary } = response;
            let msg = `Successfully imported ${summary.success} businesses.\n`;
            if (summary.errors && summary.errors.length > 0) {
                msg += `Encountered ${summary.errors.length} errors:\n${summary.errors.join('\\n')}`;
            }
            alert(msg);
            loadData(); // Refresh list after import
        } catch (error) {
            console.error("Import failed:", error);
            alert("Failed to import businesses. " + error.message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Reset input
            }
        }
    };

    return (
        <AdminLayout>
            <Header />
            <MDBox pt={3} pb={3}>
                <MDBox mb={3}>
                    <Card>
                        <MDBox p={3} lineHeight={1} display="flex" flexDirection={{ xs: "column-reverse", md: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", md: "center" }} gap={2}>
                            <MDBox>
                                <MDTypography variant="h5" fontWeight="medium">
                                    Business List
                                </MDTypography>
                                <MDTypography variant="button" color="text">
                                    All approved businesses
                                </MDTypography>
                            </MDBox>
                            <MDBox display="flex" gap={2}>
                                <input 
                                    type="file" 
                                    accept=".csv" 
                                    style={{ display: "none" }} 
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                                <MDButton 
                                    variant="outlined" 
                                    color="info" 
                                    component="a"
                                    href="/sample_business_import.csv"
                                    download="sample_business_import.csv"
                                >
                                    <UploadFileIcon sx={{ fontWeight: "bold" }} />
                                    &nbsp;Download Sample
                                </MDButton>
                                <MDButton 
                                    variant="gradient" 
                                    color="success" 
                                    onClick={handleImportClick} 
                                    disabled={uploading}
                                >
                                    <UploadFileIcon sx={{ fontWeight: "bold" }} />
                                    &nbsp;{uploading ? 'Importing...' : 'Import Business'}
                                </MDButton>
                                <MDButton variant="gradient" color="info" onClick={() => navigate("/admin/business/add")} fullWidth={{ xs: true, md: false }}>
                                    <AddIcon sx={{ fontWeight: "bold" }} />
                                    &nbsp;Add Business
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

export default Business;
