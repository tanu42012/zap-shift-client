import {createBrowserRouter} from "react-router";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home/Home";
import AuthLayout from "../Layout/AuthLayout";
import Login from "../Pages/Home/Authtentication/Login/Login";

import Coverage from "../Pages/Home/Coverage/Coverage";
import PrivateRoute from "../routes/PrivateRoute";
import SendParcel from "../Pages/SendPercel/SendParcel";
import DashboardLayout from "../Layout/DashboardLayout";
import MyParcels from "../Pages/Dashboard/MyParcels/MyParcels";
import Register from "../Pages/Home/Authtentication/Register/Register";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import TrackParcel from "../Pages/Dashboard/TrackParcel/TrackParcel";
import BeARider from "../Pages/Dashboard/BeARider/BeARider";
import PendingRiders from "../Pages/Dashboard/PendingRiders/PendingRiders";
import ActiveRiders from "../Pages/Dashboard/ActiveRiders/ActiveRiders";
import MakeAdmin from "../Pages/Dashboard/MakeAdmin/MakeAdmin";
import Forbidden from "../Pages/Forbidden/Forbidden";
import AdminRoute from "../routes/AdminRoute";
import AssignRider from "../Pages/Dashboard/AssignRider/AssignRider";

export const router = createBrowserRouter([
    {
      path: "/",
      Component: RootLayout,
      children :[
        {
            index:true,
            Component:Home,
        },
        {
          path:'coverage',
          Component:Coverage,
          loader:()=>fetch('./serviceCenter.json')
        },
        {
          path:'forbidden',
          Component:Forbidden,

        },
        {
          path:'beARider',
          element:<PrivateRoute>
            <BeARider></BeARider>
          </PrivateRoute>,
           loader:()=>fetch('./serviceCenter.json')

        },
        {
          path:'sendParcel',
          element:<PrivateRoute>
            <SendParcel></SendParcel>
          </PrivateRoute>,
          loader:()=>fetch('./serviceCenter.json')
        }

      ]
    },
    {
      path:'/',
      Component:AuthLayout,
      children:[
        {
          path:'/login',
          Component:Login,
        },
        {
          path:'/register',
          Component:Register,

        }
      ]
    },
    {
      path:'/dashboard',
      element:<PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>,
      children:[

        {
          path:'myParcels',
          Component: MyParcels,

        },
        {
          path: 'payment/:parcelId',

          Component: Payment,
        },
        {
          path:'paymentHistory',
          Component:PaymentHistory,
        },
        {
          path:'track',
          Component:TrackParcel,
        },
        {
          path:'assign-rider',
          element:<AdminRoute>
            <AssignRider></AssignRider>
          </AdminRoute>

        },
        {
          path: 'pending-riders',
         
          element:<AdminRoute>
            <PendingRiders></PendingRiders>

          </AdminRoute>
          
        },
        {
          path:'active-riders',
        
          element:<AdminRoute>
            <ActiveRiders></ActiveRiders>
          </AdminRoute>
        },
        {
          path:'make-admin',
         element:<AdminRoute>
          <MakeAdmin></MakeAdmin>
         </AdminRoute>

        }
      ]
     
    }
  ]);
  