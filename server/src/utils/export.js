// Export utility
// Converts data to CSV or JSON format

function toCSV(data, columns) {
  if (!data || data.length === 0) return '';
  
  const header = columns.join(',');
  const rows = data.map(row => {
    return columns.map(col => {
      const value = row[col];
      if (value === null || value === undefined) return '""';
      // Escape quotes and wrap in quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',');
  });
  
  return [header, ...rows].join('\n');
}

function toJSON(data) {
  return JSON.stringify(data, null, 2);
}

module.exports = { toCSV, toJSON };
