const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY || '';

/**
 * Fetch product image from Pixabay
 * @param {string} productName - Product name to search for
 * @returns {string} Image URL
 */
async function getProductImage(productName) {
  if (!PIXABAY_API_KEY) {
    // Fallback to placeholder if no API key
    return `https://via.placeholder.com/400x400/f0f0f0/333?text=${encodeURIComponent(productName)}`;
  }

  try {
    const query = encodeURIComponent(productName);
    const response = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${query}&image_type=photo&per_page=3&min_width=400&min_height=400`
    );
    
    if (!response.ok) {
      throw new Error(`Pixabay API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.hits && data.hits.length > 0) {
      // Return the first matching image
      return data.hits[0].webformatURL;
    }
    
    // Fallback to placeholder if no image found
    return `https://via.placeholder.com/400x400/f0f0f0/333?text=${encodeURIComponent(productName)}`;
  } catch (error) {
    console.error(`Error fetching image for ${productName}:`, error.message);
    return `https://via.placeholder.com/400x400/f0f0f0/333?text=${encodeURIComponent(productName)}`;
  }
}

/**
 * Fetch multiple product images in parallel
 * @param {string[]} productNames - Array of product names
 * @returns {Object} Map of product name to image URL
 */
async function getProductImages(productNames) {
  const results = {};
  
  // Fetch images in parallel with rate limiting
  const promises = productNames.map(async (name) => {
    const image = await getProductImage(name);
    results[name] = image;
  });
  
  await Promise.all(promises);
  return results;
}

module.exports = { getProductImage, getProductImages };
