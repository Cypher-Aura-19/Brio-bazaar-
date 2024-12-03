import React from 'react'
import { useLogoutUserMutation } from '../../redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

const AdminDashboard = () => {
    const [logoutUser] = useLogoutUserMutation();
    const dispatch = useDispatch();

    const handleLogout = async () => {
      try {
        await logoutUser().unwrap();
        dispatch(logout());
      } catch (err) {
        console.error("Failed to logout:", err);
      }
    };

    return (
        <div className="space-y-5 bg-black text-white p-8 md:h-screen flex flex-col justify-between">
            <div>
                <div className="nav__logo">
                    <Link to="/" >Lebaba<span>.</span></Link>
                    <p className="text-xs italic">Admin dashboard</p>
                </div>
                <hr className="mt-5"/>
                <ul className="space-y-5 pt-5">
                    <li>
                        <NavLink
                            to="/dashboard/admin"
                            className={({ isActive }) =>
                                isActive ? "text-white font-bold" : "text-gray-400"
                            }
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/dashboard/add-new-post"
                            className={({ isActive }) =>
                                isActive ? "text-white font-bold" : "text-gray-400"
                            }
                        >
                            Add New Post
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/dashboard/manage-products"
                            className={({ isActive }) =>
                                isActive ? "text-white font-bold" : "text-gray-400"
                            }
                        >
                            Manage Products
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/dashboard/manage-sellers"  
                            className={({ isActive }) =>
                                isActive ? "text-white font-bold" : "text-gray-400"
                            }
                        >
                            Manage Sellers
                        </NavLink>
                    </li>
                    <li className="mb-3">
                        <NavLink
                            to="/dashboard/users"
                            className={({ isActive }) =>
                                isActive ? "text-white font-bold" : "text-gray-400"
                            }
                        >
                            Users
                        </NavLink>

                        
                    </li>

                    <li className="mb-3">
                        <NavLink
                            to="/dashboard/add-promotion"
                            className={({ isActive }) =>
                                isActive ? "text-white font-bold" : "text-gray-400"
                            }
                        >
                            Add Promotion
                        </NavLink>
                    </li>

                    <li className="mb-3">
                        <NavLink
                            to="/dashboard/manage-promotions"
                            className={({ isActive }) =>
                                isActive ? "text-white font-bold" : "text-gray-400"
                            }
                        >
                            Manage Promotiions
                        </NavLink>
                    </li>

                    <li className="mb-3">
                        <NavLink
                            to="/dashboard/manage-orders"
                            className={({ isActive }) =>
                                isActive ? "text-white font-bold" : "text-gray-400"
                            }
                        >
                            Manage Orders
                        </NavLink>
                    </li>
                </ul>
            </div>

            <div className="mb-3">
                <hr className="mb-3"/>
                <button 
                    onClick={handleLogout}
                    className="text-white bg-red-500 font-medium px-5 py-1 rounded-sm">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
