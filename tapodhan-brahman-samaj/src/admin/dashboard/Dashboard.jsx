import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import { Box, Typography, CardContent } from "@mui/material";
import MDBox from "../components/MDBox";
import DashboardLayout from "../layout/AdminLayout";
import DashboardNavbar from "../layout/Header";
import { fetchDashboardCounts, fetchPendingProfiles } from "../services/api";

function Dashboard() {
    const navigate = useNavigate();
    const [counts, setCounts] = useState({
        totalBrides: 0,
        totalGrooms: 0,
        totalBusiness: 0,
        totalEvents: 0,
        pendingBusinessRequests: 0,
        pendingProfiles: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCounts = async () => {
            try {
                const [dashboardData, pendingProfilesData] = await Promise.all([
                    fetchDashboardCounts(),
                    fetchPendingProfiles()
                ]);
                setCounts({
                    ...dashboardData,
                    pendingProfiles: pendingProfilesData.length
                });
            } catch (error) {
                console.error("Failed to load dashboard counts:", error);
            } finally {
                setLoading(false);
            }
        };

        loadCounts();
    }, []);

    const StatCard = ({ icon, title, count, color, label, onClick }) => (
        <Card
            onClick={onClick}
            sx={{
                background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                color: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: onClick ? "pointer" : "default",
                height: "100%",
                "&:hover": onClick ? {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)",
                } : {},
                overflow: "hidden",
                position: "relative",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "-50px",
                    right: "-50px",
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                }
            }}
        >
            <CardContent sx={{ position: "relative", zIndex: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box flex={1}>
                        <Typography
                            sx={{
                                fontSize: "14px",
                                fontWeight: 500,
                                opacity: 0.9,
                                letterSpacing: "0.5px",
                                marginBottom: "8px"
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "42px",
                                fontWeight: 700,
                                letterSpacing: "-1px",
                                marginBottom: "12px"
                            }}
                        >
                            {loading ? "..." : count}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "12px",
                                opacity: 0.85,
                                fontWeight: 500,
                                letterSpacing: "0.3px"
                            }}
                        >
                            {label}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            fontSize: "48px",
                            opacity: 0.2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Icon sx={{ fontSize: "48px" }}>{icon}</Icon>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox py={4} px={3}>
                {/* Header Section */}
                <Box mb={5}>
                    <Typography
                        sx={{
                            fontSize: "32px",
                            fontWeight: 700,
                            color: "#2c3e50",
                            marginBottom: "8px"
                        }}
                    >
                        Dashboard
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "14px",
                            color: "#7f8c8d",
                            fontWeight: 500
                        }}
                    >
                        Welcome back! Here's your platform overview.
                    </Typography>
                </Box>

                {/* Main Stats Grid */}
                <Grid container spacing={3} mb={4}>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <StatCard
                            icon="wc"
                            title="Total Brides"
                            count={counts.totalBrides}
                            color="#FF6B9D"
                            label="Verified Profiles"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <StatCard
                            icon="wc"
                            title="Total Grooms"
                            count={counts.totalGrooms}
                            color="#4A90E2"
                            label="Verified Profiles"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <StatCard
                            icon="storefront"
                            title="Total Business"
                            count={counts.totalBusiness}
                            color="#F5A623"
                            label="Approved Businesses"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <StatCard
                            icon="event"
                            title="Total Events"
                            count={counts.totalEvents}
                            color="#7ED321"
                            label="All Scheduled"
                        />
                    </Grid>
                </Grid>

                {/* Pending Items Section */}
                <Typography
                    sx={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#2c3e50",
                        marginTop: "40px",
                        marginBottom: "20px"
                    }}
                >
                    Awaiting Approval
                </Typography>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <StatCard
                            icon="business_center"
                            title="Pending Business"
                            count={counts.pendingBusinessRequests}
                            color="#E74C3C"
                            label="Action Required"
                            onClick={() => navigate('/admin/business/pending')}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <StatCard
                            icon="person_add"
                            title="Pending Profiles"
                            count={counts.pendingProfiles}
                            color="#9B59B6"
                            label="Action Required"
                            onClick={() => navigate('/admin/matrimony/pending')}
                        />
                    </Grid>
                </Grid>

                {/* Quick Stats Footer */}
                <Box
                    sx={{
                        marginTop: "50px",
                        padding: "24px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "12px",
                        borderLeft: "4px solid #4A90E2"
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "14px",
                            color: "#34495e",
                            fontWeight: 500,
                            lineHeight: "1.6"
                        }}
                    >
                        <strong>Total Members:</strong> {counts.totalBrides + counts.totalGrooms} |{" "}
                        <strong>Total Listings:</strong> {counts.totalBusiness + counts.totalEvents} |{" "}
                        <strong>Pending Review:</strong> {counts.pendingBusinessRequests + counts.pendingProfiles}
                    </Typography>
                </Box>
            </MDBox>
        </DashboardLayout>
    );
}

export default Dashboard;
