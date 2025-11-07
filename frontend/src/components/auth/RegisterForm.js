import '../../css/components/auth/authbox.css';

import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare, FaApple } from "react-icons/fa";

import { useState } from 'react';
import authService from '../../api/authService';

export default function RegisterForm({ onClose, onOpenLogin }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        password: ""
    });

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (data) => {
        const { name, value } = data.target;
        if (name === "phoneNumber") {
            const digits = value.replace(/\D/g, "").slice(0, 11);
            setFormData({ ...formData, [name]: digits });
        } else {
            setFormData({ ...formData, [name]: value});
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        const { name, email, phoneNumber, password } = formData;
        if (!name || !email || !phoneNumber || !password) {
            setError("Please fill in all fields!");
            setSuccess("");
            return;
        }
        try {
            await authService.register(formData);
            setError("");
            setSuccess("Account created!");
        } catch (err) {
            setError("Email is already in use!");
            setSuccess("");
        }
    }

    return (
        <div className="modal-overlay auth" onClick={onClose}>
            <div className="modal auth-box register" onClick={(stop) => stop.stopPropagation()}>
                <h2>SIGN UP</h2>
                {success && <div className="auth-msg registered">{success}</div>}
                {error && <div className="auth-msg unregistered">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <label>Email Address:</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="e.g. 09114274431"
                        value={formData.phoneNumber}
                        maxLength={11}
                        onChange={handleChange}
                    />
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    
                    <button type="submit" className="btn btn-secondary">
                        CREATE ACCOUNT
                    </button>
                    <br/><br/><hr/>
                </form>

                <h3>or</h3>
                <div className="socials">
                    <button className="btn btn-social">
                        <FcGoogle />
                    </button>
                    <button className="btn btn-social">
                        <FaFacebookSquare color="#1877F2" />
                    </button>
                    <button className="btn btn-social">
                        <FaApple />
                    </button>
                </div>

                <p className="sub">
                    Already have an account?{" "}
                    <span className="link link-login"
                        onClick={() => {
                        onClose();
                        onOpenLogin();
                    }}>
                        Sign In!
                    </span>
                </p>
            </div>
        </div>
    );
}