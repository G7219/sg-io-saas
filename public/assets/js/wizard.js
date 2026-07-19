/**
 * Setup Wizard Module
 */

const WIZARD = {
    currentStep: 1,
    totalSteps: 4,
    formData: {},

    /**
     * Initialize wizard
     */
    init() {
        AUTH.requireAuth();
        this.loadFromSession();
        this.renderStep(1);
        this.setupEventListeners();
    },

    /**
     * Load data from session
     */
    loadFromSession() {
        const saved = sessionStorage.getItem('wizardData');
        if (saved) {
            this.formData = JSON.parse(saved);
        }
    },

    /**
     * Save to session
     */
    saveSession() {
        sessionStorage.setItem('wizardData', JSON.stringify(this.formData));
    },

    /**
     * Render step
     */
    renderStep(step) {
        this.currentStep = step;

        // Hide all steps
        document.querySelectorAll('.step').forEach(el => {
            el.style.display = 'none';
        });

        // Show current step
        document.getElementById(`step-${step}`).style.display = 'block';

        // Update progress
        document.getElementById('progress-bar').style.width = `${(step / this.totalSteps) * 100}%`;
        document.getElementById('step-indicator').textContent = `Step ${step} of ${this.totalSteps}`;

        // Load saved data for current step
        this.loadStepData(step);
    },

    /**
     * Load step data from saved form
     */
    loadStepData(step) {
        switch (step) {
            case 1:
                if (this.formData.businessName) {
                    document.getElementById('businessName').value = this.formData.businessName;
                }
                if (this.formData.businessLocation) {
                    document.getElementById('businessLocation').value = this.formData.businessLocation;
                }
                if (this.formData.phone) {
                    document.getElementById('phone').value = this.formData.phone;
                }
                break;

            case 2:
                if (this.formData.primaryColor) {
                    document.getElementById('primaryColor').value = this.formData.primaryColor;
                }
                if (this.formData.logoUrl) {
                    document.getElementById('logoUrl').value = this.formData.logoUrl;
                }
                break;

            case 3:
                if (this.formData.contactEmail) {
                    document.getElementById('contactEmail').value = this.formData.contactEmail;
                }
                if (this.formData.contactPhone) {
                    document.getElementById('contactPhone').value = this.formData.contactPhone;
                }
                if (this.formData.openingHours) {
                    document.getElementById('openingHours').value = this.formData.openingHours;
                }
                if (this.formData.closingHours) {
                    document.getElementById('closingHours').value = this.formData.closingHours;
                }
                break;

            case 4:
                this.showReview();
                break;
        }
    },

    /**
     * Validate current step
     */
    validateStep(step) {
        const errors = [];

        switch (step) {
            case 1:
                const name = document.getElementById('businessName').value;
                const location = document.getElementById('businessLocation').value;
                const phone = document.getElementById('phone').value;

                if (!name) errors.push('Business name is required');
                if (!location) errors.push('Business location is required');
                if (!phone) errors.push('Phone number is required');
                break;

            case 2:
                const color = document.getElementById('primaryColor').value;
                if (!color) errors.push('Primary color is required');
                break;

            case 3:
                const email = document.getElementById('contactEmail').value;
                if (!email || !this.isValidEmail(email)) {
                    errors.push('Valid email is required');
                }
                break;
        }

        if (errors.length > 0) {
            alert('Please fix the following errors:\n' + errors.join('\n'));
            return false;
        }

        return true;
    },

    /**
     * Save current step
     */
    saveCurrentStep() {
        switch (this.currentStep) {
            case 1:
                this.formData.businessName = document.getElementById('businessName').value;
                this.formData.businessLocation = document.getElementById('businessLocation').value;
                this.formData.phone = document.getElementById('phone').value;
                break;

            case 2:
                this.formData.primaryColor = document.getElementById('primaryColor').value;
                this.formData.secondaryColor = document.getElementById('secondaryColor').value;
                this.formData.logoUrl = document.getElementById('logoUrl').value;
                break;

            case 3:
                this.formData.contactEmail = document.getElementById('contactEmail').value;
                this.formData.contactPhone = document.getElementById('contactPhone').value;
                this.formData.openingHours = document.getElementById('openingHours').value;
                this.formData.closingHours = document.getElementById('closingHours').value;
                break;
        }

        this.saveSession();
    },

    /**
     * Handle next step
     */
    handleNext() {
        if (!this.validateStep(this.currentStep)) {
            return;
        }

        this.saveCurrentStep();

        if (this.currentStep < this.totalSteps) {
            this.renderStep(this.currentStep + 1);
        }
    },

    /**
     * Handle back
     */
    handleBack() {
        this.saveCurrentStep();

        if (this.currentStep > 1) {
            this.renderStep(this.currentStep - 1);
        }
    },

    /**
     * Show review step
     */
    showReview() {
        const review = `
      <div class="review-item">
        <h3>Business Information</h3>
        <p><strong>Name:</strong> ${this.formData.businessName}</p>
        <p><strong>Location:</strong> ${this.formData.businessLocation}</p>
        <p><strong>Phone:</strong> ${this.formData.phone}</p>
      </div>

      <div class="review-item">
        <h3>Branding</h3>
        <p><strong>Primary Color:</strong> <span style="color: ${this.formData.primaryColor}">●</span> ${this.formData.primaryColor}</p>
        <p><strong>Secondary Color:</strong> <span style="color: ${this.formData.secondaryColor}">●</span> ${this.formData.secondaryColor}</p>
      </div>

      <div class="review-item">
        <h3>Contact Details</h3>
        <p><strong>Email:</strong> ${this.formData.contactEmail}</p>
        <p><strong>Hours:</strong> ${this.formData.openingHours} - ${this.formData.closingHours}</p>
      </div>
    `;

        document.getElementById('reviewContent').innerHTML = review;
    },

    /**
     * Launch business
     */
    async launch() {
        if (!confirm('Launch your business now?')) {
            return;
        }

        this.saveCurrentStep();

        // Step 1
        let response = await API.post('/setup/step-1', {
            businessName: this.formData.businessName,
            businessLocation: this.formData.businessLocation,
            phone: this.formData.phone
        });

        if (!response.success) {
            alert('Error in step 1: ' + response.error.message);
            return;
        }

        // Step 2
        response = await API.post('/setup/step-2', {
            primaryColor: this.formData.primaryColor,
            secondaryColor: this.formData.secondaryColor,
            logoUrl: this.formData.logoUrl
        });

        if (!response.success) {
            alert('Error in step 2: ' + response.error.message);
            return;
        }

        // Step 3
        response = await API.post('/setup/step-3', {
            contactEmail: this.formData.contactEmail,
            contactPhone: this.formData.contactPhone,
            openingHours: this.formData.openingHours,
            closingHours: this.formData.closingHours
        });

        if (!response.success) {
            alert('Error in step 3: ' + response.error.message);
            return;
        }

        // Launch
        response = await API.post('/setup/launch', {});

        if (!response.success) {
            alert('Error launching: ' + response.error.message);
            return;
        }

        // Success
        const subdomain = response.data.subdomain || 'business';
        window.location.href = `/website-success.html?subdomain=${subdomain}`;
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        document.getElementById('nextBtn').addEventListener('click', () => this.handleNext());
        document.getElementById('backBtn').addEventListener('click', () => this.handleBack());
        document.getElementById('launchBtn').addEventListener('click', () => this.launch());
    },

    /**
     * Validate email
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => WIZARD.init());
