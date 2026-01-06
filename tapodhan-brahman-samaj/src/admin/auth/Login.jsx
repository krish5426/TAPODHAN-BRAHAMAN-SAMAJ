import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";
import MDInput from "../components/MDInput";
import MDButton from "../components/MDButton";
import BasicLayout from "./components/BasicLayout";
import bgImage from "../assets/images/bg-sign-in-basic.jpeg";
import Alert from "@mui/material/Alert";

function Login() {
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSetRememberMe = () => setRememberMe(!rememberMe);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:3001/main-admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Success: Store token and admin details
                localStorage.setItem("admin_token", data.token);
                localStorage.setItem("admin_details", JSON.stringify(data.admin));
                navigate("/admin/dashboard");
            } else {
                // Error from backend
                setError(data.message || "Login failed. Please check credentials.");
            }

        } catch (err) {
            console.error(err);
            setError("Network error. Please make sure the server is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <BasicLayout image={bgImage}>
            <Card>
                <MDBox
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                    mx={2}
                    mt={-3}
                    p={2}
                    mb={1}
                    textAlign="center"
                >
                    <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                        Super Admin Login
                    </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <MDBox component="form" role="form" onSubmit={handleLogin}>
                        {error && (
                            <MDBox mb={2}>
                                <Alert severity="error">{error}</Alert>
                            </MDBox>
                        )}
                        <MDBox mb={2}>
                            <MDInput
                                type="email"
                                label="Email"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="password"
                                label="Password"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </MDBox>
                        <MDBox display="flex" alignItems="center" ml={-1}>
                            <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                            <MDTypography
                                variant="button"
                                fontWeight="regular"
                                color="text"
                                onClick={handleSetRememberMe}
                                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                            >
                                &nbsp;&nbsp;Remember me
                            </MDTypography>
                        </MDBox>
                        <MDBox mt={4} mb={1}>
                            <MDButton
                                variant="gradient"
                                color="info"
                                fullWidth
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
        </BasicLayout>
    );
}

export default Login;
