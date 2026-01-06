import { useState } from "react";
import Card from "@mui/material/Card";
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";
import AdminLayout from "../layout/AdminLayout";
import Header from "../layout/Header";

function State() {
    return (
        <AdminLayout>
            <Header />
            <MDBox py={3}>
                <Card sx={{ p: 3 }}>
                    <MDTypography variant="h4">State Master</MDTypography>
                    <MDTypography variant="body2">Manage States here.</MDTypography>
                </Card>
            </MDBox>
        </AdminLayout>
    );
}

export default State;


