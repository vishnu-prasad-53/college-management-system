import { useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const handleLogout = () => {
        logout();
        navigate("/login", {
            replace: true,
        });
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div>
                <h2 className="text-xl font-semibold">College Management System</h2>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;