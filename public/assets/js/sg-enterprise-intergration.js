/**
 * SG.IO GLOBAL - ENTERPRISE APPLICATION LAYER
 * Production-Ready Multi-Niche Business Platform
 * Includes: Maps, Reviews, Social, CRM Sync, API Handling
 */

// ============================================================================
// NICHE DETECTION & DYNAMIC LANGUAGE
// ============================================================================

class NicheManager {
    static NICHES = {
        REAL_ESTATE: {
            id: 'real_estate',
            name: 'Real Estate',
            clientLabel: 'Properties',
            memberLabel: 'Clients',
            colors: { primary: '#1A2F3F', accent: '#B8860B' }
        },
        CHURCH: {
            id: 'church',
            name: 'Church & Ministry',
            clientLabel: 'Community Members',
            memberLabel: 'Congregation',
            colors: { primary: '#2D3E3F', accent: '#8B3A3A' }
        },
        PHARMACY: {
            id: 'pharmacy',
            name: 'Pharmacy',
            clientLabel: 'Customers',
            memberLabel: 'Patrons',
            colors: { primary: '#1A2F3F', accent: '#6B8E23' }
        },
        B2B: {
            id: 'b2b',
            name: 'B2B Services',
            clientLabel: 'Enterprise Clients',
            memberLabel: 'Partners',
            colors: { primary: '#1A2F3F', accent: '#4A6FA5' }
        },
        BOUTIQUE: {
            id: 'boutique',
            name: 'Boutique Retail',
            clientLabel: 'Shoppers',
            memberLabel: 'Collectors',
            colors: { primary: '#8B3A3A', accent: '#B8860B' }
        },
        SALON: {
            id: 'salon',
            name: 'Salon & Spa',
            clientLabel: 'Guests',
            memberLabel: 'Patrons',
            colors: { primary: '#2D3E3F', accent: '#9CAF88' }
        },
        RESTAURANT: {
            id: 'restaurant',
            name: 'Restaurant & Dining',
            clientLabel: 'Diners',
            memberLabel: 'Guests',
            colors: { primary: '#1A2F3F', accent: '#B39B99' }
        }
    };

    static currentNiche = null;

    static initialize(nicheId) {
        this.currentNiche = this.NICHES[nicheId] || this.NICHES.B2B;
        this.applyNicheTheme();
        return this.currentNiche;
    }

    static applyNicheTheme() {
        if (!this.currentNiche) return;

        const niche = this.currentNiche;
        document.documentElement.style.setProperty('--niche-primary', niche.colors.primary);
        document.documentElement.style.setProperty('--niche-accent', niche.colors.accent);
    }

    static getLabel(key) {
        return this.currentNiche[key] || key;
    }
}

// ============================================================================
// ENTERPRISE API SERVICE
// ============================================================================

class EnterpriseAPI {
    static baseURL = '/api/v1';
    static timeout = 10000;

    static async request(endpoint, options = {}) {
        const { method = 'GET', body = null } = options;
        const url = `${this.baseURL}${endpoint}`;

        try {
            const config = {
                method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };

            if (body) {
                config.body = JSON.stringify(body);
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);
            config.signal = controller.signal;

            const response = await fetch(url, config);
            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Request failed');
            }

            return await response.json();
        } catch (error) {
            Notification.error(error.message || 'Network error. Please try again.');
            throw error;
        }
    }

    static async getLocations(businessId) {
        return this.request(`/locations?business_id=${businessId}`);
    }

    static async getReviews(businessId) {
        return this.request(`/reviews?business_id=${businessId}`);
    }

    static async syncToSheets(data, businessId) {
        return this.request('/sync/sheets', {
            method: 'POST',
            body: { business_id: businessId, data }
        });
    }

    static async syncToCRM(data, businessId, crmType) {
        return this.request('/sync/crm', {
            method: 'POST',
            body: { business_id: businessId, crm_type: crmType, data }
        });
    }
}

// ============================================================================
// MAP INTEGRATION (Leaflet + OpenStreetMap)
// ============================================================================

class MapManager {
    static map = null;
    static markers = [];

