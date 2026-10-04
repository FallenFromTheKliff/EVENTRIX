import '../../css/components/auth/authbox.css';

import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare, FaApple } from "react-icons/fa";

import { useState } from 'react';
import authService from '../../api/authService';

export default function LoginForm({ onClose, onOpenRegister, onSubmit }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill in all fields!");
            return;
        }
        try {
            const data = await authService.login({ email, password });
            localStorage.setItem("token", data.jwt);
            if (onSubmit) onSubmit({ email, password, token: data.jwt });
        } catch (err) {
            setError("Invalid email or password.");
        }
    };

    return (
        <div className="modal-overlay auth" onClick={onClose}>
            <div className="modal auth-box login" onClick={(stop) => stop.stopPropagation()}>
                <h2>SIGN IN</h2>
                {error && <div className="auth-msg error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(data) => setEmail(data.target.value)}
                    />
                    <label>Password:</label>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(data) => setPassword(data.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                        LOG IN
                    </button>
                    <div className="check">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                        />
                        <label>Remember Me</label>
                    </div>
                    <hr/>
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
                    Don't have an account?{" "}
                    <span className="link link-register"
                        onClick={() => {
                        onClose();
                        onOpenRegister();
                    }}>
                        Sign Up!
                    </span>
                </p>
            </div>
        </div>
    );
}