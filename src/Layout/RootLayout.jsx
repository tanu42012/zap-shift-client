import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Pages/Home/Shared/Navbar/Navbar';
import Footer from '../Pages/Home/Shared/Navbar/Footer/Footer';

const RootLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;