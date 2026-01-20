import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MDButton from './MDButton';
import MDTypography from './MDTypography';
import MDBox from './MDBox';
import Icon from '@mui/material/Icon';

const AdminCustomDialog = ({ isOpen, onClose, message, type = 'success' }) => {
    const getDialogConfig = () => {
        switch (type) {
            case 'success':
                return {
                    color: 'success',
                    icon: 'check_circle',
                    title: 'Success!'
                };
            case 'error':
                return {
                    color: 'error',
                    icon: 'error',
                    title: 'Error!'
                };
            case 'info':
                return {
                    color: 'info',
                    icon: 'info',
                    title: 'Information'
                };
            default:
                return {
                    color: 'success',
                    icon: 'check_circle',
                    title: 'Success!'
                };
        }
    };

    const config = getDialogConfig();

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <MDBox display="flex" alignItems="center" gap={1}>
                    <Icon color={config.color} fontSize="large">{config.icon}</Icon>
                    <MDTypography variant="h5" color={config.color}>
                        {config.title}
                    </MDTypography>
                </MDBox>
            </DialogTitle>
            <DialogContent>
                <MDTypography variant="body1" color="text">
                    {message}
                </MDTypography>
            </DialogContent>
            <DialogActions>
                <MDButton variant="gradient" color="info" onClick={onClose}>
                    OK
                </MDButton>
            </DialogActions>
        </Dialog>
    );
};

export default AdminCustomDialog;