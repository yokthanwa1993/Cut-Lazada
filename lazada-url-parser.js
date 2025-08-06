/**
 * ฟังก์ชันสำหรับตัดคำ URL ของ Lazada เพื่อดึงรหัสสินค้า
 * @param {string} url - URL ของ Lazada
 * @returns {string} รหัสสินค้า (product ID)
 */
function extractLazadaProductId(url) {
    try {
        // สร้าง URL object
        const urlObj = new URL(url);
        
        // ดึง pathname จาก URL
        const pathname = urlObj.pathname;
        
        // ใช้ regex เพื่อหา pattern ของ product ID
        // รูปแบบ: /products/ชื่อสินค้า-i{productId}-s{skuId}.html
        const productIdMatch = pathname.match(/i(\d+)/);
        
        if (productIdMatch) {
            return productIdMatch[1]; // ส่งคืนเฉพาะตัวเลขของ product ID
        }
        
        // ถ้าไม่เจอในรูปแบบแรก ลองหาในรูปแบบอื่น
        // รูปแบบ: /i{productId}.html
        const simpleMatch = pathname.match(/\/i(\d+)\.html/);
        if (simpleMatch) {
            return simpleMatch[1];
        }
        
        throw new Error('ไม่พบรหัสสินค้าใน URL');
        
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการแยก URL:', error.message);
        return null;
    }
}

/**
 * ฟังก์ชันสำหรับสร้าง URL ใหม่จากรหัสสินค้า
 * @param {string} productId - รหัสสินค้า
 * @returns {string} URL ใหม่
 */
function createLazadaUrl(productId) {
    return `https://www.lazada.co.th/i${productId}.html`;
}

/**
 * ฟังก์ชันหลักสำหรับแปลง URL
 * @param {string} originalUrl - URL เดิมของ Lazada
 * @returns {string} URL ใหม่ที่มีเฉพาะรหัสสินค้า
 */
function convertLazadaUrl(originalUrl) {
    const productId = extractLazadaProductId(originalUrl);
    if (productId) {
        return createLazadaUrl(productId);
    }
    return null;
}

/**
 * ฟังก์ชันสำหรับย่อลิงก์ Lazada โดยใช้ API
 * @param {string} lazadaUrl - URL ของ Lazada ที่ต้องการย่อ
 * @returns {Promise<Object>} ผลลัพธ์การย่อลิงก์
 */
async function shortenLazadaUrl(lazadaUrl) {
    try {
        // ใช้ environment variable หรือ fallback ไปยัง URL เดิม
        const apiBaseUrl = process.env.LAZADA_SHORTEN_API_URL || 'https://getlink-lazada.lslly.com/api/v1';
        const apiUrl = `${apiBaseUrl}?link=${encodeURIComponent(lazadaUrl)}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        return {
            success: data.success,
            shortenedUrl: data.data?.message || null,
            originalUrl: data.originalUrl || lazadaUrl,
            timestamp: data.timestamp,
            resultCode: data.data?.resultCode,
            error: null
        };
        
    } catch (error) {
        return {
            success: false,
            shortenedUrl: null,
            originalUrl: lazadaUrl,
            timestamp: new Date().toISOString(),
            resultCode: null,
            error: error.message
        };
    }
}

/**
 * ฟังก์ชันสำหรับประมวลผล URL แบบครบวงจร (ตัดคำ + ย่อลิงก์)
 * @param {string} originalUrl - URL เดิมของ Lazada
 * @returns {Promise<Object>} ผลลัพธ์การประมวลผล
 */
async function processLazadaUrl(originalUrl) {
    try {
        // ขั้นตอนที่ 1: ตัดคำ URL เพื่อดึงรหัสสินค้า
        const productId = extractLazadaProductId(originalUrl);
        const cleanUrl = productId ? createLazadaUrl(productId) : null;
        
        // ขั้นตอนที่ 2: ย่อลิงก์ (ถ้ามี clean URL)
        let shortenedResult = null;
        if (cleanUrl) {
            shortenedResult = await shortenLazadaUrl(cleanUrl);
        }
        
        return {
            success: true,
            originalUrl: originalUrl,
            productId: productId,
            cleanUrl: cleanUrl,
            shortenedUrl: shortenedResult?.shortenedUrl || null,
            timestamp: new Date().toISOString(),
            error: null
        };
        
    } catch (error) {
        return {
            success: false,
            originalUrl: originalUrl,
            productId: null,
            cleanUrl: null,
            shortenedUrl: null,
            timestamp: new Date().toISOString(),
            error: error.message
        };
    }
}

// ตัวอย่างการใช้งาน
const testUrl = "https://www.lazada.co.th/products/y2k-knitted-v-neck-mini-vest-fashion-spice-girl-top-slim-outerwear-beautiful-back-vest-korean-style-tee-i5595454212-s23809696215.html?pvid=a2714864-4aa2-4f38-a7b6-7a46bd5216d6&search=jfy&scm=1007.17519.386432.0&priceCompare=skuId%3A23809696215%3Bsource%3Atpp-recommend-plugin-32104%3Bsn%3Aa2714864-4aa2-4f38-a7b6-7a46bd5216d6%3BoriginPrice%3A950%3BdisplayPrice%3A950%3BsinglePromotionId%3A900000059430833%3BsingleToolCode%3ApromPrice%3BvoucherPricePlugin%3A0%3Btimestamp%3A1753414702744&spm=a2o4m.homepage.just4u.d_5595454212";

console.log('URL เดิม:', testUrl);
console.log('รหัสสินค้า:', extractLazadaProductId(testUrl));
console.log('URL ใหม่:', convertLazadaUrl(testUrl));

// ทดสอบการย่อลิงก์ (ถ้าใช้ใน Node.js ต้องติดตั้ง node-fetch)
// processLazadaUrl(testUrl).then(result => {
//     console.log('ผลลัพธ์การประมวลผล:', result);
// });

// Export functions สำหรับใช้ใน module อื่น
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        extractLazadaProductId,
        createLazadaUrl,
        convertLazadaUrl,
        shortenLazadaUrl,
        processLazadaUrl
    };
} 