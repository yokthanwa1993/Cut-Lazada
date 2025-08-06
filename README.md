# 🔗 Lazada URL Parser

เครื่องมือสำหรับตัดคำ URL ของ Lazada เพื่อดึงรหัสสินค้า (Product ID) และสร้าง URL ใหม่ที่มีรูปแบบสั้น

## 📋 คุณสมบัติ

- ✅ ตัดคำ URL ของ Lazada ที่ยาวและซับซ้อน
- ✅ ดึงรหัสสินค้า (Product ID) ออกมา
- ✅ สร้าง URL ใหม่ที่มีรูปแบบสั้น: `https://www.lazada.co.th/i{productId}.html`
- ✅ **ย่อลิงก์ Lazada โดยใช้ API** ของ [getlink-lazada.lslly.com](https://getlink-lazada.lslly.com)
- ✅ **ประมวลผลครบวงจร** (ตัดคำ + ย่อลิงก์) ในขั้นตอนเดียว
- ✅ รองรับ URL หลายรูปแบบ
- ✅ มี User Interface ที่ใช้งานง่าย
- ✅ **REST API** สำหรับใช้งานผ่าน HTTP
- ✅ **GET endpoint** รับ URL ผ่าน query parameter
- ✅ **Docker support** สำหรับ deployment

## 🚀 การใช้งาน

### 1. ใช้ไฟล์ HTML (แนะนำ)

เปิดไฟล์ `test-lazada-parser.html` ในเบราว์เซอร์:

```bash
open test-lazada-parser.html
```

หรือดับเบิลคลิกที่ไฟล์เพื่อเปิดในเบราว์เซอร์

### 2. ใช้ไฟล์ JavaScript

```javascript
// Import ฟังก์ชัน
const { extractLazadaProductId, convertLazadaUrl } = require('./lazada-url-parser.js');

// ตัวอย่าง URL
const originalUrl = "https://www.lazada.co.th/products/y2k-knitted-v-neck-mini-vest-fashion-spice-girl-top-slim-outerwear-beautiful-back-vest-korean-style-tee-i5595454212-s23809696215.html?pvid=a2714864-4aa2-4f38-a7b6-7a46bd5216d6&search=jfy&scm=1007.17519.386432.0&priceCompare=skuId%3A23809696215%3Bsource%3Atpp-recommend-plugin-32104%3Bsn%3Aa2714864-4aa2-4f38-a7b6-7a46bd5216d6%3BoriginPrice%3A950%3BdisplayPrice%3A950%3BsinglePromotionId%3A900000059430833%3BsingleToolCode%3ApromPrice%3BvoucherPricePlugin%3A0%3Btimestamp%3A1753414702744&spm=a2o4m.homepage.just4u.d_5595454212";

// แปลง URL
const newUrl = convertLazadaUrl(originalUrl);
console.log('URL ใหม่:', newUrl);
```

### 3. ใช้ REST API

#### การติดตั้งและรัน API

```bash
# ติดตั้ง dependencies
npm install

# รัน API server
npm start
```

API จะรันที่ `http://localhost:3000`

#### การใช้งาน API

**GET /process?url=...** - ประมวลผล URL แบบครบวงจร (ตัดคำ + ย่อลิงก์)

```bash
curl "http://localhost:3000/process?url=https://www.lazada.co.th/products/..."
```

หรือเปิดในเบราว์เซอร์:
```
http://localhost:3000/process?url=https://www.lazada.co.th/products/20000mah-i5775550818-s24586668571.html?pvid=df21ad6b-f05d-4b7d-a676-84072f2caa0f&search=jfy&scm=1007.17519.386432.0&priceCompare=skuId%3A24586668571%3Bsource%3Atpp-recommend-plugin-32104%3Bsn%3Adf21ad6b-f05d-4b7d-a676-84072f2caa0f%3BoriginPrice%3A6900%3BdisplayPrice%3A6900%3BsinglePromotionId%3A-1%3BsingleToolCode%3AmockedSalePrice%3BvoucherPricePlugin%3A0%3Btimestamp%3A1754445296429&spm=a2o4m.homepage.just4u.d_5775550818
```

**POST /process** - ประมวลผล URL แบบครบวงจร (ตัดคำ + ย่อลิงก์)

```bash
curl -X POST http://localhost:3000/process \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.lazada.co.th/products/..."}'
```

**ตัวอย่าง Response:**

```json
{
  "success": true,
  "originalUrl": "https://www.lazada.co.th/products/20000mah-i5775550818-s24586668571.html?pvid=df21ad6b-f05d-4b7d-a676-84072f2caa0f",
  "productId": "5775550818",
  "cleanUrl": "https://www.lazada.co.th/i5775550818.html",
  "shortenedUrl": "https://s.lazada.co.th/s.BnVFt?cc",
  "timestamp": "2025-08-06T01:58:13.661Z",
  "error": null
}
```

**GET /** - ดูข้อมูล API

```bash
curl http://localhost:3000/
```

## 🚀 Deployment

### CapRover Deployment

1. **เตรียมไฟล์:**
   - `captain-definition` - กำหนดค่า CapRover
   - `Dockerfile` - สร้าง Docker image
   - `.dockerignore` - ไม่รวมไฟล์ที่ไม่จำเป็น

2. **Push โปรเจค:**
   ```bash
   git add .
   git commit -m "Add CapRover deployment files"
   git push origin master
   ```

3. **Deploy บน CapRover:**
   - เข้า CapRover dashboard
   - สร้าง app ใหม่
   - Connect กับ Git repository
   - Deploy

### Environment Variables

ตั้งค่า environment variables ใน CapRover:

```env
LAZADA_SHORTEN_API_URL=https://getlink-lazada.lslly.com/api/v1
PORT=3000
```

## 📚 API Reference

### ฟังก์ชัน JavaScript

#### `extractLazadaProductId(url)`
- **หน้าที่:** ดึงรหัสสินค้าออกจาก URL ของ Lazada
- **พารามิเตอร์:** `url` (string) - URL ของ Lazada
- **ค่าส่งคืน:** `string` - รหัสสินค้า หรือ `null` ถ้าไม่พบ

#### `createLazadaUrl(productId)`
- **หน้าที่:** สร้าง URL ใหม่จากรหัสสินค้า
- **พารามิเตอร์:** `productId` (string) - รหัสสินค้า
- **ค่าส่งคืน:** `string` - URL ใหม่

#### `convertLazadaUrl(originalUrl)`
- **หน้าที่:** แปลง URL เดิมเป็น URL ใหม่ที่มีรูปแบบสั้น
- **พารามิเตอร์:** `originalUrl` (string) - URL เดิมของ Lazada
- **ค่าส่งคืน:** `string` - URL ใหม่ หรือ `null` ถ้าไม่สามารถแปลงได้

#### `shortenLazadaUrl(lazadaUrl)`
- **หน้าที่:** ย่อลิงก์ Lazada โดยใช้ API ของ getlink-lazada.lslly.com
- **พารามิเตอร์:** `lazadaUrl` (string) - URL ของ Lazada ที่ต้องการย่อ
- **ค่าส่งคืน:** `Promise<Object>` - ผลลัพธ์การย่อลิงก์

#### `processLazadaUrl(originalUrl)`
- **หน้าที่:** ประมวลผล URL แบบครบวงจร (ตัดคำ + ย่อลิงก์)
- **พารามิเตอร์:** `originalUrl` (string) - URL เดิมของ Lazada
- **ค่าส่งคืน:** `Promise<Object>` - ผลลัพธ์การประมวลผลครบวงจร

## 🎯 รูปแบบ URL ที่รองรับ

1. **รูปแบบเต็ม:** `/products/ชื่อสินค้า-i{productId}-s{skuId}.html`
2. **รูปแบบสั้น:** `/i{productId}.html`

## 📁 โครงสร้างไฟล์

```
ตัดคำ/
├── lazada-url-parser.js      # ไฟล์ JavaScript หลัก
├── server.js                 # Express API server
├── package.json              # Node.js dependencies
├── captain-definition        # CapRover configuration
├── Dockerfile                # Docker configuration
├── .dockerignore             # Docker ignore files
├── .env                      # Environment variables
├── .gitignore                # Git ignore files
├── test-lazada-parser.html   # ไฟล์ HTML สำหรับทดสอบ
└── README.md                 # ไฟล์คำอธิบาย
```

## 🛠️ การพัฒนา

หากต้องการเพิ่มฟีเจอร์หรือแก้ไขบั๊ก สามารถแก้ไขได้ที่ไฟล์ `lazada-url-parser.js`

## 📄 License

MIT License - ใช้งานได้อย่างอิสระ 
