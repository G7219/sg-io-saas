/**
 * SG.IO - LOCATIONS & B2B ROUTES
 * Endpoints for managing locations and B2B discount requests
 */
import { Router } from 'express';
/*import {
    getLocations,
    createLocation,
    addAdditionalLocation,
    updateLocation,
    getShippingTracking,
    updateShippingStatus,
    requestB2BDiscount,
    getPendingDiscountRequests,
    assignDiscountRequest,
    approveDiscountRequest,
    rejectDiscountRequest,
    checkLocationLimit,
} from '../services/locations-b2b.service.js';*/
const router = Router();
// ============================================================
// LOCATION MANAGEMENT ROUTES
// ============================================================
/**
 * GET /api/v1/locations
 * Get all locations for tenant
 * Requires: auth, valid subscription
 */
// router.get(
//     '/locations',
//     authMiddleware,
//     checkSubscriptionStatus('lite'),
//     getLocations
// );
// /**
//  * POST /api/v1/locations
//  * Create new location (respects tier limits)
//  * Lite: 1 location
//  * Rise: 5 locations
//  * Elite: Unlimited
//  * Requires: auth, valid subscription
//  */
// router.post(
//     '/locations',
//     authMiddleware,
//     checkSubscriptionStatus('lite'),
//     checkLocationLimit,
//     createLocation
// );
// /**
//  * POST /api/v1/locations/additional
//  * Add additional location with $10 charge
//  * Requires: auth, valid subscription (Rise or Elite)
//  */
// router.post(
//     '/locations/additional',
//     authMiddleware,
//     checkSubscriptionStatus('rise'),
//     addAdditionalLocation
// );
// /**
//  * PATCH /api/v1/locations/:locationId
//  * Update location details
//  * Requires: auth, valid subscription
//  */
// router.patch(
//     '/locations/:locationId',
//     authMiddleware,
//     checkSubscriptionStatus('lite'),
//     updateLocation
// );
// // ============================================================
// // SHIPPING & TRACKING ROUTES
// // ============================================================
// /**
//  * GET /api/v1/shipping/:orderId
//  * Get tracking info for order
//  * Public endpoint (visible to customer)
//  */
// router.get('/shipping/:orderId', getShippingTracking);
// /**
//  * PATCH /api/v1/shipping/:trackingId/status
//  * Update shipping status and location
//  * Requires: auth
//  */
// router.patch(
//     '/shipping/:trackingId/status',
//     authMiddleware,
//     updateShippingStatus
// );
// // ============================================================
// // B2B DISCOUNT REQUEST ROUTES
// // ============================================================
// /**
//  * POST /api/v1/b2b/discount-request
//  * Customer requests B2B discount
//  * Public endpoint - can be called without auth
//  */
// router.post('/b2b/discount-request', requestB2BDiscount);
// /**
//  * GET /api/v1/b2b/discount-requests/pending
//  * Get pending discount requests for seller
//  * Requires: auth
//  */
// router.get(
//     '/b2b/discount-requests/pending',
//     authMiddleware,
//     checkSubscriptionStatus('lite'),
//     getPendingDiscountRequests
// );
// /**
//  * PATCH /api/v1/b2b/discount-requests/:discountRequestId/assign
//  * Assign discount request to support staff
//  * Requires: auth
//  */
// router.patch(
//     '/b2b/discount-requests/:discountRequestId/assign',
//     authMiddleware,
//     assignDiscountRequest
// );
// /**
//  * PATCH /api/v1/b2b/discount-requests/:discountRequestId/approve
//  * Approve B2B discount request
//  * Requires: auth
//  */
// router.patch(
//     '/b2b/discount-requests/:discountRequestId/approve',
//     authMiddleware,
//     approveDiscountRequest
// );
// /**
//  * PATCH /api/v1/b2b/discount-requests/:discountRequestId/reject
//  * Reject B2B discount request
//  * Requires: auth
//  */
// router.patch(
//     '/b2b/discount-requests/:discountRequestId/reject',
//     authMiddleware,
//     rejectDiscountRequest
// );
export default router;
