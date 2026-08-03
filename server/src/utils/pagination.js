// Pagination utility
// Calculates offset, limit, and metadata for paginated results

function paginate(page = 1, limit = 10) {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const offset = (pageNum - 1) * limitNum;
  return { offset, limit: limitNum };
}

function getPaginationMeta(totalItems, page, limit) {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const totalPages = Math.ceil(totalItems / limitNum);
  return {
    currentPage: pageNum,
    totalPages,
    totalItems,
    itemsPerPage: limitNum,
    hasNextPage: pageNum < totalPages,
    hasPrevPage: pageNum > 1
  };
}

module.exports = { paginate, getPaginationMeta };
