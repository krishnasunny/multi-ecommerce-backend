const pool = require('../config/db');

const createProduct = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { 
      vendor_id,
      category_id,
      product_name,
      description,
      base_price,
      sku,
      variants,
      images
    } = req.body;

    // Create product
    const productResult = await client.query(
      `INSERT INTO products (vendor_id, category_id, product_name, description, base_price, sku)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING product_id`,
      [vendor_id, category_id, product_name, description, base_price, sku]
    );

    const product_id = productResult.rows[0].product_id;

    // Add variants
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        await client.query(
          `INSERT INTO product_variants (product_id, variant_name, variant_price, stock_quantity, sku)
           VALUES ($1, $2, $3, $4, $5)`,
          [product_id, variant.name, variant.price, variant.stock_quantity, variant.sku]
        );
      }
    }

    // Add images
    if (images && images.length > 0) {
      for (const image of images) {
        await client.query(
          `INSERT INTO product_images (product_id, image_url, is_primary)
           VALUES ($1, $2, $3)`,
          [product_id, image.url, image.is_primary]
        );
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Product created successfully',
      product_id
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    client.release();
  }
};

const getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, v.store_name, c.category_name,
              array_agg(DISTINCT jsonb_build_object(
                'variant_id', pv.variant_id,
                'variant_name', pv.variant_name,
                'variant_price', pv.variant_price,
                'stock_quantity', pv.stock_quantity
              )) as variants,
              array_agg(DISTINCT jsonb_build_object(
                'image_id', pi.image_id,
                'image_url', pi.image_url,
                'is_primary', pi.is_primary
              )) as images
       FROM products p
       LEFT JOIN vendors v ON p.vendor_id = v.vendor_id
       LEFT JOIN categories c ON p.category_id = c.category_id
       LEFT JOIN product_variants pv ON p.product_id = pv.product_id
       LEFT JOIN product_images pi ON p.product_id = pi.product_id
       GROUP BY p.product_id, v.store_name, c.category_name`
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts
};