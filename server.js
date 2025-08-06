require('dotenv').config();
const express = require('express');
const { processLazadaUrl } = require('./lazada-url-parser.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Lazada URL Parser API',
        version: '1.0.0',
        endpoints: {
            '/': 'GET - API info',
            '/process': 'POST - Process Lazada URL (parse and shorten)',
            '/?url=...': 'GET - Process Lazada URL via query parameter'
        },
        examples: {
            'GET /?url=https://www.lazada.co.th/products/...': 'Process URL via query parameter',
            'POST /process': 'Process URL via POST body'
        },
        config: {
            lazadaShortenApi: process.env.LAZADA_SHORTEN_API_URL || 'https://getlink-lazada.lslly.com/api/v1'
        }
    });
});

// GET endpoint with query parameter
app.get('/process', async (req, res) => {
    try {
        const { url } = req.query;
        
        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'URL parameter is required. Use: /process?url=https://www.lazada.co.th/products/...'
            });
        }

        const result = await processLazadaUrl(url);
        res.json(result);
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/process', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'URL is required'
            });
        }

        const result = await processLazadaUrl(url);
        res.json(result);
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📝 API Documentation:`);
    console.log(`   GET /process?url=... - Process Lazada URL via query parameter`);
    console.log(`   POST /process - Process Lazada URL via POST body`);
    console.log(`   Example: curl "http://localhost:${PORT}/process?url=https://www.lazada.co.th/products/..."`);
    console.log(`🔧 Configuration:`);
    console.log(`   Lazada Shorten API: ${process.env.LAZADA_SHORTEN_API_URL || 'https://getlink-lazada.lslly.com/api/v1'}`);
}); 