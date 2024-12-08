import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAddProductMutation } from '../../../../redux/features/products/productsApi';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import UploadImage from './UploadImage';
import { useNavigate } from 'react-router-dom';
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

const AddProduct = () => {
    const { seller } = useSelector((state) => state.sellerAuth); // Use seller from sellerAuth
    const [product, setProduct] = useState({
        name: '',
        category: '',
        color: '',
        price: '',
        stockLevel: '',
        description: ''
    });
    const [image, setImage] = useState('');
    const [addProduct, { isLoading, error }] = useAddProductMutation();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check if the seller is logged in
        if (!seller?._id) {
            alert('You must be logged in as a seller to add a product.');
            return;
        }
    
        // Ensure all required fields are filled
        if (!product.name || !product.category || !product.price || !product.description) {
            alert('Please fill in all required fields.');
            return;
        }
    
        try {
            const productData = {
                ...product,
                image,
                author: seller._id, // Ensure the seller ID is sent
                stockLevel: product.stockLevel || 0,
            };
    
            await addProduct(productData).unwrap();
    
            alert('Product added successfully!');
            setProduct({
                name: '',
                category: '',
                description: '',
                price: '',
                oldPrice: '',
                color: '',
                stockLevel: '',
            });
            setImage('');
            navigate('/seller/dashboard/manage-products');
        } catch (err) {
            console.error('Failed to add product:', err);
            alert('Failed to add product. Please try again.');
        }
    };
    
    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextInput
                    label="Product Name"
                    name="name"
                    placeholder="Ex: Diamond Earrings"
                    value={product.name}
                    onChange={handleChange}
                />
                <SelectInput
                    label="Category"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    options={categories}
                />
                <SelectInput
                    label="Color"
                    name="color"
                    value={product.color}
                    onChange={handleChange}
                    options={colors}
                />
                <TextInput
                    label="Price"
                    name="price"
                    type="number"
                    placeholder="50"
                    value={product.price}
                    onChange={handleChange}
                />
                <TextInput
                    label="Stock Level"
                    name="stockLevel"
                    type="number"
                    placeholder="Enter stock quantity"
                    value={product.stockLevel}
                    onChange={handleChange}
                />
                <UploadImage
                    name="image"
                    id="image"
                    value={e => setImage(e.target.value)}
                    placeholder="Upload product image"
                    setImage={setImage}
                />
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
                        className="add-product-InputCSS bg-black text-white border border-white focus:outline-none focus:ring-2 focus:ring-white pl-3 pr-4 py-3 rounded-md placeholder-white w-full"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="add-product-btn bg-white text-black font-semibold py-3 rounded-md transition duration-300 hover:bg-gray-200"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Adding...' : 'Add Product'}
                    </button>
                </div>
            </form>

            {error && <p className="text-red-500 mt-4">Error adding product: {error.message}</p>}
        </div>
    );
};

export default AddProduct;
