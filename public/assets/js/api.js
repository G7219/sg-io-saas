/**
 * API Utility Module
 * Handles all API requests with token management
 */

const API = {
    baseURL: '/api/v1',

    /**
     * Get stored access token
     */
    getToken() {
        return localStorage.getItem('accessToken');
    },

    /**
     * Set tokens in storage
     */
    setTokens(accessToken, refreshToken) {
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        }
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
    },

    /**
     * Clear tokens
     */
    clearTokens() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    /**
     * Generate request ID
     */
    generateRequestId() {
        return 'req-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
    },

    /**
     * Make HTTP request
     */
    async request(method, endpoint, data = null) {
        const url = `${this.baseURL}${endpoint}`;
        const token = this.getToken();
        const requestId = this.generateRequestId();

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-Request-ID': requestId
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);

            // Handle token expiry
            if (response.status === 401) {
                this.clearTokens();
                window.location.href = '/login.html';
                return null;
            }

            const result = await response.json();

            // Store tokens if returned
            if (result.data?.accessToken && result.data?.refreshToken) {
                this.setTokens(result.data.accessToken, result.data.refreshToken);
            }

            return result;
        } catch (error) {
            console.error('API Error:', error);
            return {
                success: false,
                error: {
                    code: 'NETWORK_ERROR',
                    message: error.message
                }
            };
        }
    },

    /**
     * GET request
     */
    get(endpoint) {
        return this.request('GET', endpoint);
    },

    /**
     * POST request
     */
    post(endpoint, data) {
        return this.request('POST', endpoint, data);
    },

    /**
     * PUT request
     */
    put(endpoint, data) {
        return this.request('PUT', endpoint, data);
    },

    /**
     * DELETE request
     */
    delete(endpoint) {
        return this.request('DELETE', endpoint);
    },

    /**
     * Upload file
     */
    async upload(endpoint, file) {
        const url = `${this.baseURL}${endpoint}`;
        const token = this.getToken();
        const formData = new FormData();
        formData.append('file', file);

        const options = {
            method: 'POST',
            headers: {
                'X-Request-ID': this.generateRequestId()
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        options.body = formData;

        try {
            const response = await fetch(url, options);
            return await response.json();
        } catch (error) {
            console.error('Upload Error:', error);
            return {
                success: false,
                error: { message: error.message }
            };
        }
    }
};

// Export for Node.js (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}
