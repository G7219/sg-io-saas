/**
 * SG.IO NICHES - COMPLETE FEATURE MATRIX
 * 10 Business Niches × 3 Tiers (Lite/Rise/Elite)
 * All features, workflows, and integrations
 */
export type Niche = 'pharmacy' | 'restaurant' | 'real_estate' | 'church' | 'electronics' | 'salon' | 'boutique' | 'hardware' | 'general_store' | 'clinic';
export interface NicheFeatures {
    id: Niche;
    name: string;
    description: string;
    color: string;
    icon: string;
    features: {
        lite: string[];
        rise: string[];
        elite: string[];
    };
    workflows: {
        lite: string[];
        rise: string[];
        elite: string[];
    };
    integrations: {
        lite: string[];
        rise: string[];
        elite: string[];
    };
}
export declare const PHARMACY: NicheFeatures;
export declare const RESTAURANT: NicheFeatures;
export declare const REAL_ESTATE: NicheFeatures;
export declare const CHURCH: NicheFeatures;
export declare const ELECTRONICS: NicheFeatures;
export declare const SALON: NicheFeatures;
export declare const BOUTIQUE: NicheFeatures;
export declare const HARDWARE: NicheFeatures;
export declare const GENERAL_STORE: NicheFeatures;
export declare const CLINIC: NicheFeatures;
declare const NICHES_REGISTRY: Record<Niche, NicheFeatures>;
export declare function getNiche(id: Niche): NicheFeatures | null;
export declare function listNiches(): NicheFeatures[];
export declare function nicheExists(id: string): id is Niche;
export declare function getNicheFeatures(id: Niche, tier: 'lite' | 'rise' | 'elite'): string[];
export declare function hasFeature(id: Niche, tier: 'lite' | 'rise' | 'elite', feature: string): boolean;
export declare function getAllFeaturesUpToTier(id: Niche, tier: 'lite' | 'rise' | 'elite'): string[];
export default NICHES_REGISTRY;
//# sourceMappingURL=niches.d.ts.map