/**
 * Locations B2B Service
 * Multi-branch and B2B operations management
 */
export class LocationsB2BService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Create a new location/branch
     */
    async createLocation(tenantId, locationData) {
        try {
            const location = await this.prisma.location.create({
                data: {
                    tenant_id: tenantId,
                    name: locationData.name,
                    address: locationData.address,
                    city: locationData.city,
                    country: locationData.country,
                    phone_number: locationData.phone,
                    email: locationData.email,
                    is_main_branch: locationData.is_main_branch || false,
                    is_active: true,
                }
            });
            return {
                success: true,
                message: 'Location created successfully',
                data: location
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to create location'
            };
        }
    }
    /**
     * Get all locations for a tenant
     */
    async getLocations(tenantId) {
        try {
            const locations = await this.prisma.location.findMany({
                where: { tenant_id: tenantId },
                orderBy: { created_at: 'desc' }
            });
            return {
                success: true,
                data: locations,
                count: locations.length
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    /**
     * Get single location
     */
    async getLocation(locationId) {
        try {
            const location = await this.prisma.location.findUnique({
                where: { id: locationId },
                include: {
                    inventory: true,
                    orders: true
                }
            });
            if (!location) {
                return { success: false, error: 'Location not found' };
            }
            return { success: true, data: location };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * Update location
     */
    async updateLocation(locationId, updateData) {
        try {
            const location = await this.prisma.location.update({
                where: { id: locationId },
                data: updateData
            });
            return { success: true, data: location };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * Set main branch
     */
    async setMainBranch(tenantId, locationId) {
        try {
            // Remove main from all locations
            await this.prisma.location.updateMany({
                where: { tenant_id: tenantId },
                data: { is_main_branch: false }
            });
            // Set this location as main
            const location = await this.prisma.location.update({
                where: { id: locationId },
                data: { is_main_branch: true }
            });
            return {
                success: true,
                message: 'Main branch updated',
                data: location
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * Get inventory for location
     */
    async getLocationInventory(locationId) {
        try {
            const inventory = await this.prisma.inventory.findMany({
                where: { location_id: locationId },
                include: { product: true }
            });
            return { success: true, data: inventory };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * Transfer inventory between locations
     */
    async transferInventory(fromLocationId, toLocationId, productId, quantity) {
        try {
            // Check source inventory
            const sourceInventory = await this.prisma.inventory.findFirst({
                where: {
                    location_id: fromLocationId,
                    product_id: productId
                }
            });
            if (!sourceInventory || sourceInventory.quantity < quantity) {
                return { success: false, error: 'Insufficient inventory' };
            }
            // Decrease source
            await this.prisma.inventory.update({
                where: { id: sourceInventory.id },
                data: { quantity: { decrement: quantity } }
            });
            // Increase destination
            const destInventory = await this.prisma.inventory.findFirst({
                where: {
                    location_id: toLocationId,
                    product_id: productId
                }
            });
            if (destInventory) {
                await this.prisma.inventory.update({
                    where: { id: destInventory.id },
                    data: { quantity: { increment: quantity } }
                });
            }
            else {
                await this.prisma.inventory.create({
                    data: {
                        location_id: toLocationId,
                        product_id: productId,
                        quantity
                    }
                });
            }
            return { success: true, message: 'Inventory transferred' };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * Get B2B discounts for location
     */
    async getB2BDiscounts(locationId) {
        try {
            const location = await this.prisma.location.findUnique({
                where: { id: locationId }
            });
            const discounts = await this.prisma.b2BDiscount.findMany({
                where: { location_id: locationId },
                orderBy: { created_at: 'desc' }
            });
            return { success: true, data: discounts };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * Create B2B discount
     */
    async createB2BDiscount(locationId, discountData) {
        try {
            const discount = await this.prisma.b2BDiscount.create({
                data: {
                    location_id: locationId,
                    product_id: discountData.product_id,
                    min_quantity: discountData.min_quantity,
                    discount_percentage: discountData.discount_percentage,
                    discount_amount: discountData.discount_amount,
                    is_active: true,
                    customer_email: discountData.customer_email,
                    tenant_id: discountData.tenant_id,
                }
            });
            return { success: true, data: discount };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * Get location analytics
     */
    async getLocationAnalytics(locationId, days = 30) {
        try {
            const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
            const orders = await this.prisma.order.findMany({
                where: {
                    location_id: locationId,
                    created_at: { gte: fromDate }
                }
            });
            const revenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
            return {
                success: true,
                data: {
                    total_orders: orders.length,
                    total_revenue: revenue,
                    average_order_value: orders.length > 0 ? revenue / orders.length : 0,
                    period_days: days
                }
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * Delete location
     */
    async deleteLocation(locationId) {
        try {
            // Check if it's main branch
            const location = await this.prisma.location.findUnique({
                where: { id: locationId }
            });
            if (location?.is_main_branch) {
                return {
                    success: false,
                    error: 'Cannot delete main branch. Set another branch as main first.'
                };
            }
            // Delete location
            await this.prisma.location.delete({
                where: { id: locationId }
            });
            return { success: true, message: 'Location deleted' };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
}
export default LocationsB2BService;
