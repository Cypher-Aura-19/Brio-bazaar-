import React, { useState } from 'react'
import { useUpdateUserRoleMutation } from '../../../../redux/features/auth/authApi';
//for admin
const UpdateUserModal = ({user, onClose, onRoleUpdate}) => {
    const [role, setRole] = useState(user.role);
    const [updateUserRole] = useUpdateUserRoleMutation();

    const handleUpdateRole = async () => {
        try {
            await updateUserRole({ userId: user._id, role }).unwrap();
            alert("User role updated successfully");
            onRoleUpdate();
            onClose();
        } catch (error) {
            console.error("Failed to update user role", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
            <div className="bg-black text-white border border-gray-700  p-4 rounded shadow-lg w-1/3">
                <h2 className="text-xl mb-4">Edit User!</h2>
                <div className="mb-4 space-y-4">
                    <label className="block text-sm font-medium text-gray-400">
                        Email:
                    </label>
                    <input
                        type="text"
                        value={user.email}
                        readOnly
                        className="mt-1 bg-black border border-gray-700 block w-full shadow-sm sm:text-sm  rounded-md py-2.5 px-5 focus:outline-none"
                    />
                </div>
                <div className="mb-4 space-y-4">
                    <label className="block text-sm font-medium text-gray-400">
                        Role:
                    </label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="block w-full shadow-sm sm:text-sm bg-black border border-gray-700 rounded-md py-2.5 px-5 focus:outline-none"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="flex justify-end pt-5">
                    <button
                        onClick={onClose}
                        className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdateRole}
                        className="bg-white text-black px-6 py-2 rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UpdateUserModal