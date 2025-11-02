import { useRef } from "react";
import { NavLink } from "react-router-dom";

export default function AuthSide({ isOpen, onClose }) {
    const sidebarRef = useRef();

    if (!isOpen) return null;

    return (
        <div className="modal-overlay side" onClick={onClose}>
            <div
                className="sidebar auth"
                ref={sidebarRef}
                onClick={(e) => e.stopPropagation()}
            >
                <NavLink to="/" className="btn" onClick={onClose}>
                    Home
                </NavLink>
                <NavLink to="/support" className="btn" onClick={onClose}>
                    Support
                </NavLink>
                <NavLink to="/about" className="btn" onClick={onClose}>
                    About
                </NavLink>
            </div>
        </div>
    );
}