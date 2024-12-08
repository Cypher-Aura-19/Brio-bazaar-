import React from 'react';
import SellerStats from './SellerStats'; // Component to display seller stats
import { useSelector } from 'react-redux';
import { useGetAdminStatsQuery } from '../../../../redux/features/stats/statsApi';
import SellerStatsChart from './SellerStatsChart'; // Component to display seller stats chart



const SellerDMain = () => {
    const { seller } = useSelector((state) => state.sellerAuth); // Access the logged-in seller's data
    const { data: stats, error, isLoading } = useGetAdminStatsQuery(); // Fetch seller-specific stats

    if (isLoading) {
        return <p className="text-center text-gray-500">Loading seller stats...</p>;
    }

    if (!stats) {
        return <p className="text-center text-gray-500">No stats available.</p>;
    }

    return (
        <div className="p-6">
            <div>
                <h1 className="text-2xl font-semibold mb-4">Seller Dashboard</h1>
                <p className="text-gray-400">
                    Hi, {seller?.username}! Welcome to your seller dashboard.
                </p>
            </div>
            <SellerStats stats={stats} /> Display seller stats
            <SellerStatsChart stats={stats} /> Display a chart for seller stats
        </div>
    );
};

export default SellerDMain;
