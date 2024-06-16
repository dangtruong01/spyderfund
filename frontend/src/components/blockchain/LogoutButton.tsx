import React from 'react';
import { useNavigate } from 'react-router-dom'; // If you're using react-router

interface LogoutButtonProps {
    onLoggedOut: () => void; // This function will handle any additional cleanup
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLoggedOut }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove the token from local storage or wherever it's stored
        localStorage.removeItem('token');

        // Call the onLoggedOut prop function to handle any additional cleanup
        onLoggedOut();

        // Redirect the user to the login page or home page
        navigate('/'); // Using React Router's useHistory hook
    };

    return (
        <button className="text-white" onClick={handleLogout}>
            <img src="src/assets/logout.svg" />
        </button>
    );
};

export default LogoutButton;
