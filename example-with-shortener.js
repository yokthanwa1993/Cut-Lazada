/**
 * ตัวอย่างการใช้งาน Lazada URL Parser พร้อมการย่อลิงก์
 * 
 * ไฟล์นี้แสดงวิธีการใช้งานฟังก์ชันต่างๆ รวมถึงการย่อลิงก์ด้วย API
 */

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
 * ฟังก์ชันสำหรับย่อลิงก์ Lazada โดยใช้ API
 * @param {string} lazadaUrl - URL ของ Lazada ที่ต้องการย่อ
 * @returns {Promise<Object>} ผลลัพธ์การย่อลิงก์
 */
async function shortenLazadaUrl(lazadaUrl) {
    try {
        const apiUrl = `https://getlink-lazada.lslly.com/api/v1?link=${encodeURIComponent(lazadaUrl)}`;
        
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

/**
 * ฟังก์ชันสำหรับทดสอบการย่อลิงก์
 */
async function testUrlShortening() {
    console.log('🔗 ทดสอบการย่อลิงก์\n');
    
    const testUrl = "https://www.lazada.co.th/i5403278598.html";
    console.log(`📝 ทดสอบ URL: ${testUrl}`);
    
    try {
        const result = await shortenLazadaUrl(testUrl);
        
        if (result.success) {
            console.log('✅ ย่อลิงก์สำเร็จ!');
            console.log(`   URL เดิม: ${result.originalUrl}`);
            console.log(`   URL ที่ย่อแล้ว: ${result.shortenedUrl}`);
            console.log(`   Result Code: ${result.resultCode}`);
            console.log(`   Timestamp: ${result.timestamp}`);
        } else {
            console.log('❌ ย่อลิงก์ไม่สำเร็จ');
            console.log(`   Error: ${result.error}`);
        }
    } catch (error) {
        console.log('❌ เกิดข้อผิดพลาด:', error.message);
    }
    
    console.log('');
}

/**
 * ฟังก์ชันสำหรับทดสอบการประมวลผลครบวงจร
 */
async function testFullProcessing() {
    console.log('⚡ ทดสอบการประมวลผลครบวงจร\n');
    
    for (let i = 0; i < testUrls.length; i++) {
        const url = testUrls[i];
        console.log(`📝 URL ที่ ${i + 1}:`);
        console.log(`   ${url.substring(0, 80)}...`);
        
        try {
            const result = await processLazadaUrl(url);
            
            if (result.success) {
                console.log(`   ✅ รหัสสินค้า: ${result.productId}`);
                console.log(`   ✅ URL ที่ตัดคำแล้ว: ${result.cleanUrl}`);
                
                if (result.shortenedUrl) {
                    console.log(`   ✅ URL ที่ย่อแล้ว: ${result.shortenedUrl}`);
                } else {
                    console.log(`   ⚠️ ไม่สามารถย่อลิงก์ได้`);
                }
            } else {
                console.log(`   ❌ ไม่สามารถประมวลผลได้: ${result.error}`);
            }
        } catch (error) {
            console.log(`   ❌ เกิดข้อผิดพลาด: ${error.message}`);
        }
        
        console.log('');
    }
}

/**
 * ฟังก์ชันสำหรับแสดงตัวอย่างการใช้งาน API
 */
function showApiExamples() {
    console.log('📚 ตัวอย่างการใช้งาน API\n');
    
    console.log('1️⃣ การย่อลิงก์โดยตรง:');
    console.log('   const result = await shortenLazadaUrl("https://www.lazada.co.th/i5403278598.html");');
    console.log('   console.log(result.shortenedUrl); // https://s.lazada.co.th/s.BczX8?cc\n');
    
    console.log('2️⃣ การประมวลผลครบวงจร:');
    console.log('   const result = await processLazadaUrl(originalUrl);');
    console.log('   console.log(result.shortenedUrl); // URL ที่ย่อแล้ว\n');
    
    console.log('3️⃣ โครงสร้างข้อมูลที่ส่งคืน:');
    console.log('   {');
    console.log('     success: true,');
    console.log('     shortenedUrl: "https://s.lazada.co.th/s.BczX8?cc",');
    console.log('     originalUrl: "https://www.lazada.co.th/i5403278598.html",');
    console.log('     timestamp: "2025-07-25T03:44:18.184Z",');
    console.log('     resultCode: 1,');
    console.log('     error: null');
    console.log('   }\n');
}

/**
 * ฟังก์ชันหลักสำหรับรันการทดสอบ
 */
async function runTests() {
    console.log('🔗 Lazada URL Parser + URL Shortener - ตัวอย่างการใช้งาน\n');
    console.log('=' .repeat(60));
    
    // ทดสอบการย่อลิงก์
    await testUrlShortening();
    
    // ทดสอบการประมวลผลครบวงจร
    await testFullProcessing();
    
    // แสดงตัวอย่างการใช้งาน
    showApiExamples();
    
    console.log('=' .repeat(60));
    console.log('✅ การทดสอบเสร็จสิ้น!');
}

// รันการทดสอบ (ถ้าใช้ใน Node.js ต้องติดตั้ง node-fetch)
if (typeof window === 'undefined') {
    // Node.js environment
    console.log('⚠️  ไฟล์นี้ต้องรันในเบราว์เซอร์เพื่อทดสอบการย่อลิงก์');
    console.log('   เนื่องจากใช้ fetch API ที่ต้องมี CORS support');
    console.log('');
    
    // แสดงตัวอย่างการใช้งาน
    showApiExamples();
} else {
    // Browser environment
    runTests();
} 