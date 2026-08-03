// Filtering utility
// Builds Prisma where clause from query parameters

function buildProductFilters(query) {
  const filters = {};
  
  if (query.category) {
    filters.category = { name: query.category };
  }
  if (query.status) {
    filters.status = query.status;
  }
  if (query.search) {
    filters.name = { contains: query.search };
  }
  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) filters.price.gte = parseFloat(query.minPrice);
    if (query.maxPrice) filters.price.lte = parseFloat(query.maxPrice);
  }
  
  return filters;
}

function buildOrderFilters(query) {
  const filters = {};
  
  if (query.status) {
    filters.status = query.status;
  }
  if (query.search) {
    filters.OR = [
      { id: { contains: query.search } },
      { customerName: { contains: query.search } }
    ];
  }
  if (query.startDate || query.endDate) {
    filters.orderDate = {};
    if (query.startDate) filters.orderDate.gte = new Date(query.startDate);
    if (query.endDate) filters.orderDate.lte = new Date(query.endDate);
  }
  
  return filters;
}

module.exports = { buildProductFilters, buildOrderFilters };