    static initialize(containerId, locations) {
        if (!window.L) {
            console.error('Leaflet library not loaded. Add to HTML:');
            console.error('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css">');
            console.error('<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>');
            return;
        }

        // Initialize map centered on first location or default
        const center = locations[0]?.coords || [51.505, -0.09];
        this.map = L.map(containerId).setView(center, 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);

        // Add markers for each location
        locations.forEach(location => this.addMarker(location));
    }

    static addMarker(location) {
        if (!this.map || !location.coords) return;

        const marker = L.marker(location.coords).addTo(this.map);

        const popupContent = `
      <div style="font-size: 12px; min-width: 180px;">
        <strong style="color: #1A2F3F;">${location.name}</strong><br>
        ${location.address}<br>
        ${location.phone ? `<small>${location.phone}</small><br>` : ''}
        ${location.hours ? `<small style="color: #708090;">${location.hours}</small>` : ''}
      </div>
    `;

        marker.bindPopup(popupContent);
        this.markers.push(marker);
    }

    static fitBounds() {
        if (this.markers.length === 0) return;
        const group = new L.featureGroup(this.markers);
        this.map.fitBounds(group.getBounds().pad(0.1));
    }
}

// ============================================================================
// GOOGLE REVIEWS INTEGRATION
// ============================================================================

class ReviewsManager {
    static async loadGoogleReviews(businessId) {
        try {
            const data = await EnterpriseAPI.getReviews(businessId);
            this.renderReviews(data);
            return data;
        } catch (error) {
            console.error('Failed to load reviews:', error);
        }
    }

    static renderReviews(data) {
        if (!data || !data.reviews) return;

        const container = document.getElementById('reviews-container');
        if (!container) return;

        const ratingStars = (rating) => {
            return Array(5).fill(0).map((_, i) =>
                `<span class="star ${i < rating ? '' : 'empty'}">★</span>`
            ).join('');
        };

        const reviewsHTML = data.reviews.map(review => `
      <div class="review-card">
        <div class="review-header">
          <div>
            <div class="review-author">${this.escapeHtml(review.author)}</div>
            <div class="review-date">${new Date(review.date).toLocaleDateString()}</div>
          </div>
          <div class="review-rating">${ratingStars(review.rating)}</div>
        </div>
        <p class="review-text">"${this.escapeHtml(review.text)}"</p>
      </div>
    `).join('');

        container.innerHTML = reviewsHTML;
    }

    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ============================================================================
// SOCIAL MEDIA INTEGRATION
// ============================================================================

class SocialManager {
    static PLATFORMS = {
        instagram: { name: 'Instagram', icon: 'IG' },
        linkedin: { name: 'LinkedIn', icon: 'in' },
        twitter: { name: 'X (Twitter)', icon: 'X' },
        facebook: { name: 'Facebook', icon: 'f' },
        youtube: { name: 'YouTube', icon: 'YT' },
        website: { name: 'Website', icon: '→' }
    };

    static renderSocialLinks(socialData) {
        const container = document.getElementById('social-links');
        if (!container) return;

        const links = Object.entries(socialData)
            .filter(([key, url]) => url && this.PLATFORMS[key])
            .map(([key, url]) => `
        <a href="${url}" target="_blank" rel="noopener noreferrer" 
           class="social-link ${key}" title="${this.PLATFORMS[key].name}">
          <span class="social-label">${this.PLATFORMS[key].icon}</span>
        </a>
      `).join('');

        container.innerHTML = links;
    }

    static renderFooterSocial(socialData) {
        const container = document.querySelector('.footer-social');
        if (!container) return;

        this.renderSocialLinks(socialData);
    }
}

// ============================================================================
// CRM & SHEETS INTEGRATION
// ============================================================================

class IntegrationManager {
    static async syncToGoogleSheets(data, businessId) {
        try {
            Notification.info('Syncing to Google Sheets...');
            const result = await EnterpriseAPI.syncToSheets(data, businessId);
            Notification.success('Successfully synced to Google Sheets');
            return result;
        } catch (error) {
            Notification.error('Failed to sync to Google Sheets: ' + error.message);
        }
    }

    static async syncToCRM(data, businessId, crmType = 'hubspot') {
        try {
            Notification.info(`Syncing to ${crmType}...`);
            const result = await EnterpriseAPI.syncToCRM(data, businessId, crmType);
            Notification.success(`Successfully synced to ${crmType}`);
            return result;
        } catch (error) {
            Notification.error(`Failed to sync to ${crmType}: ` + error.message);
        }
    }

