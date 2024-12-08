import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDeleteProductMutation, useFetchAllProductsQuery } from '../../../../redux/features/products/productsApi';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../../utils/dateFormater';

const ManageProducts = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);

    const { seller } = useSelector((state) => state.sellerAuth); // Get logged-in seller info

    const { data: { products = [], totalPages, totalProducts } = {}, error, isLoading, refetch } = useFetchAllProductsQuery({
        category: '',
        color: '',
        minPrice: '',
        maxPrice: '',
        page: currentPage,
        limit: productsPerPage
    });

    const [deleteProduct] = useDeleteProductMutation();

    const handleDelete = async (id) => {
        try {
            const response = await deleteProduct(id).unwrap();
            alert(response.message);
            await refetch();
        } catch (error) {
            console.error("Failed to delete the product:", error);
        }
    };

    // Debugging: Log seller ID and product author IDs
    console.log("Logged-in seller ID:", seller?.id);

    // Filter products to only show those belonging to the logged-in seller
    const sellerProducts = products.filter((product) => {
        console.log("Product Author ID:", product?.author?.id); // Debugging
        return product.author?._id === seller?._id; // Only include products where the author ID matches the seller ID
    });

    // Pagination control
    const startProduct = (currentPage - 1) * productsPerPage + 1;
    const endProduct = startProduct + sellerProducts.length - 1;

    const handlePageChange = (pageNumber) => {
        console.log(`Changing to page: ${pageNumber}`); // Debugging
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Stock threshold for "low stock"
    const LOW_STOCK_THRESHOLD = 5;

    return (
        <>
            {isLoading && <div>Loading...</div>}
            {error && <div>Failed to load products.</div>}
            <section className="py-1 bg-blueGray-50">
                <div className="w-full mb-12 xl:mb-0 px-4 mx-auto">
                    <div className="relative flex flex-col min-w-0 break-words bg-black text-white w-full mb-6 shadow-lg rounded ">
                        <div className="rounded-t mb-0 px-4 py-3 border-0">
                            <div className="flex flex-wrap items-center">
                                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                                    <h3 className="font-semibold text-base text-blueGray-700">
                                        My Products
                                    </h3>
                                </div>
                                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                                    <Link to="/shop">
                                        <button
                                            className="bg-white text-black font-semibold py-3 rounded-md transition duration-300 hover:bg-gray-200 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                        >
                                            See all
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <h3 className='text-sm my-4'>Showing {startProduct} to {endProduct} of {sellerProducts.length} products</h3>
                        </div>

                        <div className="block w-full overflow-x-auto">
                            <table className="items-center bg-transparent w-full border-collapse ">
                                <thead>
                                    <tr>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            No.
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            Product name
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            Publishing date
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            Stock Level
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            Store Name
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            Edit or manage
                                        </th>
                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                            Delete
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        sellerProducts.map((product, index) => {
                                            const isLowStock = product?.stockLevel <= LOW_STOCK_THRESHOLD;

                                            return (
                                                <tr key={index} className={isLowStock ? 'bg-red-400' : ''}>
                                                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                                                        {index + 1}
                                                    </th>
                                                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 cursor-pointer hover:text-primary">
                                                        <Link to={`/shop/${product?._id}`}>{product?.name}</Link>
                                                    </th>

                                                    <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {formatDate(product?.createdAt)}
                                                    </td>

                                                    {/* Stock Level */}
                                                    <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {product?.stockLevel}
                                                    </td>

                                                    <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {product?.author?.storeName}
                                                    </td>

                                                    <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        <Link to={`/seller/dashboard/update-product/${product?._id}`} className="hover:text-gray-400">
                                                            <span className="flex gap-1 items-center justify-center">
                                                            Edit</span>
                                                        </Link>
                                                    </td>
                                                    <td className="border-t-0  px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        <button className="bg-white text-black px-2 py-1"
                                                            onClick={() => handleDelete(product?._id)}
                                                        >Delete</button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pagination controls */}
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-300 text-black rounded-md mr-2"
                    >
                        Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-white text-black' : 'bg-black'} rounded-md mx-1`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-300 text-black rounded-md ml-2"
                    >
                        Next
                    </button>
                </div>
                <footer className="relative pt-8 pb-6 mt-16">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap items-center md:justify-between justify-center">
                            <div className="w-full md:w-6/12 px-4 mx-auto text-center">
                                <div className="text-sm text-blueGray-500 font-semibold py-1">
                                    Made with{" "}
                                    <a
                                        href="https://www.creative-tim.com/product/notus-js"
                                        className="text-blueGray-500 hover:text-gray-800"
                                        target="_blank"
                                    >
                                        Notus JS
                                    </a>{" "}
                                    by{" "}
                                    <a
                                        href="https://www.creative-tim.com"
                                        className="text-blueGray-500 hover:text-blueGray-800"
                                        target="_blank"
                                    >
                                        Md Al Mamun
                                    </a>
                                    .
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </section>
        </>
    );
};

export default ManageProducts;
