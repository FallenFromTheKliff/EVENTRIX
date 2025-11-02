import axiosClient from './api/axiosClient';
import authService from './api/authService';
import { jwtDecode } from 'jwt-decode';
import { useState, Navigate } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AboutUs from './pages/public/AboutUs';
import Landing from './pages/public/Landing';
import Support from './pages/public/Support';

import UserEvents from './pages/user/Events';
import UserView from './pages/user/ViewEvent';
import UserBookings from './pages/user/Bookings';
import UserCart from './pages/user/Cart';

import AdminDashboard from './pages/admin/Dashboard';
import AdminEvents from './pages/admin/Events';
import AdminManageEvents from './pages/admin/ManageEvents';
import AdminLogs from './pages/admin/Transactions';

function App() {
    const [userRole, setUserRole] = useState(null);

    const ProtectedRoute = ({ children, allowedRoles }) => {
        const token = localStorage.getItem("token");
        if (!token) {return <Navigate to="/" replace />;}
        if (!userRole || (allowedRoles && !allowedRoles.includes(userRole))) {
            return <Navigate to="/" replace />;
        }
        return children;
    };

    const handleLogin = async(credentials) => {
        try {
            const data = await authService.login(credentials);
            const token = data.jwt;
            localStorage.setItem("token", token);
            axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
            
            const decoded = jwtDecode(token);
            const role = decoded.role === "ROLE_ADMIN" ? "Admin" : "User";
            setUserRole(role);

            if (role === "Admin") {
                window.location.href = './pages/admin/Dashboard';
            } else {
                window.location.href = './pages/user/Events';
            }
        } catch (err) {
            alert("Invalid credentials!");
        }
    };

    const handleLogout = () => {
        setUserRole(null);
    }
    
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing onAuthSuccess={handleLogin} currentRole={userRole} onLogout={handleLogout} />} />
                <Route path="/support" element={<Support />} />
                <Route path="/about" element={<AboutUs />} />

                {/* User Routes */}
                <Route path="/user/events" element={
                    <ProtectedRoute allowedRoles={['User']}>
                        <UserEvents />
                    </ProtectedRoute>
                } />
                <Route path="/user/viewevent/:id" element={
                    <ProtectedRoute allowedRoles={['User']}>
                        <UserView />
                    </ProtectedRoute>
                } />
                <Route path="/user/bookings" element={
                    <ProtectedRoute allowedRoles={['User']}>
                        <UserBookings />
                    </ProtectedRoute>
                } />
                <Route path="/user/cart" element={
                    <ProtectedRoute allowedRoles={['User']}>
                        <UserCart />
                    </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/admin/events" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <AdminEvents />
                    </ProtectedRoute>
                } />
                <Route path="/admin/manageevents/:id" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <AdminManageEvents />
                    </ProtectedRoute>
                } />
                <Route path="/admin/logs" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <AdminLogs />
                    </ProtectedRoute>
                } />

                <Route path="*" element={
                    <h1 style={{ textAlign: 'center', color: 'var(--text-primary)' }}>
                        404 ERROR: Page Not Found Bro!
                    </h1>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;