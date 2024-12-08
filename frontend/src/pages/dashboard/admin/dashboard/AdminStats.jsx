import React from 'react'
//for admin
const AdminStats = ({stats}) => {
  console.log(stats)
  return (
    <div className="my-5 space-y-4">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <div className="bg-black border border-gray-700 shadow-md rounded-lg p-6 ">
          <h2 className="text-xl text-white  font-semibold mb-2">Total Earning</h2>
          <p className="text-2xl text-gray-400 font-bold">${Math.round(stats.totalEarnings)}</p>
        </div>
        <div className="bg-black border border-gray-700 shadow-md rounded-lg p-6 ">
          <h2 className="text-xl text-white  font-semibold mb-2">All Orders</h2>
          <p className="text-2xl text-gray-400 font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-black border border-gray-700 shadow-md rounded-lg p-6 ">
          <h2 className="text-xl text-white  font-semibold mb-2">All Users</h2>
          <p className="text-2xl text-gray-400 font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-black border border-gray-700 shadow-md rounded-lg p-6 ">
          <h2 className="text-xl text-white  font-semibold mb-2">Total Products</h2>
          <p className="text-2xl text-gray-400 font-bold">{stats.totalProducts}</p>
        </div>
      </div>
    </div>
  )
}

export default AdminStats