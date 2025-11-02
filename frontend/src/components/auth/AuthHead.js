import landingLogo from '../../assets/images/eventrix_light.png';
import { FaBars } from 'react-icons/fa';

import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import AuthSide from '../../components/auth/AuthSide';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';

export default function AuthHead() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const handleOpenLogin = () => {
        setShowLogin(true);
        setShowRegister(false);
    };

    const handleOpenRegister = () => {
        setShowRegister(true);
        setShowLogin(false);
    };

    const handleCloseAuth = () => {
        setShowLogin(false);
        setShowRegister(false);
    };

    const handleSubmitAuth = async(data) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            if (data.token) {
                localStorage.setItem("token", data.token);
            }
        } catch (err) {
            console.error("Auth error:", err);
        } finally {
            handleCloseAuth();
        }
    };

    return (
        <>
            <div className="header">
                <div className="header-left">
                    <button className="header-hamburger" onClick={toggleSidebar}>
                        <FaBars size={28} />
                    </button>
                    <div className="logo">
                        <img src={landingLogo} alt="EVENTRIX" />
                    </div>
                </div>

                <div className="header-right">
                    <nav className="header-nav">
                        <NavLink to="/" className="btn">
                            Home
                        </NavLink>
                        <NavLink to="/support" className="btn">
                            Support
                        </NavLink>
                        <NavLink to="/about" className="btn">
                            About
                        </NavLink>
                    </nav>
                    <button
                        className="btn-auth land btn-primary"
                        onClick={handleOpenLogin}
                    >
                        LOGIN
                    </button>
                    <button
                        className="btn-auth land btn-secondary"
                        onClick={handleOpenRegister}
                    >
                        REGISTER
                    </button>
                </div>
            </div>

            <AuthSide isOpen={isSidebarOpen} onClose={closeSidebar} />

            {showLogin && (
                <LoginForm
                    onClose={handleCloseAuth}
                    onOpenRegister={handleOpenRegister}
                    onSubmit={handleSubmitAuth}
                />
            )}
            {showRegister && (
                <RegisterForm
                    onClose={handleCloseAuth}
                    onOpenLogin={handleOpenLogin}
                    onSubmit={handleSubmitAuth}
                />
            )}
        </>
    );
}