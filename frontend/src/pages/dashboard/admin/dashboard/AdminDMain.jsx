import React from 'react';
import AdminStats from './AdminStats';
import { useSelector } from 'react-redux';
import { useGetAdminStatsQuery } from '../../../../redux/features/stats/statsApi';
import AdminStatsChart from './AdminStatsChart';
//for admin
const AdminDMain = () => {
    const { user } = useSelector((state) => state.auth);
    const { data: stats, error, isLoading } = useGetAdminStatsQuery();
    console.log(stats);

    if (isLoading) {
        return <p className="text-center text-gray-500">Loading admin stats...</p>;
    }


    if (!stats) {
        return <p className="text-center text-gray-500">No stats available.</p>;
    }

    return (
        <div className="p-6">
            <div>
                <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
                <p className="text-gray-400">Hi, {user?.username}! Welcome to the admin dashboard.</p>
            </div>
            <AdminStats stats={stats} />
            <AdminStatsChart stats={stats} />
        </div>
    );
};

export default AdminDMain;
