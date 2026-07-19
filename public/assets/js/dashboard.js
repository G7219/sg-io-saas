/**
 * Dashboard Module
 */

const DASHBOARD = {
    /**
     * Initialize dashboard
     */
    async init() {
        AUTH.requireAuth();
        await this.loadOverview();
        await this.loadProducts();
        await this.loadOrders();
        this.setupEventListeners();
    },

    /**
     * Load dashboard overview
     */
    async loadOverview() {
        const response = await API.get('/dashboard');

        if (!response.success) {
            console.error('Failed to load overview:', response.error);
            return;
        }

        const data = response.data;

        // Update tenant info
        document.getElementById('businessName').textContent = data.tenant.businessName;
        document.getElementById('planBadge').textContent = data.subscription.plan.toUpperCase();
        document.getElementById('daysLeft').textContent = data.subscription.daysLeft;

        // Update metrics
        document.getElementById('totalRevenue').textContent = this.formatCurrency(data.metrics.totalRevenue);
        document.getElementById('monthlyRevenue').textContent = this.formatCurrency(data.metrics.monthlyRevenue);
        document.getElementById('ordersThisMonth').textContent = data.metrics.ordersThisMonth;
        document.getElementById('totalProducts').textContent = data.metrics.totalProducts;

        // Update recent orders
        const ordersHtml = data.recentOrders.map(order => `
      <tr>
        <td>${order.email}</td>
        <td>${this.formatCurrency(order.amount)}</td>
        <td><span class="badge badge-${order.status}">${order.status}</span></td>
        <td>${new Date(order.date).toLocaleDateString()}</td>
      </tr>
    `).join('');

        document.getElementById('recentOrdersTable').innerHTML = ordersHtml;
    },

    /**
     * Load products
     */
    async loadProducts(page = 1) {
        const response = await API.get(`/dashboard/products?page=${page}`);

        if (!response.success) {
            console.error('Failed to load products:', response.error);
            return;
        }

        const products = response.data.products;
        const html = products.map(product => `
      <div class="product-card">
        <h3>${product.name}</h3>
        <p class="price">${this.formatCurrency(product.price)}</p>
        <p class="description">${product.description || 'No description'}</p>
        <div class="actions">
          <button onclick="DASHBOARD.editProduct(${product.id})" class="btn btn-sm">Edit</button>
          <button onclick="DASHBOARD.deleteProduct(${product.id})" class="btn btn-sm btn-danger">Delete</button>
        </div>
      </div>
    `).join('');

        document.getElementById('productsList').innerHTML = html;
    },

    /**
     * Load orders
     */
    async loadOrders(status = '', page = 1) {
        const url = `/dashboard/orders?page=${page}${status ? '&status=' + status : ''}`;
        const response = await API.get(url);

        if (!response.success) {
            console.error('Failed to load orders:', response.error);
            return;
        }

        const orders = response.data.orders;
        const html = orders.map(order => `
      <tr>
        <td>${order.customer_email}</td>
        <td>${this.formatCurrency(order.amount)}</td>
        <td><span class="badge badge-${order.status}">${order.status}</span></td>
        <td>${new Date(order.created_at).toLocaleDateString()}</td>
      </tr>
    `).join('');

        document.getElementById('ordersTable').innerHTML = html;
    },

    /**
     * Create new product
     */
    async createProduct() {
        const name = document.getElementById('productName').value;
        const price = document.getElementById('productPrice').value;
        const description = document.getElementById('productDescription').value;
        const category = document.getElementById('productCategory').value;

        if (!name || !price) {
            alert('Please fill in all required fields');
            return;
        }

        const response = await API.post('/dashboard/products', {
            name,
            price: parseFloat(price),
            description,
            category
        });

        if (response.success) {
            alert('Product created successfully');
            document.getElementById('productForm').reset();
            await this.loadProducts();
        } else {
            alert('Error creating product: ' + response.error.message);
        }
    },

    /**
     * Edit product
     */
    async editProduct(productId) {
        const newName = prompt('Enter new product name:');
        if (!newName) return;

        const response = await API.put(`/dashboard/products/${productId}`, {
            name: newName
        });

        if (response.success) {
            alert('Product updated successfully');
            await this.loadProducts();
        } else {
            alert('Error updating product');
        }
    },

    /**
     * Delete product
     */
    async deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        const response = await API.delete(`/dashboard/products/${productId}`);

        if (response.success) {
            alert('Product deleted successfully');
            await this.loadProducts();
        } else {
            alert('Error deleting product');
        }
    },

    /**
     * Load analytics
     */
    async loadAnalytics() {
        const response = await API.get('/dashboard/analytics?days=30');

        if (!response.success) {
            console.error('Failed to load analytics:', response.error);
            return;
        }

        // Display analytics data
        console.log('Analytics:', response.data);
    },

    /**
     * Update settings
     */
    async saveSettings() {
        const businessName = document.getElementById('settingsBusinessName').value;
        const primaryColor = document.getElementById('settingsPrimaryColor').value;

        const response = await API.put('/dashboard/settings', {
            businessName,
            primaryColor
        });

        if (response.success) {
            alert('Settings saved successfully');
            await this.loadOverview();
        } else {
            alert('Error saving settings');
        }
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const createBtn = document.getElementById('createProductBtn');
        if (createBtn) {
            createBtn.addEventListener('click', () => this.createProduct());
        }

        const settingsBtn = document.getElementById('saveSettingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.saveSettings());
        }
    },

    /**
     * Format currency
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => DASHBOARD.init());
