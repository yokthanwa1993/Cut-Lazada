/**
 * ตัวอย่างการใช้งาน Lazada URL Parser
 * 
 * ไฟล์นี้แสดงวิธีการใช้งานฟังก์ชันต่างๆ ของ Lazada URL Parser
 */

// Import ฟังก์ชัน (ถ้าใช้ Node.js)
// const { extractLazadaProductId, createLazadaUrl, convertLazadaUrl } = require('./lazada-url-parser.js');

// ตัวอย่าง URL ต่างๆ ของ Lazada
const testUrls = [
    // URL ที่คุณให้มา
    "https://www.lazada.co.th/products/y2k-knitted-v-neck-mini-vest-fashion-spice-girl-top-slim-outerwear-beautiful-back-vest-korean-style-tee-i5595454212-s23809696215.html?pvid=a2714864-4aa2-4f38-a7b6-7a46bd5216d6&search=jfy&scm=1007.17519.386432.0&priceCompare=skuId%3A23809696215%3Bsource%3Atpp-recommend-plugin-32104%3Bsn%3Aa2714864-4aa2-4f38-a7b6-7a46bd5216d6%3BoriginPrice%3A950%3BdisplayPrice%3A950%3BsinglePromotionId%3A900000059430833%3BsingleToolCode%3ApromPrice%3BvoucherPricePlugin%3A0%3Btimestamp%3A1753414702744&spm=a2o4m.homepage.just4u.d_5595454212",
    
    // URL รูปแบบสั้น
    "https://www.lazada.co.th/i1234567890.html",
    
    // URL อื่นๆ ที่อาจพบ
    "https://www.lazada.co.th/products/smartphone-xiaomi-redmi-note-12-i9876543210-s1234567890.html",
    "https://www.lazada.co.th/i111222333.html?spm=a2o4m.homepage.just4u.d_111222333"
];

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
 * ฟังก์ชันสำหรับทดสอบ URL หลายๆ อัน
 */
function testMultipleUrls() {
    console.log('🧪 ทดสอบ URL หลายๆ อัน\n');
    
    testUrls.forEach((url, index) => {
        console.log(`📝 URL ที่ ${index + 1}:`);
        console.log(`   ${url}`);
        
        const productId = extractLazadaProductId(url);
        const newUrl = convertLazadaUrl(url);
        
        if (productId && newUrl) {
            console.log(`   ✅ รหัสสินค้า: ${productId}`);
            console.log(`   ✅ URL ใหม่: ${newUrl}`);
        } else {
            console.log(`   ❌ ไม่สามารถดึงรหัสสินค้าได้`);
        }
        console.log('');
    });
}

/**
 * ฟังก์ชันสำหรับแสดงวิธีการใช้งานแบบต่างๆ
 */
function showUsageExamples() {
    console.log('📚 ตัวอย่างการใช้งาน\n');
    
    // ตัวอย่างที่ 1: ดึงรหัสสินค้า
    console.log('1️⃣ ดึงรหัสสินค้า:');
    const url1 = testUrls[0];
    const productId1 = extractLazadaProductId(url1);
    console.log(`   const productId = extractLazadaProductId("${url1.substring(0, 50)}...");`);
    console.log(`   // ผลลัพธ์: ${productId1}\n`);
    
    // ตัวอย่างที่ 2: สร้าง URL ใหม่
    console.log('2️⃣ สร้าง URL ใหม่:');
    const newUrl1 = createLazadaUrl(productId1);
    console.log(`   const newUrl = createLazadaUrl("${productId1}");`);
    console.log(`   // ผลลัพธ์: ${newUrl1}\n`);
    
    // ตัวอย่างที่ 3: แปลง URL แบบครบวงจร
    console.log('3️⃣ แปลง URL แบบครบวงจร:');
    const convertedUrl = convertLazadaUrl(url1);
    console.log(`   const convertedUrl = convertLazadaUrl("${url1.substring(0, 50)}...");`);
    console.log(`   // ผลลัพธ์: ${convertedUrl}\n`);
}

/**
 * ฟังก์ชันสำหรับแสดงข้อมูลสถิติ
 */
function showStatistics() {
    console.log('📊 สถิติการทดสอบ\n');
    
    let successCount = 0;
    let totalCount = testUrls.length;
    
    testUrls.forEach(url => {
        const productId = extractLazadaProductId(url);
        if (productId) {
            successCount++;
        }
    });
    
    console.log(`   จำนวน URL ที่ทดสอบ: ${totalCount}`);
    console.log(`   จำนวน URL ที่สำเร็จ: ${successCount}`);
    console.log(`   อัตราความสำเร็จ: ${((successCount / totalCount) * 100).toFixed(1)}%`);
}

// รันการทดสอบ
console.log('🔗 Lazada URL Parser - ตัวอย่างการใช้งาน\n');
console.log('=' .repeat(50));

testMultipleUrls();
showUsageExamples();
showStatistics();

console.log('=' .repeat(50));
console.log('✅ การทดสอบเสร็จสิ้น!'); 