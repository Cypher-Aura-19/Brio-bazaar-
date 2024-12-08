import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import TextInput from '../addProduct/TextInput';
import UploadImage from '../addProduct/UploadImage';
import SelectInput from '../addProduct/SelectInput';
import { useFetchProductByIdQuery, useUpdateProductMutation } from '../../../../redux/features/products/productsApi';
//for admin
const categories = [
    { label: 'Select Category', value: '' },
    { label: 'Accessories', value: 'accessories' },
    { label: 'Dress', value: 'dress' },
    { label: 'Jewellery', value: 'jewellery' },
    { label: 'Cosmetics', value: 'cosmetics' }
];

const colors = [
    { label: 'Select Color', value: '' },
    { label: 'Black', value: 'black' },
    { label: 'Red', value: 'red' },
    { label: 'Gold', value: 'gold' },
    { label: 'Blue', value: 'blue' },
    { label: 'Silver', value: 'silver' },
    { label: 'Beige', value: 'beige' },
    { label: 'Green', value: 'green' }
];

const approvedOptions = [
    { label: 'Select Approval Status', value: '' },
    { label: 'Approved', value: true },
    { label: 'Not Approved', value: false }
];

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // For navigation
    const { user } = useSelector((state) => state.auth);

    const [product, setProduct] = useState({
        name: '',
        category: '',
        color: '',
        price: '',
        stockLevel: '', // Added stockLevel field
        description: '',
        image: '', // This will store the URL or the image file
        approved: '' // Added approved field
    });
    const [newImage, setNewImage] = useState(null); // For storing the new image

    const { data: productData, isLoading: isProductLoading, error: fetchError, refetch } = useFetchProductByIdQuery(id); // Add refetch
    const { name, category, color, description, image: imageURL, price, stockLevel, approved } = productData?.product || {};

    const [updateProduct, { isLoading: isUpdating, error: updateError }] = useUpdateProductMutation();

    useEffect(() => {
        if (productData) {
            setProduct({
                name: name || '',
                category: category || '',
                color: color || '',
                price: price || '',
                stockLevel: stockLevel || '',  // Setting stockLevel
                description: description || '',
                image: imageURL || '',
                approved: approved !== undefined ? approved : '' // Set the initial value of approved
            });
        }
    }, [productData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        });
    };

    const handleImageChange = (image) => {
        setNewImage(image); // Store new image
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // If newImage is set, use it; otherwise, keep the old image URL
        const updatedProduct = {
            ...product,
            image: newImage ? newImage : product.image,
            author: user?._id
        };

        try {
            await updateProduct({ id: id, ...updatedProduct }).unwrap();
            alert('Product updated successfully!');
            await refetch();
            navigate("/dashboard/admin/manage-products");

        } catch (err) {
            console.error('Failed to update product:', err);
        }

    };

    if (isProductLoading) return <p>Loading product...</p>;
    if (fetchError) return <p className="text-red-500">Error fetching product: {fetchError.message}</p>;

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-6">Update Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* product name */}
                <TextInput
                    label="Product Name"
                    name="name"
                    placeholder="Ex: Diamond Earrings"
                    value={product.name}
                    onChange={handleChange}
                />

                {/* category */}
                <SelectInput
                    label="Category"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    options={categories}
                />

                {/* color */}
                <SelectInput
                    label="Color"
                    name="color"
                    value={product.color}
                    onChange={handleChange}
                    options={colors}
                />

                {/* price */}
                <TextInput
                    label="Price"
                    name="price"
                    type="number"
                    placeholder="50"
                    value={product.price}
                    onChange={handleChange}
                />

                {/* stock level */}
                <TextInput
                    label="Stock Level"
                    name="stockLevel"  // Added stock level input field
                    type="number"
                    placeholder="Enter stock quantity"
                    value={product.stockLevel}
                    onChange={handleChange}
                />

                {/* image upload */}
                <UploadImage
                    name="image"
                    id="image"
                    value={newImage || product.image} 
                    setImage={handleImageChange} 
                    placeholder="Upload a product image"
                />

                {/* description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-400">
                        Description
                    </label>
                    <textarea
                        rows={6}
                        name="description"
                        id="description"
                        value={product.description}
                        placeholder="Write a product description"
                        onChange={handleChange}
                        className="add-product-InputCSS bg-black text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white pl-3 pr-4 py-2 rounded-md placeholder-white w-full mt-1"
                    />
                </div>

                {/* approval status */}
                <SelectInput
                    label="Approval Status"
                    name="approved"
                    value={product.approved}
                    onChange={handleChange}
                    options={approvedOptions}
                />

                <div>
                    <button
                        type="submit"
                        className="add-product-btn"
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Updating...' : 'Update Product'}
                    </button>
                </div>
            </form>

            {updateError && <p className="text-red-500 mt-4">Error updating product: {updateError.message}</p>}
        </div>
    );
};

export default UpdateProduct;