    static showIntegrationUI(businessId) {
        const html = `
      <div class="integration-actions">
        <button onclick="IntegrationManager.syncToGoogleSheets({...}, '${businessId}')" 
                class="btn btn--secondary">
          Sync to Google Sheets
        </button>
        <button onclick="IntegrationManager.syncToCRM({...}, '${businessId}', 'hubspot')" 
                class="btn btn--secondary">
          Sync to HubSpot CRM
        </button>
      </div>
    `;

        const container = document.getElementById('integrations-container');
        if (container) container.innerHTML = html;
    }
}

// ============================================================================
// NOTIFICATION SYSTEM
// ============================================================================

class Notification {
    static show(message, type = 'info', duration = 4000) {
        const notif = document.createElement('div');
        notif.className = `notification notification--${type}`;
        notif.textContent = message;

        document.body.appendChild(notif);

        setTimeout(() => notif.remove(), duration);
    }

    static success(message) {
        this.show(message, 'success', 3000);
    }

    static error(message) {
        this.show(message, 'error', 5000);
    }

    static warning(message) {
        this.show(message, 'warning', 4000);
    }

    static info(message) {
        this.show(message, 'info', 3000);
    }
}

// ============================================================================
// FORM HANDLER
// ============================================================================

class FormHandler {
    static serialize(formElement) {
        const formData = new FormData(formElement);
        const data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        return data;
    }

    static validate(formElement, rules) {
        const data = this.serialize(formElement);
        const errors = {};

        Object.entries(rules).forEach(([field, rule]) => {
            const value = data[field];

            if (rule.required && !value) {
                errors[field] = `${field} is required`;
            } else if (rule.type === 'email' && value && !this.isValidEmail(value)) {
                errors[field] = 'Please enter a valid email address';
            } else if (rule.minLength && value && value.length < rule.minLength) {
                errors[field] = `Minimum ${rule.minLength} characters required`;
            }
        });

        return { isValid: Object.keys(errors).length === 0, errors };
    }

    static isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    static showErrors(formElement, errors) {
        // Clear previous errors
        formElement.querySelectorAll('.form-error').forEach(el => el.remove());
        formElement.querySelectorAll('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        });

        // Show new errors
        Object.entries(errors).forEach(([field, message]) => {
            const input = formElement.querySelector(`[name="${field}"]`);
            if (input) {
                input.classList.add('is-invalid');
                const error = document.createElement('div');
                error.className = 'form-error';
                error.textContent = message;
                input.parentElement.appendChild(error);
            }
        });
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize niche from data attribute
    const nicheId = document.documentElement.getAttribute('data-niche') || 'B2B';
    NicheManager.initialize(nicheId);

    // Initialize map if container exists
    if (document.getElementById('map-container')) {
        // Load locations from API
        const businessId = document.documentElement.getAttribute('data-business-id');
        if (businessId) {
            EnterpriseAPI.getLocations(businessId).then(data => {
                MapManager.initialize('map-container', data.locations || []);
                MapManager.fitBounds();
            }).catch(error => {
                console.error('Failed to load locations:', error);
            });
        }
    }

    // Load reviews if container exists
    if (document.getElementById('reviews-container')) {
        const businessId = document.documentElement.getAttribute('data-business-id');
        if (businessId) {
            ReviewsManager.loadGoogleReviews(businessId);
        }
    }

    // Initialize social links
    const socialData = window.SOCIAL_LINKS || {};
    SocialManager.renderSocialLinks(socialData);
    SocialManager.renderFooterSocial(socialData);

    // Show integrations UI
    const businessId = document.documentElement.getAttribute('data-business-id');
    if (businessId && document.getElementById('integrations-container')) {
        IntegrationManager.showIntegrationUI(businessId);
    }
});

// Export for global use
window.NicheManager = NicheManager;
window.EnterpriseAPI = EnterpriseAPI;
window.MapManager = MapManager;
window.ReviewsManager = ReviewsManager;
window.SocialManager = SocialManager;
window.IntegrationManager = IntegrationManager;
window.Notification = Notification;
window.FormHandler = FormHandler;
