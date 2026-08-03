// Sorting utility
// Converts sort query parameter to Prisma orderBy

function parseSort(sortString) {
  if (!sortString) return { createdAt: 'desc' };
  
  const [field, order] = sortString.split(':');
  const validOrder = order === 'asc' ? 'asc' : 'desc';
  
  return { [field]: validOrder };
}

module.exports = { parseSort };
