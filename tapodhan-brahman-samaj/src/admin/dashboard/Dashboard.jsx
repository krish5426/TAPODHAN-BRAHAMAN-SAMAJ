import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../components/MDBox";
import DashboardLayout from "../layout/AdminLayout";
import DashboardNavbar from "../layout/Header";
import ComplexStatisticsCard from "../components/Cards/StatisticsCards/ComplexStatisticsCard";
import { fetchDashboardCounts } from "../services/api";

function Dashboard() {
    const [counts, setCounts] = useState({
        totalBrides: 0,
        totalGrooms: 0,
        totalBusiness: 0,
        totalEvents: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCounts = async () => {
            try {
                const data = await fetchDashboardCounts();
                setCounts(data); // Expecting { totalBrides, totalGrooms, totalBusiness, totalEvents }
            } catch (error) {
                console.error("Failed to load dashboard counts:", error);
                // Optional: Handle error UI
            } finally {
                setLoading(false);
            }
        };

        loadCounts();
    }, []);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox py={3}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="dark"
                                icon="female"
                                title="Total Brides"
                                count={loading ? "..." : counts.totalBrides}
                                percentage={{
                                    color: "success",
                                    amount: "",
                                    label: loading ? "Loading..." : "Verified Profiles",
                                }}
                            />
                        </MDBox>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="info"
                                icon="male"
                                title="Total Grooms"
                                count={loading ? "..." : counts.totalGrooms}
                                percentage={{
                                    color: "success",
                                    amount: "",
                                    label: loading ? "Loading..." : "Verified Profiles",
                                }}
                            />
                        </MDBox>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="warning"
                                icon="store"
                                title="Total Business"
                                count={loading ? "..." : counts.totalBusiness}
                                percentage={{
                                    color: "success",
                                    amount: "",
                                    label: loading ? "Loading..." : "Approved Businesses",
                                }}
                            />
                        </MDBox>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="primary"
                                icon="event"
                                title="Total Events"
                                count={loading ? "..." : counts.totalEvents}
                                percentage={{
                                    color: "success",
                                    amount: "",
                                    label: loading ? "Loading..." : "All Scheduled",
                                }}
                            />
                        </MDBox>
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
}

export default Dashboard;
