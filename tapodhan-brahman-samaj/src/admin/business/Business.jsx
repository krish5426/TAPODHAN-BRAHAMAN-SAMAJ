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
import { fetchAdminBusiness, API_URL } from "../services/api";

function Business() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const columns = [
        { Header: "Business", accessor: "business", width: "35%", align: "left" },
        { Header: "Contact", accessor: "contact", align: "left" },
        { Header: "Address", accessor: "address", align: "left" },
        { Header: "Action", accessor: "action", align: "center" },
    ];

    useEffect(() => {
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
                        <MDButton variant="text" color="info" onClick={() => navigate(`/admin/business/edit/${biz.id}`)}>
                            <Icon>edit</Icon>&nbsp;Edit
                        </MDButton>
                    )
                }));
                setRows(formattedRows);
            } catch (err) {
                console.error("Failed to fetch business:", err);
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
                                Business List
                            </MDTypography>
                            <MDTypography variant="button" color="text">
                                All approved businesses
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

export default Business;
