import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Chip from "@mui/material/Chip";
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";
import MDButton from "../components/MDButton";
import AdminLayout from "../layout/AdminLayout";
import Header from "../layout/Header";
import { fetchAdminProfileById, API_URL } from "../services/api";

function ViewProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchAdminProfileById(id);
                setProfile(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [id]);

    const formatLabel = (key) => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    const calculateAge = (dob) => {
        if (!dob) return "-";
        const birth = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'success';
            case 'pending': return 'warning';
            case 'rejected': return 'error';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <Header />
                <MDBox p={6} display="flex" justifyContent="center">
                    <MDTypography variant="h6" color="text">Loading profile...</MDTypography>
                </MDBox>
            </AdminLayout>
        );
    }

    if (!profile) {
        return (
            <AdminLayout>
                <Header />
                <MDBox p={6} display="flex" justifyContent="center">
                    <MDTypography variant="h6" color="error">Profile not found</MDTypography>
                </MDBox>
            </AdminLayout>
        );
    }

    const photoUrl = profile.profilePhoto ? `${API_URL}/uploads/profile/${profile.profilePhoto}` : null;

    const InfoItem = ({ label, value, fullWidth }) => (
        <Grid item xs={12} sm={fullWidth ? 12 : 6} md={fullWidth ? 12 : 4}>
            <MDBox mb={1.5}>
                <MDTypography variant="caption" color="text" fontWeight="medium" sx={{ textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.5px" }}>
                    {label}
                </MDTypography>
                <MDTypography variant="body2" fontWeight="regular" sx={{ mt: 0.3 }}>
                    {value || "-"}
                </MDTypography>
            </MDBox>
        </Grid>
    );

    const sections = [
        {
            title: "Personal Information",
            icon: "person",
            color: "#1976d2",
            items: [
                { label: "Full Name", value: `${profile.firstName || ''} ${profile.surname || ''}`.trim() },
                { label: "Father's Name", value: profile.fatherName },
                { label: "Gender", value: profile.gender },
                { label: "Date of Birth", value: formatDate(profile.dateOfBirth) },
                { label: "Age", value: `${calculateAge(profile.dateOfBirth)} years` },
                { label: "Time of Birth", value: profile.timeOfBirth },
                { label: "Birth Place", value: profile.birthPlace },
                { label: "Profile For", value: profile.profileFor },
                { label: "Marital Status", value: profile.maritalStatus },
                { label: "No. of Children", value: profile.noOfChildren },
            ]
        },
        {
            title: "Physical Details",
            icon: "straighten",
            color: "#9c27b0",
            items: [
                { label: "Height", value: profile.height },
                { label: "Weight", value: profile.weight },
                { label: "Physical Disability", value: profile.physicalDisability },
                { label: "Glasses", value: profile.glasses },
                { label: "Mangal", value: profile.mangal },
            ]
        },
        {
            title: "Education & Career",
            icon: "school",
            color: "#ed6c02",
            items: [
                { label: "Education", value: profile.educationQualification },
                { label: "Education Details", value: profile.educationDetails },
                { label: "Job Type", value: profile.jobType },
                { label: "Job Description", value: profile.jobDescription },
                { label: "Designation", value: profile.designation },
                { label: "Current Location", value: profile.currentLocation },
                { label: "Income Currency", value: profile.incomeCurrency },
                { label: "Monthly Income", value: profile.monthlyIncome },
            ]
        },
        {
            title: "Family Details",
            icon: "family_restroom",
            color: "#2e7d32",
            items: [
                { label: "Father's Full Name", value: profile.fatherFullName },
                { label: "Mother's Full Name", value: profile.motherFullName },
                { label: "Father's Occupation", value: profile.fatherOccupation },
                { label: "Mother's Occupation", value: profile.motherOccupation },
                { label: "Total Family Members", value: profile.totalFamilyMembers },
                { label: "Total Brothers", value: profile.totalBrothers },
                { label: "Total Sisters", value: profile.totalSisters },
                { label: "Married Brothers", value: profile.marriedBrothers },
                { label: "Married Sisters", value: profile.marriedSisters },
                { label: "Family Type", value: profile.familyType },
                { label: "Family Values", value: profile.familyValues },
                { label: "Family Location", value: profile.familyLocation },
                { label: "Native Place", value: profile.nativePlace },
                { label: "Family Wealth", value: profile.familyWealth },
            ]
        },
        {
            title: "Contact Information",
            icon: "phone",
            color: "#0288d1",
            items: [
                { label: "Contact Person", value: profile.contactPersonName },
                { label: "Relation", value: profile.contactPersonRelation },
                { label: "Phone", value: profile.contactPersonNumber },
                { label: "Email", value: profile.contactPersonEmail },
                { label: "Address", value: profile.contactPersonAddress, fullWidth: true },
            ]
        },
        {
            title: "Expectations",
            icon: "favorite",
            color: "#d32f2f",
            items: [
                { label: "Partner Expectations", value: profile.expectation, fullWidth: true },
            ]
        },
    ];

    return (
        <AdminLayout>
            <Header />
            <MDBox py={3}>
                {/* Profile Header */}
                <Card sx={{ mb: 3, overflow: "hidden" }}>
                    <MDBox
                        sx={{
                            background: profile.gender === 'Female'
                                ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            p: 4,
                            pb: 10
                        }}
                    />
                    <MDBox px={4} sx={{ mt: -7 }}>
                        <MDBox display="flex" alignItems="flex-end" gap={3} flexWrap="wrap">
                            {/* Photo */}
                            <MDBox
                                sx={{
                                    width: 130,
                                    height: 130,
                                    borderRadius: "50%",
                                    border: "5px solid #fff",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                                    overflow: "hidden",
                                    backgroundColor: "#f0f0f0",
                                    flexShrink: 0
                                }}
                            >
                                {photoUrl ? (
                                    <MDBox component="img" src={photoUrl} alt="Profile" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <MDBox display="flex" alignItems="center" justifyContent="center" height="100%">
                                        <Icon sx={{ fontSize: 50, color: "#ccc" }}>person</Icon>
                                    </MDBox>
                                )}
                            </MDBox>

                            {/* Info */}
                            <MDBox pb={1} flex={1}>
                                <MDBox display="flex" alignItems="center" gap={1} mb={0.5}>
                                    <MDTypography variant="h4" fontWeight="bold">
                                        {profile.firstName} {profile.surname}
                                    </MDTypography>
                                    <Chip
                                        label={profile.status}
                                        color={getStatusColor(profile.status)}
                                        size="small"
                                        sx={{ textTransform: "capitalize" }}
                                    />
                                </MDBox>
                                <MDTypography variant="body2" color="text" sx={{ opacity: 0.8 }}>
                                    {profile.gender} • {calculateAge(profile.dateOfBirth)} yrs • {profile.maritalStatus}
                                    {profile.currentLocation ? ` • ${profile.currentLocation}` : ""}
                                </MDTypography>
                                {profile.educationQualification && profile.educationQualification !== '-' && (
                                    <MDTypography variant="body2" color="text" sx={{ opacity: 0.7, mt: 0.5 }}>
                                        {profile.educationQualification} {profile.jobType && profile.jobType !== '-' ? `• ${profile.jobType}` : ''}
                                    </MDTypography>
                                )}
                            </MDBox>

                            {/* Actions */}
                            <MDBox pb={1} display="flex" gap={1}>
                                <MDButton variant="gradient" color="info" size="small" onClick={() => navigate(`/admin/matrimony/edit/${id}`)}>
                                    <Icon>edit</Icon>&nbsp;Edit
                                </MDButton>
                                <MDButton variant="outlined" color="dark" size="small" onClick={() => navigate(-1)}>
                                    <Icon>arrow_back</Icon>&nbsp;Back
                                </MDButton>
                            </MDBox>
                        </MDBox>
                    </MDBox>
                    <MDBox px={4} pb={3} pt={2}>
                        <Divider />
                    </MDBox>
                </Card>

                {/* Detail Sections */}
                {sections.map((section, idx) => (
                    <Card key={idx} sx={{ mb: 2, overflow: "hidden" }}>
                        <MDBox
                            px={3} py={1.5}
                            display="flex"
                            alignItems="center"
                            gap={1}
                            sx={{ backgroundColor: "#fafafa", borderBottom: "1px solid #eee" }}
                        >
                            <Icon sx={{ color: section.color, fontSize: 20 }}>{section.icon}</Icon>
                            <MDTypography variant="h6" fontWeight="bold" sx={{ color: section.color }}>
                                {section.title}
                            </MDTypography>
                        </MDBox>
                        <MDBox p={3}>
                            <Grid container spacing={1}>
                                {section.items.map((item, i) => (
                                    <InfoItem key={i} label={item.label} value={item.value} fullWidth={item.fullWidth} />
                                ))}
                            </Grid>
                        </MDBox>
                    </Card>
                ))}
            </MDBox>
        </AdminLayout>
    );
}

export default ViewProfile;
