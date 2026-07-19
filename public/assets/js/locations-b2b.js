/**
 * SG.IO - LOCATIONS & B2B DISCOUNT MANAGEMENT
 * Frontend JavaScript for managing locations and requesting B2B discounts
 */

// ============================================================
// LOCATION MANAGEMENT
// ============================================================

class LocationManager {
    constructor(apiBase = '/api/v1') {
        this.apiBase = apiBase;
    }

    /**
     * Get all locations
     */
    async getLocations() {
        try {
            const response = await fetch(`${this.apiBase}/locations`, {
                headers: { Authorization: `Bearer ${this.getToken()}` },
            });

            if (!response.ok) throw new Error('Failed to fetch locations');
            return await response.json();
        } catch (error) {
            console.error('Error fetching locations:', error);
            throw error;
        }
    }

    /**
     * Create new location
     */
    async createLocation(locationData) {
        try {
            const response = await fetch(`${this.apiBase}/locations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.getToken()}`,
                },
                body: JSON.stringify(locationData),
            });

            const data = await response.json();

            if (!response.ok) {
                // Check for location limit error
                if (data.error?.code === 'LOCATION_LIMIT_EXCEEDED') {
                    throw new LocationLimitError(data.error);
                }
                throw new Error(data.error?.message || 'Failed to create location');
            }

