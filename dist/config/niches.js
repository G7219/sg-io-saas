/**
 * SG.IO NICHES - COMPLETE FEATURE MATRIX
 * 10 Business Niches × 3 Tiers (Lite/Rise/Elite)
 * All features, workflows, and integrations
 */
// Pharmacy - 💊
export const PHARMACY = {
    id: 'pharmacy',
    name: 'Pharmacy',
    description: 'Online pharmacy with prescription management',
    color: '#E8F5E9',
    icon: '💊',
    features: {
        lite: ['Product catalog (100 items)', 'Customer support', 'Lead qualification', 'FAQ'],
        rise: ['Unlimited products', 'MEO', 'SEO & AEO', 'Coupons & discounts', 'Platform commission', 'Workflow automation', 'Multi-step automation', 'Escalation logic', 'Dashboard & reporting', 'CRM integration'],
        elite: ['Everything in Rise', 'Decision framework', 'Risk controls', 'Fail/safe mechanism', 'Audit trails', 'Governance logic', 'Priority support 24/7', 'API access', 'White label'],
    },
    workflows: {
        lite: ['Basic order processing'],
        rise: ['Order → Payment → Fulfillment', 'Escalation by quantity', 'Multi-step automation'],
        elite: ['Decision framework for approval', 'Risk controls with verification', 'Fail/safe mechanism', 'QR code ordering'],
    },
    integrations: {
        lite: [],
        rise: ['CRM', 'Email', 'WhatsApp API'],
        elite: ['CRM', 'Email', 'SMS', 'WhatsApp', 'Prescription API'],
    },
};
// Restaurant - 🍽️
export const RESTAURANT = {
    id: 'restaurant',
    name: 'Restaurant',
    description: 'Online ordering with table reservation',
    color: '#FFF3E0',
    icon: '🍽️',
    features: {
        lite: ['Menu management', 'Customer support', 'Table reservation', 'Lead qualification', 'FAQ'],
        rise: ['Unlimited menu items', 'Multi-language', 'Workflow automation', 'Escalation logic', 'Dashboard with metrics', 'Order tracking', 'Night sales reports', 'CRM integration', 'SEO/MEO/AEO', 'Coupons & discounts', 'Social media'],
        elite: ['Everything in Rise', 'Decision framework', 'Risk controls', 'Fail/safe mechanism', 'Audit trails', 'Governance logic', 'Priority support', 'API access for POS', 'White label'],
    },
    workflows: {
        lite: ['Basic order → payment'],
        rise: ['Order → verification → kitchen → delivery', 'Escalation for large orders', 'Multi-step kitchen workflow', 'Night sales tracking'],
        elite: ['Advanced order management', 'Table optimization', 'Demand forecasting', 'Staff scheduling'],
    },
    integrations: {
        lite: [],
        rise: ['CRM', 'Email', 'WhatsApp', 'Google Maps'],
        elite: ['CRM', 'Email', 'SMS', 'WhatsApp', 'POS systems', 'Delivery services', 'Payment gateways'],
    },
};
// Real Estate - 🏠
export const REAL_ESTATE = {
    id: 'real_estate',
    name: 'Real Estate',
    description: 'Property listing and lead management',
    color: '#ECEFF1',
    icon: '🏠',
    features: {
        lite: ['Property listing (100)', 'Customer support', 'Lead qualification', 'Appointment booking', 'Map integration'],
        rise: ['Unlimited listings', 'Workflow automation', 'Escalation logic', 'Dashboard with lead tracking', 'Property status', 'Lead scoring', 'Virtual tour links', 'CRM integration', 'SEO/MEO/AEO', 'Financing options', 'Social media'],
        elite: ['Everything in Rise', 'Decision framework', 'Risk controls', 'Fail/safe mechanism', 'Audit trails', 'Governance logic', 'Priority support', 'API access', 'White label', 'Advanced CRM'],
    },
    workflows: {
        lite: ['Lead capture → contact'],
        rise: ['Lead → qualification → showing → offer', 'Multi-property management', 'Escalation for premium'],
        elite: ['Advanced lead scoring', 'Follow-up automation', 'Document management', 'Offer tracking'],
    },
    integrations: {
        lite: ['Google Maps'],
        rise: ['CRM', 'Email', 'WhatsApp', 'Google Maps', 'Virtual tour'],
        elite: ['CRM', 'Email', 'SMS', 'WhatsApp', 'Payment gateways', 'Document management'],
    },
};
// Church - ⛪
export const CHURCH = {
    id: 'church',
    name: 'Church',
    description: 'Church website with events and donations',
    color: '#F3E5F5',
    icon: '⛪',
    features: {
        lite: ['Event management', 'Donation tracking', 'Member directory', 'Newsletter'],
        rise: ['Advanced scheduling', 'Giving analytics', 'Member engagement', 'Sermon archive', 'Prayer tracking', 'Volunteer management', 'Email integration', 'Social media'],
        elite: ['Everything in Rise', 'Decision framework', 'Risk controls', 'Audit trails (financial)', 'Compliance tracking', 'Priority support', 'API access', 'Advanced analytics'],
    },
    workflows: {
        lite: ['Event → Registration'],
        rise: ['Event → Registration → Attendance', 'Donation → Thank you', 'Prayer request → Follow-up'],
        elite: ['Advanced engagement', 'Financial reporting', 'Stewardship tracking'],
    },
    integrations: {
        lite: [],
        rise: ['Email', 'WhatsApp', 'Social media'],
        elite: ['Email', 'SMS', 'WhatsApp', 'Payment gateways', 'Accounting software'],
    },
};
// Electronics - 📱
export const ELECTRONICS = {
    id: 'electronics',
    name: 'Electronics Store',
    description: 'Electronics retail with warranty and support',
    color: '#E0F2F1',
    icon: '📱',
    features: {
        lite: ['Product catalog (100)', 'Customer support', 'Lead qualification', 'Service booking', 'Map'],
        rise: ['Unlimited products', 'Workflow automation', 'Multi-step automation', 'Escalation logic', 'Dashboard', 'Reviews tracking', 'Warranty management', 'Stock tracking', 'CRM integration', 'SEO/MAP/AIO', 'Discounts', 'Social media'],
        elite: ['Everything in Rise', 'Decision framework', 'Risk controls', 'Fail/safe mechanism', 'Audit trails', 'Governance logic', 'Priority support', 'API access', 'White label', 'Advanced inventory'],
    },
    workflows: {
        lite: ['Product → Order → Payment'],
        rise: ['Product → Order → Payment → Shipping → Delivery → Support', 'Warranty automation', 'Stock alerts'],
        elite: ['Advanced logistics', 'Warranty tracking', 'Return management', 'Service scheduling'],
    },
    integrations: {
        lite: [],
        rise: ['CRM', 'Email', 'WhatsApp', 'Google Maps', 'Shipping APIs'],
        elite: ['CRM', 'Email', 'SMS', 'WhatsApp', 'Payment gateways', 'Inventory', 'Shipping'],
    },
};
// Salon - 💇
export const SALON = {
    id: 'salon',
    name: 'Salon / SPA',
    description: 'Salon with appointment scheduling',
    color: '#FCE4EC',
    icon: '💇',
    features: {
        lite: ['Service listing', 'Appointment booking', 'Customer support', 'Staff directory'],
        rise: ['Advanced scheduling', 'Staff availability', 'Service packages', 'Customer history', 'Loyalty program', 'Workflow automation', 'Email & WhatsApp integration', 'SEO/MEO/AEO', 'Coupons & discounts'],
        elite: ['Everything in Rise', 'Decision framework', 'Risk controls', 'Audit trails', 'Priority support', 'API access', 'Advanced CRM', 'Staff performance tracking'],
    },
    workflows: {
        lite: ['Service → Booking → Confirmation'],
        rise: ['Service → Booking → Confirmation → Reminder → Completion → Feedback', 'Loyalty automation', 'Staff optimization'],
        elite: ['Advanced scheduling', 'Revenue optimization', 'Customer lifetime value'],
    },
    integrations: {
        lite: [],
        rise: ['Email', 'WhatsApp', 'SMS', 'Calendar sync'],
        elite: ['Email', 'SMS', 'WhatsApp', 'Payment gateways', 'POS integration'],
    },
};
// Boutique - 👗
export const BOUTIQUE = {
    id: 'boutique',
    name: 'Boutique / Fashion',
    description: 'Fashion retail with styling services',
    color: '#FFF9C4',
    icon: '👗',
    features: {
        lite: ['Product catalog (100)', 'Customer support', 'Size/fit guide', 'Customer reviews'],
        rise: ['Unlimited products', 'Size recommendation', 'Style quiz', 'Lookbook creation', 'Outfit combinations', 'Workflow automation', 'Email & WhatsApp integration', 'SEO/MEO/AEO', 'Seasonal discounts', 'Social media'],
        elite: ['Everything in Rise', 'Decision framework', 'Risk controls', 'Audit trails', 'Priority support', 'API access', 'White label', 'Advanced CRM for VIP'],
    },
    workflows: {
        lite: ['Browse → Add to cart → Checkout'],
        rise: ['Browse → Style quiz → Recommendations → Order → Delivery → Review', 'Size automation', 'Seasonal lookbooks'],
        elite: ['Advanced personalization', 'VIP management', 'Influencer tools'],
    },
    integrations: {
        lite: [],
        rise: ['Email', 'WhatsApp', 'Instagram', 'Pinterest'],
        elite: ['Email', 'SMS', 'WhatsApp', 'Instagram', 'Pinterest', 'Payment gateways', 'Inventory'],
    },
};
// Hardware - 🔨
export const HARDWARE = {
    id: 'hardware',
    name: 'Hardware Store',
    description: 'Hardware retail with contractor tools',
    color: '#FFECB3',
    icon: '🔨',
    features: {
        lite: ['Product catalog (100)', 'Customer support', 'Lead qualification', 'Price quotes'],
        rise: ['Unlimited products', 'Contractor accounts', 'Bulk order management', 'Quote generation', 'Workflow automation', 'Email & WhatsApp integration', 'SEO/MEO/AEO', 'Contractor loyalty', 'Social media'],
        elite: ['Everything in Rise', 'Decision framework', 'Risk controls', 'Audit trails', 'Priority support', 'API access', 'White label', 'Contractor dashboard'],
    },
    workflows: {
        lite: ['Browse → Quote → Purchase'],
        rise: ['Browse → Quote → Approval → Purchase → Delivery → Support', 'Bulk automation', 'Pricing tiers'],
        elite: ['Advanced contractor management', 'Project tracking', 'Job site delivery'],
    },
    integrations: {
        lite: [],
        rise: ['Email', 'WhatsApp', 'SMS'],
        elite: ['Email', 'SMS', 'WhatsApp', 'Payment gateways', 'Delivery providers', 'Contractor management'],
    },
};
// General Store B2B - 🏪
export const GENERAL_STORE = {
    id: 'general_store',
    name: 'General Store (B2B)',
    description: 'Wholesale/B2B marketplace',
    color: '#FFFACD',
    icon: '🏪',
    features: {
        lite: ['Product catalog', 'Customer support', 'Lead qualification', 'Manager booking', 'Map'],
        rise: ['Unlimited products', 'Workflow automation', 'Multi-step automation', 'Escalation logic', 'Dashboard & reporting', 'Fast moving goods tracking', 'Social media', 'CRM integration', 'Ordering system', 'Bulk order form'],
        elite: ['Everything in Rise', 'Decision framework', 'Risk controls', 'Fail/safe mechanism', 'Audit trails', 'Governance logic', 'Code management', 'Priority support', 'API access', 'White label'],
    },
    workflows: {
        lite: ['Request → Contact → Quote'],
        rise: ['Request → Quote → Approval → Order → Fulfillment', 'Bulk discounts', 'Fast moving goods alerts', 'Order history'],
        elite: ['Advanced bulk ordering', 'Pricing tier management', 'Relationship management', 'Custom contracts'],
    },
    integrations: {
        lite: [],
        rise: ['CRM', 'Email', 'WhatsApp', 'Google Sheets'],
        elite: ['CRM', 'Email', 'SMS', 'WhatsApp', 'Payment gateways', 'ERP systems', 'Accounting'],
    },
};
// Clinic - 🏥
export const CLINIC = {
    id: 'clinic',
    name: 'Clinic / Medical',
    description: 'Medical clinic with patient management',
    color: '#E8F5E9',
    icon: '🏥',
    features: {
        lite: ['Service listing', 'Patient support', 'Appointment booking', 'Doctor profiles'],
        rise: ['Unlimited appointments', 'Patient history', 'Prescription management', 'Follow-up automation', 'Workflow automation', 'Escalation logic', 'Dashboard & reporting', 'Email & WhatsApp integration', 'SEO/MEO/AEO', 'Social media'],
        elite: ['Everything in Rise', 'Decision framework', 'Risk controls', 'Audit trails (HIPAA)', 'Governance logic', 'Priority support 24/7', 'API access', 'Advanced CRM', 'Compliance tracking'],
    },
    workflows: {
        lite: ['Appointment → Consultation'],
        rise: ['Appointment → Consultation → Prescription → Follow-up → Feedback', 'Multi-doctor workflow', 'Patient education'],
        elite: ['Advanced patient management', 'Treatment planning', 'Insurance coordination', 'Telemedicine'],
    },
    integrations: {
        lite: [],
        rise: ['Email', 'WhatsApp', 'SMS'],
        elite: ['Email', 'SMS', 'WhatsApp', 'Payment gateways', 'Medical records', 'Appointment reminders', 'Insurance systems'],
    },
};
// Registry
const NICHES_REGISTRY = {
    pharmacy: PHARMACY,
    restaurant: RESTAURANT,
    real_estate: REAL_ESTATE,
    church: CHURCH,
    electronics: ELECTRONICS,
    salon: SALON,
    boutique: BOUTIQUE,
    hardware: HARDWARE,
    general_store: GENERAL_STORE,
    clinic: CLINIC,
};
// Export functions
export function getNiche(id) {
    return NICHES_REGISTRY[id] || null;
}
export function listNiches() {
    return Object.values(NICHES_REGISTRY);
}
export function nicheExists(id) {
    return id in NICHES_REGISTRY;
}
export function getNicheFeatures(id, tier) {
    const niche = getNiche(id);
    return niche ? (niche.features[tier] || []) : [];
}
export function hasFeature(id, tier, feature) {
    return getNicheFeatures(id, tier).includes(feature);
}
export function getAllFeaturesUpToTier(id, tier) {
    const niche = getNiche(id);
    if (!niche)
        return [];
    const features = [...(niche.features.lite || [])];
    if (tier === 'rise' || tier === 'elite')
        features.push(...(niche.features.rise || []));
    if (tier === 'elite')
        features.push(...(niche.features.elite || []));
    return features;
}
export default NICHES_REGISTRY;
