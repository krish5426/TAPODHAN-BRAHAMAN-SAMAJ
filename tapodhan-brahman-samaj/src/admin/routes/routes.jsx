import Dashboard from "../dashboard/Dashboard";
import Brides from "../matrimony/Brides";
import Grooms from "../matrimony/Grooms";
import EditProfile from "../matrimony/EditProfile";
import Business from "../business/Business";
import EditBusiness from "../business/EditBusiness";
import Events from "../events/Events";
import Login from "../auth/Login";
import BusinessType from "../master/BusinessType";
import State from "../master/State";
import Location from "../master/Location";
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/admin/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Brides",
    key: "brides",
    icon: <Icon fontSize="small">woman</Icon>,
    route: "/admin/matrimony/brides",
    component: <Brides />,
  },
  {
    type: "collapse",
    name: "Grooms",
    key: "grooms",
    icon: <Icon fontSize="small">man</Icon>,
    route: "/admin/matrimony/grooms",
    component: <Grooms />,
  },
  {
    type: "collapse",
    name: "Business",
    key: "business",
    icon: <Icon fontSize="small">business</Icon>,
    route: "/admin/business",
    component: <Business />,
  },
  {
    type: "collapse",
    name: "Events",
    key: "events",
    icon: <Icon fontSize="small">event</Icon>,
    route: "/admin/events",
    component: <Events />,
  },
  {
    type: "collapse",
    name: "Master",
    key: "master",
    icon: <Icon fontSize="small">settings</Icon>,
    collapse: [
      {
        name: "Business Type",
        key: "business-type",
        route: "/admin/master/business-type",
        component: <BusinessType />,
      },
      {
        name: "State",
        key: "state",
        route: "/admin/master/state",
        component: <State />,
      },
      {
        name: "Location",
        key: "location",
        route: "/admin/master/location",
        component: <Location />,
      },
    ],
  },
  {
    type: "hidden", // Helper for routing, not sidebar
    name: "Edit Profile",
    key: "edit-profile",
    route: "/admin/matrimony/edit/:id",
    component: <EditProfile />,
  },
  {
    type: "hidden",
    name: "Edit Business",
    key: "edit-business",
    route: "/admin/business/edit/:id",
    component: <EditBusiness />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/admin/login",
    component: <Login />,
  },
];

export default routes;
