/**
 * AI SEO Service
 * Auto-generate product descriptions, keywords, and SEO optimization
 * Using Gemini AI and Claude
 */
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
const prisma = new PrismaClient();
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const claude = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});
export class AISEOService {
    /**
     * Generate product description from image + product info
     */
    async generateProductDescription(productName, category, nicheType, imageUrl) {
        try {
            const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });
            const prompt = `You are an expert product copywriter specializing in ${nicheType} businesses.

Generate a professional, persuasive product description for:
- Product Name: ${productName}
- Category: ${category}
- Industry: ${nicheType}

Create a compelling description that:
1. Is 150-200 words
2. Highlights key features and benefits
3. Uses persuasive language
4. Includes call-to-action
5. Is SEO-friendly
6. Maintains professional tone for ${nicheType}

Format: Just the description text, no labels.`;
            const result = await model.generateContent(prompt);
            const description = result.response.text();
            return {
                success: true,
                data: {
                    description: description.trim()
                }
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Description generation failed'
            };
        }
    }
    /**
     * Generate SEO keywords and meta tags
     */
    async generateSEOKeywords(productName, description, category, nicheType) {
        try {
            const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });
            const prompt = `Generate SEO keywords and meta information for a ${nicheType} product.

Product Information:
- Name: ${productName}
- Category: ${category}
- Description: ${description}

Provide in JSON format:
{
  "keywords": ["keyword1", "keyword2", ...], // 8-10 keywords
  "metaTitle": "SEO optimized title (60 chars max)",
  "metaDescription": "SEO optimized description (160 chars max)",
  "longTailKeywords": ["long tail 1", "long tail 2", ...], // 5-7 long tail
  "relatedKeywords": ["related1", "related2", ...], // 5-8 related
  "searchIntent": "commercial/informational/navigational"
}

Make keywords specific to ${nicheType} industry.`;
            const result = await model.generateContent(prompt);
            const jsonText = result.response.text();
            // Parse JSON from response
            const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
            const seoData = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
            return {
                success: true,
                data: seoData
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'SEO generation failed'
            };
        }
    }
    /**
     * Generate alt text for product images (accessibility + SEO)
     */
    async generateAltText(productName, category, imageAnalysis) {
        try {
            const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });
            const prompt = `Generate descriptive alt text for an image in a ${category} product listing.

Product: ${productName}
${imageAnalysis ? `Visual Analysis: ${imageAnalysis}` : ''}

Requirements:
1. Be descriptive but concise (60-125 characters)
2. Include product name
3. Include key details visible in image
4. Be SEO-friendly
5. Avoid keyword stuffing
6. Help accessibility (screen readers)

Return only the alt text, no explanation.`;
            const result = await model.generateContent(prompt);
            const altText = result.response.text();
            return {
                success: true,
                data: {
                    altText: altText.trim().substring(0, 125)
                }
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
     * Optimize product title for SEO
     */
    async optimizeProductTitle(currentTitle, category, nicheType) {
        try {
            const response = await claude.messages.create({
                model: 'claude-opus-4-6',
                max_tokens: 500,
                messages: [
                    {
                        role: 'user',
                        content: `Optimize this product title for SEO and sales:

Current Title: "${currentTitle}"
Category: ${category}
Industry: ${nicheType}

Provide 5 SEO-optimized title variations that:
1. Include primary keywords
2. Are under 60 characters
3. Are compelling and clear
4. Follow ${nicheType} industry standards
5. Include power words

Format as JSON:
{
  "titles": ["title1", "title2", ...]
}`
                    }
                ]
            });
            const textContent = response.content[0];
            if (textContent.type !== 'text') {
                return { success: false, error: 'Invalid response' };
            }
            const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
            const data = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
            return {
                success: true,
                data: data.titles || []
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
     * Generate structured data (JSON-LD) for SEO
     */
    async generateStructuredData(productName, description, price, category, rating, imageUrl) {
        try {
            const structuredData = {
                '@context': 'https://schema.org',
                '@type': 'Product',
                'name': productName,
                'description': description.substring(0, 200),
                'category': category,
                'price': price.toString(),
                'priceCurrency': 'USD',
                'image': imageUrl || '',
                'aggregateRating': rating ? {
                    '@type': 'AggregateRating',
                    'ratingValue': rating.toString(),
                    'ratingCount': '1'
                } : undefined,
                'availability': 'https://schema.org/InStock',
                'seller': {
                    '@type': 'Organization',
                    'name': 'SG.IO Store'
                }
            };
            return {
                success: true,
                data: structuredData
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
     * Auto-generate complete SEO metadata from product image
     */
    async autoGenerateProductSEO(productId, productName, category, nicheType, imageUrl, price) {
        try {
            // Step 1: Generate description
            const descResult = await this.generateProductDescription(productName, category, nicheType, imageUrl);
            if (!descResult.success) {
                return descResult;
            }
            const description = descResult.data?.description || '';
            // Step 2: Generate SEO keywords
            const keywordResult = await this.generateSEOKeywords(productName, description, category, nicheType);
            // Step 3: Generate alt text
            const altResult = await this.generateAltText(productName, category);
            // Step 4: Optimize title
            const titleResult = await this.optimizeProductTitle(productName, category, nicheType);
            // Step 5: Generate structured data
            const structuredResult = await this.generateStructuredData(productName, description, price || 0, category, undefined, imageUrl);
            // Save to database
            const seoData = await prisma.productSEO.upsert({
                where: { productId: productId },
                update: {
                    description,
                    keywords: keywordResult.data.keywords || [],
                    meta_title: keywordResult.data.metaTitle || productName,
                    meta_description: keywordResult.data.metaDescription || description.substring(0, 160),
                    alt_text: altResult.data?.altText || '',
                    long_tail_keywords: keywordResult.data.longTailKeywords || [],
                    structured_data: structuredResult.data,
                    optimized_titles: titleResult.data || [],
                    ai_generated: true,
                    generated_at: new Date()
                },
                create: {
                    productId: productId,
                    description,
                    keywords: keywordResult.data.keywords || [],
                    meta_title: keywordResult.data.metaTitle || productName,
                    meta_description: keywordResult.data.metaDescription || description.substring(0, 160),
                    alt_text: altResult.data?.altText || '',
                    long_tail_keywords: keywordResult.data.longTailKeywords || [],
                    structured_data: structuredResult.data,
                    optimized_titles: titleResult.data || [],
                    ai_generated: true,
                    generated_at: new Date()
                }
            });
            return {
                success: true,
                message: 'Product SEO generated successfully',
                data: {
                    description,
                    keywords: keywordResult.data.keywords,
                    metaTitle: keywordResult.data.metaTitle,
                    metaDescription: keywordResult.data.metaDescription,
                    altText: altResult.data?.altText,
                    longTailKeywords: keywordResult.data.longTailKeywords,
                    optimizedTitles: titleResult.data,
                    structuredData: structuredResult.data
                }
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'SEO generation failed'
            };
        }
    }
    /**
     * Get product SEO data
     */
    async getProductSEO(productId) {
        try {
            const seoData = await prisma.productSEO.findUnique({
                where: { productId: productId }
            });
            if (!seoData) {
                return {
                    success: false,
                    error: 'SEO data not found'
                };
            }
            return {
                success: true,
                data: seoData
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
     * Update product SEO (manual edits)
     */
    async updateProductSEO(productId, updates) {
        try {
            const updated = await prisma.productSEO.update({
                where: { productId: productId },
                data: {
                    ...updates,
                    updated_at: new Date()
                }
            });
            return {
                success: true,
                message: 'SEO data updated',
                data: updated
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
     * Generate SEO score for product
     */
    async calculateSEOScore(productId) {
        try {
            const seoData = await prisma.productSEO.findUnique({
                where: { productId: productId }
            });
            if (!seoData) {
                return {
                    success: false,
                    error: 'SEO data not found'
                };
            }
            let score = 0;
            const details = {};
            // Check meta title (10 points)
            if (seoData.meta_title && seoData.meta_title.length > 30 && seoData.meta_title.length <= 60) {
                score += 10;
                details.title = 'Perfect';
            }
            else if (seoData.meta_title) {
                score += 5;
                details.title = 'Needs improvement';
            }
            // Check meta description (10 points)
            if (seoData.meta_description && seoData.meta_description.length > 120 && seoData.meta_description.length <= 160) {
                score += 10;
                details.description = 'Perfect';
            }
            else if (seoData.meta_description) {
                score += 5;
                details.description = 'Needs improvement';
            }
            // Check keywords (15 points)
            if (seoData.keywords && seoData.keywords.length >= 8) {
                score += 15;
                details.keywords = 'Excellent';
            }
            else if (seoData.keywords && seoData.keywords.length >= 5) {
                score += 10;
                details.keywords = 'Good';
            }
            // Check alt text (10 points)
            if (seoData.alt_text && seoData.alt_text.length > 40) {
                score += 10;
                details.altText = 'Perfect';
            }
            else if (seoData.alt_text) {
                score += 5;
                details.altText = 'Needs improvement';
            }
            // Check structured data (15 points)
            if (seoData.structured_data) {
                score += 15;
                details.structuredData = 'Implemented';
            }
            // Check long tail keywords (15 points)
            if (seoData.long_tail_keywords && Array.isArray(seoData.long_tail_keywords) && seoData.long_tail_keywords.length >= 5) {
                score += 15;
                details.longTail = 'Excellent';
            }
            else if (seoData.long_tail_keywords && Array.isArray(seoData.long_tail_keywords) && seoData.long_tail_keywords.length > 0) {
                score += 10;
                details.longTail = 'Good';
            }
            // Check description length (10 points)
            if (seoData.description && seoData.description.length > 150 && seoData.description.length <= 300) {
                score += 10;
                details.descriptionLength = 'Perfect';
            }
            else if (seoData.description) {
                score += 5;
                details.descriptionLength = 'Needs improvement';
            }
            const rating = score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Poor';
            return {
                success: true,
                data: {
                    score: Math.min(score, 100),
                    rating,
                    details
                }
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
     * Batch generate SEO for multiple products
     */
    async batchGenerateSEO(products) {
        try {
            const results = [];
            for (const product of products) {
                const result = await this.autoGenerateProductSEO(product.id, product.name, product.category, product.nicheType, product.imageUrl, product.price);
                results.push(result);
            }
            const successful = results.filter(r => r.success);
            const failed = results.filter(r => !r.success);
            return {
                success: failed.length === 0,
                message: `${successful.length} products processed, ${failed.length} failed`,
                data: {
                    total: products.length,
                    successful: successful.length,
                    failed: failed.length,
                    results
                }
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}
export default new AISEOService();
