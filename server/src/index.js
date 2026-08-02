const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const healthRoutes = require('./routes/health');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const customerRoutes = require('./routes/customers');
const authRoutes = require('./routes/auth');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
