const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getAuthHeaders = () => {
    const token = localStorage.getItem("admin_token");
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
    };
};

const handleResponse = async (response) => {
    if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_details");
        // Force redirect to login
        window.location.href = "/admin/login";
        throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Request failed");
    }

    return await response.json();
};

export const fetchDashboardCounts = async () => {
    try {
        const response = await fetch(`${API_URL}/api/admin/dashboard/counts`, {
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("fetchDashboardCounts error:", error);
        throw error;
    }
};

export const fetchAdminBrides = async () => {
    try {
        const response = await fetch(`${API_URL}/api/admin/brides`, {
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("fetchAdminBrides error:", error);
        throw error;
    }
};

export const fetchAdminGrooms = async () => {
    try {
        const response = await fetch(`${API_URL}/api/admin/grooms`, {
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("fetchAdminGrooms error:", error);
        throw error;
    }
};

export const fetchAdminEvents = async () => {
    try {
        const response = await fetch(`${API_URL}/api/admin/events`, {
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("fetchAdminEvents error:", error);
        throw error;
    }
};

export const addAdminEvent = async (formData) => {
    try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(`${API_URL}/api/admin/events`, {
            method: "POST",
            headers: {
                "Authorization": token ? `Bearer ${token}` : "",
            },
            body: formData
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("addAdminEvent error:", error);
        throw error;
    }
};

export const updateAdminEvent = async (id, formData) => {
    try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(`${API_URL}/api/admin/events/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": token ? `Bearer ${token}` : "",
            },
            body: formData
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("updateAdminEvent error:", error);
        throw error;
    }
};

export const deleteAdminEvent = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/admin/events/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("deleteAdminEvent error:", error);
        throw error;
    }
};

// Update Profile API
export const updateAdminProfile = async (id, formData) => {
    try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(`${API_URL}/main-admin/edit-profile/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": token ? `Bearer ${token}` : "",
            },
            body: formData
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("updateAdminProfile error:", error);
        throw error;
    }
};

// Update Business API
export const updateAdminBusiness = async (id, formData) => {
    try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(`${API_URL}/api/admin/business/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": token ? `Bearer ${token}` : "",
            },
            body: formData
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("updateAdminBusiness error:", error);
        throw error;
    }
};

export const fetchAdminProfileById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/admin/profiles/${id}`, {
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("fetchAdminProfileById error:", error);
        throw error;
    }
};

export const fetchAdminBusinessById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/admin/business/${id}`, {
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("fetchAdminBusinessById error:", error);
        throw error;
    }
};

export const fetchAdminBusiness = async () => {
    try {
        const response = await fetch(`${API_URL}/api/admin/business`, {
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error("fetchAdminBusiness error:", error);
        throw error;
    }
};

export { API_URL };
