import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";
import MDButton from "../components/MDButton";
import MDInput from "../components/MDInput";
import AdminLayout from "../layout/AdminLayout";
import Header from "../layout/Header";
import MDAvatar from "../components/MDAvatar";

import {
    fetchAdminEvents,
    addAdminEvent,
    updateAdminEvent,
    deleteAdminEvent,
    API_URL
} from "../services/api";

function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        description: "",
        category: "",
        details: "",
        address: ""
    });
    const [selectedImages, setSelectedImages] = useState([]); // Event images (multiple)
    const [previewImages, setPreviewImages] = useState([]); // URLs for preview
    const [existingImages, setExistingImages] = useState([]); // URLs from backend (for edit mode)
    const [selectedPoster, setSelectedPoster] = useState(null); // Poster image (single)
    const [previewPoster, setPreviewPoster] = useState(null); // URL for poster preview
    const [existingPoster, setExistingPoster] = useState(null); // Existing poster from backend

    // Load Events
    const loadEvents = async () => {
        try {
            setLoading(true);
            const data = await fetchAdminEvents();
            setEvents(data);
        } catch (error) {
            console.error("Failed to load events", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
    }, []);

    // Handle Poster Image Selection
    const handlePosterChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedPoster(file);
            setPreviewPoster(URL.createObjectURL(file));
        }
    };

    // Handle Event Images Selection
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + selectedImages.length + existingImages.length > 5) {
            alert("Maximum 5 event images allowed total.");
            return;
        }

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setSelectedImages([...selectedImages, ...files]);
        setPreviewImages([...previewImages, ...newPreviews]);
    };

    // Remove Selected Image
    const removeSelectedImage = (index) => {
        const newSelected = [...selectedImages];
        const newPreviews = [...previewImages];
        newSelected.splice(index, 1);
        newPreviews.splice(index, 1);
        setSelectedImages(newSelected);
        setPreviewImages(newPreviews);
    };

    // Remove Existing Image (Edit Mode)
    const removeExistingImage = (index) => {
        const newExisting = [...existingImages];
        newExisting.splice(index, 1);
        setExistingImages(newExisting);
    };

    // Reset Form
    const resetForm = () => {
        setFormData({ 
            title: "", 
            date: "", 
            description: "",
            category: "",
            details: "",
            address: ""
        });
        setSelectedImages([]);
        setPreviewImages([]);
        setExistingImages([]);
        setSelectedPoster(null);
        setPreviewPoster(null);
        setExistingPoster(null);
        setShowForm(false);
        setEditMode(false);
        setEditId(null);
    };

    // Submit Form (Add or Update)
    const handleSubmit = async () => {
        if (!formData.title || !formData.date) {
            alert("Title and Date are required!");
            return;
        }

        const submitData = new FormData();
        submitData.append("title", formData.title);
        submitData.append("date", formData.date);
        submitData.append("description", formData.description);
        submitData.append("category", formData.category);
        submitData.append("details", formData.details);
        submitData.append("address", formData.address);

        // Append poster image
        if (selectedPoster) {
            submitData.append("posterImage", selectedPoster);
        }

        // Append event images
        selectedImages.forEach((file) => {
            submitData.append("images", file);
        });

        // Append existing images (for update)
        if (editMode) {
            existingImages.forEach((img) => {
                submitData.append("existingImages", img);
            });
        }

        try {
            if (editMode) {
                await updateAdminEvent(editId, submitData);
                alert("Event updated successfully!");
            } else {
                await addAdminEvent(submitData);
                alert("Event added successfully!");
            }
            loadEvents();
            resetForm();
        } catch (error) {
            alert("Failed to save event. Check console.");
        }
    };

    // Handle Edit Click
    const handleEdit = (event) => {
        setFormData({
            title: event.title,
            date: event.date.split("T")[0], // Format date for input
            description: event.description || "",
            category: event.category || "",
            details: event.details || "",
            address: event.address || ""
        });
        setExistingImages(event.images || []);
        setExistingPoster(event.posterImage || null);
        setSelectedImages([]);
        setPreviewImages([]);
        setSelectedPoster(null);
        setPreviewPoster(null);
        setEditId(event.id);
        setEditMode(true);
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    // Handle Delete Click
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await deleteAdminEvent(id);
                loadEvents();
            } catch (error) {
                alert("Failed to delete event.");
            }
        }
    };

    return (
        <AdminLayout>
            <Header />
            <MDBox py={3}>
                <MDBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
                    <MDTypography variant="h3" fontWeight="bold">
                        Events Management
                    </MDTypography>
                    <MDButton variant="gradient" color="info" onClick={() => { resetForm(); setShowForm(!showForm); }}>
                        {showForm ? "Cancel" : "Add New Event"}
                    </MDButton>
                </MDBox>

                {/* ADD / EDIT FORM */}
                {showForm && (
                    <Card sx={{ mb: 3, p: 3 }}>
                        <MDTypography variant="h6" mb={2}>
                            {editMode ? "Edit Event" : "Add New Event"}
                        </MDTypography>
                        <MDBox display="flex" flexDirection="column" gap={2}>
                            <MDInput
                                label="Event Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                            <MDInput
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                            <MDInput
                                label="Category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            />
                            <MDInput
                                label="Description"
                                multiline rows={2}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                            <MDInput
                                label="Details"
                                multiline rows={3}
                                value={formData.details}
                                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                            />
                            <MDInput
                                label="Address"
                                multiline rows={2}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />

                            {/* Poster Image Upload */}
                            <MDBox>
                                <MDTypography variant="button" fontWeight="medium">Upload Poster Image</MDTypography>
                                <input type="file" accept="image/*" onChange={handlePosterChange} style={{ display: "block", marginTop: "10px" }} />
                                
                                <MDBox display="flex" gap={2} mt={2}>
                                    {/* Existing Poster (Edit Mode) */}
                                    {existingPoster && (
                                        <MDBox position="relative">
                                            <img src={`${API_URL}/uploads/${existingPoster}`} alt="existing poster" style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8, border: "2px solid green" }} />
                                            <MDTypography variant="caption" display="block" textAlign="center">Current Poster</MDTypography>
                                        </MDBox>
                                    )}
                                    
                                    {/* New Poster Preview */}
                                    {previewPoster && (
                                        <MDBox position="relative">
                                            <img src={previewPoster} alt="poster preview" style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8 }} />
                                            <MDTypography variant="caption" display="block" textAlign="center">New Poster</MDTypography>
                                        </MDBox>
                                    )}
                                </MDBox>
                            </MDBox>

                            {/* Event Images Upload */}
                            <MDBox>
                                <MDTypography variant="button" fontWeight="medium">Upload Event Images (Max 5)</MDTypography>
                                <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: "block", marginTop: "10px" }} />

                                <MDBox display="flex" gap={2} mt={2} flexWrap="wrap">
                                    {/* Existing Images (Edit Mode) */}
                                    {existingImages.map((img, idx) => (
                                        <MDBox key={`exist-${idx}`} position="relative">
                                            <img src={`${API_URL}/uploads/${img}`} alt="existing" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "2px solid green" }} />
                                            <Icon
                                                onClick={() => removeExistingImage(idx)}
                                                sx={{ position: "absolute", top: -10, right: -10, cursor: "pointer", color: "red", backgroundColor: "white", borderRadius: "50%" }}
                                            >cancel</Icon>
                                        </MDBox>
                                    ))}

                                    {/* New Selected Images */}
                                    {previewImages.map((src, idx) => (
                                        <MDBox key={`new-${idx}`} position="relative">
                                            <img src={src} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }} />
                                            <Icon
                                                onClick={() => removeSelectedImage(idx)}
                                                sx={{ position: "absolute", top: -10, right: -10, cursor: "pointer", color: "red", backgroundColor: "white", borderRadius: "50%" }}
                                            >cancel</Icon>
                                        </MDBox>
                                    ))}
                                </MDBox>
                            </MDBox>

                            <MDButton variant="gradient" color="success" onClick={handleSubmit}>
                                {editMode ? "Update Event" : "Save Event"}
                            </MDButton>
                        </MDBox>
                    </Card>
                )}

                {/* EVENTS LIST */}
                <Grid container spacing={3}>
                    {loading ? (
                        <MDTypography p={3}>Loading events...</MDTypography>
                    ) : events.length === 0 ? (
                        <MDTypography p={3}>No events found. Add one!</MDTypography>
                    ) : (
                        events.map((evt) => (
                            <Grid key={evt.id} item xs={12} md={6} lg={4}>
                                <Card>
                                    <MDBox position="relative">
                                        {evt.posterImage ? (
                                            <img
                                                src={`${API_URL}/uploads/${evt.posterImage}`}
                                                alt={evt.title}
                                                style={{ width: "100%", height: "180px", objectFit: "cover", borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}
                                            />
                                        ) : (
                                            <MDBox height="180px" bgColor="grey-200" display="flex" alignItems="center" justifyContent="center" borderRadius="12px 12px 0 0">
                                                <Icon fontSize="large" color="disabled">image</Icon>
                                            </MDBox>
                                        )}
                                    </MDBox>
                                    <MDBox p={2}>
                                        <MDTypography variant="h5" fontWeight="medium">{evt.title}</MDTypography>
                                        <MDTypography variant="caption" color="text" fontWeight="bold">
                                            {new Date(evt.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - {new Date(evt.date).toLocaleDateString()}
                                        </MDTypography>
                                        <MDTypography variant="button" color="info" fontWeight="bold" display="block" mt={0.5}>
                                            {evt.category}
                                        </MDTypography>
                                        <MDTypography variant="body2" mt={1} sx={{
                                            display: '-webkit-box',
                                            overflow: 'hidden',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 2,
                                        }}>
                                            {evt.description}
                                        </MDTypography>
                                    </MDBox>
                                    <MDBox p={2} pt={0} display="flex" justifyContent="flex-end" gap={1}>
                                        <MDButton variant="text" color="info" size="small" onClick={() => handleEdit(evt)}>Edit</MDButton>
                                        <MDButton variant="text" color="error" size="small" onClick={() => handleDelete(evt.id)}>Delete</MDButton>
                                    </MDBox>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            </MDBox>
        </AdminLayout>
    );
}

export default Events;
