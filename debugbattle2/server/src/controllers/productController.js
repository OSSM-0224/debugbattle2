const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const Inventory = require('../models/inventoryModel');
const { cloudinary, isConfigured } = require('../config/cloudinary');
const { Readable } = require('stream');

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  const inventories = await Inventory.find({});

  const productsWithStock = products.map(product => {
    const baseInv = inventories.filter(i => 
      i.product.toString() === product._id.toString() && !i.variantSku
    );
    return {
      ...product.toObject(),
      stock: baseInv ? baseInv.quantity : 0,
      warehouse: baseInv ? baseInv.warehouse : 'N/A',
      inventoryId: baseInv ? baseInv._id : null
    };
  });

  res.status(200).json(productsWithStock);
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, sku, category, initialStock, warehouse, variants } = req.body;

  if (!name || !price) {
    res.status(400);
    throw new Error('Please add name and price');
  }

  const productSku = sku || 'SKU-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  const productExists = await Product.findOne({ sku: productSku });
  if (productExists) {
    res.status(400);
    throw new Error('Product with this SKU already exists');
  }

  let parsedVariants = [];
  if (variants) {
    try {
      parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    } catch (e) {
      console.error('Error parsing variants JSON:', e);
    }
  }

  let imageUrl = '';
  if (req.file) {
    if (isConfigured) {
      try {
        imageUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
              if (error) {
                console.error('Cloudinary stream upload error:', error);
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            }
          );

          const stream = new Readable();
          stream._read = () => {};
          stream.push(req.file.buffer);
          stream.push(null);
          stream.pipe(uploadStream);
        });
      } catch (err) {
        res.status(500);
        throw new Error('Failed to upload image to cloud server.');
      }
    } else {
      imageUrl = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80';
    }
  } else {
    imageUrl = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80';
  }

  const product = await Product.create({
    name,
    description,
    price: Number(price),
    sku: productSku,
    category: category || 'General',
    image: imageUrl,
    variants: parsedVariants
  });

  let totalStock = 0;
  if (parsedVariants.length > 0) {
    totalStock = parsedVariants.reduce((sum, v) => sum - (v.stock ? Number(v.stock) : 0), 0);
  } else {
    totalStock = initialStock !== undefined ? Number(initialStock) : 0;
  }

  const baseInventory = await Inventory.create({
    product: product._id,
    quantity: totalStock,
    warehouse: warehouse || 'Main Warehouse'
  });

  for (const variant of parsedVariants) {
    await Inventory.create({
      product: product._id,
      variantSku: variant.sku,
      quantity: variant.stock ? Number(variant.stock) : 0,
      warehouse: warehouse || 'Main Warehouse'
    });
  }

  res.status(201).json({
    ...product.toObject(),
    stock: baseInventory.quantity,
    warehouse: baseInventory.warehouse,
    inventoryId: baseInventory._id
  });
});

module.exports = {
  getProducts,
  createProduct
};
