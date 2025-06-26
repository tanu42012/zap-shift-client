import {createBrowserRouter} from "react-router";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home/Home";
import AuthLayout from "../Layout/AuthLayout";
import Login from "../Pages/Home/Authtentication/Login/Login";
import Register from "../Pages/Home/Authtentication/Register/Register";
import Coverage from "../Pages/Home/Coverage/Coverage";
import PrivateRoute from "../routes/PrivateRoute";
import SendParcel from "../Pages/SendPercel/SendParcel";
import DashboardLayout from "../Layout/DashboardLayout";
import MyParcels from "../Pages/Dashboard/MyParcels/MyParcels";

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

        }
      ]
     
    }
  ]);
  