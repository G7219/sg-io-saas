/**
 * Authentication Module
 */

const AUTH = {
    /**
     * Check if user is logged in
     */
    isAuthenticated() {
        return !!localStorage.getItem('accessToken');
    },

    /**
     * Get current user
     */
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    /**
     * Save user
     */
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    /**
     * Login
     */
    async login(email, password) {
        const response = await API.post('/auth/login', {
            email,
            password
        });

        if (response.success) {
            API.setTokens(
                response.data.accessToken,
                response.data.refreshToken
            );
            this.setUser(response.data.user);
            return response;
        }

        return response;
    },

    /**
     * Sign up
     */
    async signup(email, password, niche) {
        const response = await API.post('/auth/signup', {
            email,
            password,
            niche
        });

        if (response.success) {
            API.setTokens(
                response.data.accessToken,
                response.data.refreshToken
            );
            this.setUser(response.data.user);
            return response;
        }

        return response;
    },

    /**
     * Logout
     */
    logout() {
        API.clearTokens();
        window.location.href = '/index.html';
    },

    /**
     * Refresh token
     */
    async refreshToken() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            this.logout();
            return null;
        }

        const response = await API.post('/auth/refresh', {
            refreshToken
        });

        if (response.success) {
            API.setTokens(response.data.accessToken, response.data.refreshToken);
            return response;
        }

        this.logout();
        return null;
    },

    /**
     * Verify email availability
     */
    async verifyEmail(email) {
        return API.get(`/auth/verify-email?email=${email}`);
    },

    /**
     * Verify subdomain availability
     */
    async verifySubdomain(subdomain) {
        return API.get(`/auth/verify-subdomain?subdomain=${subdomain}`);
    },

    /**
     * Protect route - redirect if not logged in
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/index.html';
            return false;
        }
        return true;
    }
};
