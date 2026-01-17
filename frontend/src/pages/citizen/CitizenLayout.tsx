import { Outlet } from 'react-router-dom';
import {
    Home, Grid3X3, FileText, MapPin, BookOpen, LayoutDashboard,
    Search, Bell, Moon, Menu
} from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import './CitizenDashboard.css';

// Sidebar Component
const Sidebar = () => {
    const navItems = [
        { icon: <Home className="nav-icon" />, label: "myJanSetu", active: true },
        { icon: <Grid3X3 className="nav-icon" />, label: "Services" },
        { icon: <FileText className="nav-icon" />, label: "DigiLocker" },
        { icon: <MapPin className="nav-icon" />, label: "State" },
        { icon: <BookOpen className="nav-icon" />, label: "Schemes" },
        { icon: <LayoutDashboard className="nav-icon" />, label: "Dashboard" },
    ];

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <a href="#" className={`nav-item ${item.active ? 'active' : ''}`}>
                                {item.icon}
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

// Header Component
const Header = () => {
    const { user, logout } = useAuth();

    // Get user initials for avatar
    const getUserInitials = () => {
        if (user?.aadhar) {
            // Use first two characters of Aadhar or name if available
            return user.aadhar.substring(0, 2).toUpperCase();
        }
        return 'U';
    };

    // Get user display name
    const getUserName = () => {
        if (user?.aadhar) {
            return `${user.aadhar.substring(0, 4)}...`;
        }
        return 'User';
    };

    return (
        <header className="header">
            <div className="header-left">
                <button className="icon-btn">
                    <Menu className="w-5 h-5" />
                </button>
                <div className="logo">
                    <div className="logo-icon">
                        <span>J</span>
                    </div>
                    <span className="logo-text">JanSetu</span>
                </div>
            </div>

            <div className="search-container">
                <div className="search-box">
                    <Search className="search-icon" />
                    <input type="text" placeholder='Search For "EPFO"' className="search-input" />
                </div>
            </div>

            <div className="header-right">
                <button className="icon-btn">
                    <Bell className="w-5 h-5" />
                </button>
                <button className="icon-btn">
                    <Moon className="w-5 h-5" />
                </button>
                <div className="user-info">
                    <div className="avatar">{getUserInitials()}</div>
                    <span className="user-name">{getUserName()}</span>
                </div>
                <button onClick={logout} className="icon-btn logout-btn" title="Logout">
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Logout</span>
                </button>
            </div>
        </header>
    );
};

const CitizenLayout = () => {
    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-container">
                <Header />
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default CitizenLayout;