            return data;
        } catch (error) {
            console.error('Error creating location:', error);
            throw error;
        }
    }

    /**
     * Add additional location (with $10 charge)
     */
    async addAdditionalLocation(locationData) {
        try {
            const response = await fetch(`${this.apiBase}/locations/additional`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.getToken()}`,
                },
                body: JSON.stringify(locationData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error?.code === 'PAYMENT_REQUIRED') {
                    // Redirect to payment
                    return this.handlePaymentRequired(data);
                }
                throw new Error(data.error?.message || 'Failed to add location');
            }

            return data;
        } catch (error) {
            console.error('Error adding location:', error);
            throw error;
        }
    }

    /**
     * Update location
     */
    async updateLocation(locationId, updates) {
        try {
            const response = await fetch(`${this.apiBase}/locations/${locationId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.getToken()}`,
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) throw new Error('Failed to update location');
            return await response.json();
        } catch (error) {
            console.error('Error updating location:', error);
            throw error;
        }
    }

    /**
     * Handle payment required response
     */
    handlePaymentRequired(data) {
        // Show modal for payment
        showPaymentModal({
            title: 'Additional Location - $10',
            amount: data.error.amount,
            paymentId: data.error.payment_id,
            description: 'Add a new location to your store',
        });
    }

    getToken() {
        return localStorage.getItem('auth_token');
    }
}

// ============================================================
// SHIPPING TRACKING
// ============================================================

class ShippingTracker {
    constructor(apiBase = '/api/v1') {
        this.apiBase = apiBase;
    }

    /**
     * Get tracking info for order
     */
    async getTracking(orderId) {
        try {
            const response = await fetch(`${this.apiBase}/shipping/${orderId}`);
            if (!response.ok) throw new Error('Tracking not found');
            return await response.json();
        } catch (error) {
            console.error('Error fetching tracking:', error);
            throw error;
        }
    }

    /**
     * Update shipping status (admin only)
     */
    async updateStatus(trackingId, status, location = null) {
        try {
            const response = await fetch(`${this.apiBase}/shipping/${trackingId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.getToken()}`,
                },
                body: JSON.stringify({
                    status,
                    ...(location && { latitude: location.lat, longitude: location.lng }),
                }),
            });

            if (!response.ok) throw new Error('Failed to update status');
            return await response.json();
        } catch (error) {
            console.error('Error updating tracking:', error);
            throw error;
        }
    }

    /**
     * Display tracking on map
     */
    displayTrackingMap(trackingData, elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;

        // Simple implementation - can be enhanced with actual map library (Google Maps, Leaflet)
        const html = `
      <div class="tracking-info">
        <div class="status-badge status-${trackingData.data.status}">
          ${this.formatStatus(trackingData.data.status)}
        </div>
        <p><strong>Tracking Number:</strong> ${trackingData.data.tracking_number}</p>
        <p><strong>Carrier:</strong> ${trackingData.data.carrier}</p>
        <p><strong>Estimated Delivery:</strong> ${new Date(trackingData.data.estimated_delivery).toLocaleDateString()}</p>
        ${trackingData.data.actual_delivery ? `<p><strong>Delivered:</strong> ${new Date(trackingData.data.actual_delivery).toLocaleDateString()}</p>` : ''}
        ${trackingData.data.notes ? `<p><strong>Notes:</strong> ${trackingData.data.notes}</p>` : ''}
      </div>
    `;

        element.innerHTML = html;
    }

    formatStatus(status) {
        const statuses = {
            pending: 'Pending Pickup',
            picked_up: 'Picked Up',
            in_transit: 'In Transit',
            delivered: 'Delivered',
            failed: 'Delivery Failed',
        };
        return statuses[status] || status;
    }

    getToken() {
        return localStorage.getItem('auth_token');
    }
}

// ============================================================
// B2B DISCOUNT MANAGEMENT
// ============================================================

class B2BDiscountManager {
    constructor(apiBase = '/api/v1') {
        this.apiBase = apiBase;
    }

    /**
     * Request B2B discount (customer side)
     */
    async requestDiscount(requestData) {
        try {
            const response = await fetch(`${this.apiBase}/b2b/discount-request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || 'Failed to request discount');
            return data;
        } catch (error) {
            console.error('Error requesting discount:', error);
            throw error;
        }
    }

    /**
     * Get pending requests (seller side)
     */
    async getPendingRequests() {
        try {
            const response = await fetch(`${this.apiBase}/b2b/discount-requests/pending`, {
                headers: { Authorization: `Bearer ${this.getToken()}` },
            });

            if (!response.ok) throw new Error('Failed to fetch requests');
            return await response.json();
        } catch (error) {
            console.error('Error fetching requests:', error);
            throw error;
        }
    }

    /**
     * Assign request to support staff
     */
    async assignRequest(requestId, adminId) {
        try {
            const response = await fetch(
                `${this.apiBase}/b2b/discount-requests/${requestId}/assign`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.getToken()}`,
                    },
                    body: JSON.stringify({ admin_id: adminId }),
                }
            );

            if (!response.ok) throw new Error('Failed to assign request');
            return await response.json();
        } catch (error) {
            console.error('Error assigning request:', error);
            throw error;
        }
    }

    /**
     * Approve discount request
     */
    async approveDiscount(requestId, approvedPercent, notes) {
        try {
            const response = await fetch(
                `${this.apiBase}/b2b/discount-requests/${requestId}/approve`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.getToken()}`,
                    },
                    body: JSON.stringify({
                        approved_discount_percent: approvedPercent,
                        admin_notes: notes,
                    }),
                }
            );

            if (!response.ok) throw new Error('Failed to approve discount');
            return await response.json();
        } catch (error) {
            console.error('Error approving discount:', error);
            throw error;
        }
    }

    /**
     * Reject discount request
     */
    async rejectDiscount(requestId, notes) {
        try {
            const response = await fetch(
                `${this.apiBase}/b2b/discount-requests/${requestId}/reject`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.getToken()}`,
                    },
                    body: JSON.stringify({ admin_notes: notes }),
                }
            );

            if (!response.ok) throw new Error('Failed to reject discount');
            return await response.json();
        } catch (error) {
            console.error('Error rejecting discount:', error);
            throw error;
        }
    }

    getToken() {
        return localStorage.getItem('auth_token');
    }
}

// ============================================================
// CUSTOM ERRORS
// ============================================================

class LocationLimitError extends Error {
    constructor(errorData) {
        super(errorData.message);
        this.name = 'LocationLimitError';
        this.code = errorData.code;
        this.current_count = errorData.current_count;
        this.limit = errorData.limit;
        this.additional_cost = errorData.additional_cost;
    }
}

// ============================================================
// UI HELPERS
// ============================================================

/**
 * Show location limit warning
 */
function showLocationLimitWarning(error) {
    const message = `
    You've reached your location limit (${error.current_count}/${error.limit}).
    Additional locations cost $${error.additional_cost} each.
    Upgrade your plan or add a new location.
  `;

    showModal({
        title: 'Location Limit Reached',
        message: message,
        type: 'warning',
        buttons: [
            { label: 'Add Location ($10)', onClick: () => showAddLocationPayment() },
            { label: 'Upgrade Plan', onClick: () => navigateTo('/pricing') },
            { label: 'Cancel', onClick: () => closeModal() },
        ],
    });
}

/**
 * Show B2B discount request form
 */
function showB2BDiscountForm() {
    const html = `
    <form id="b2b-discount-form" class="form">
      <div class="form-group">
        <label for="buyer_email">Your Email</label>
        <input type="email" id="buyer_email" name="buyer_email" required>
      </div>
      
      <div class="form-group">
        <label for="buyer_company">Company Name</label>
        <input type="text" id="buyer_company" name="buyer_company" required>
      </div>
      
      <div class="form-group">
        <label for="order_value">Order Value (USD)</label>
        <input type="number" id="order_value" name="order_value" required>
      </div>
      
      <div class="form-group">
        <label for="requested_discount_percent">Requested Discount (%)</label>
        <input type="number" id="requested_discount_percent" name="requested_discount_percent" min="1" max="50" required>
      </div>
      
      <div class="form-group">
        <label for="reason">Reason for Discount</label>
        <textarea id="reason" name="reason" required placeholder="e.g., Regular customer, bulk order, etc."></textarea>
      </div>
      
      <button type="submit" class="btn btn-primary">Request Discount</button>
    </form>
  `;

    showModal({
        title: 'Request B2B Discount',
        content: html,
        onSubmit: async (formData) => {
            try {
                const result = await new B2BDiscountManager().requestDiscount(formData);
                showSuccess('Discount request sent! The seller will contact you soon.');
                closeModal();
            } catch (error) {
                showError(error.message);
            }
        },
    });
}

// ============================================================
// EXPORTS
// ============================================================

window.LocationManager = LocationManager;
window.ShippingTracker = ShippingTracker;
window.B2BDiscountManager = B2BDiscountManager;
window.showLocationLimitWarning = showLocationLimitWarning;
window.showB2BDiscountForm = showB2BDiscountForm;
