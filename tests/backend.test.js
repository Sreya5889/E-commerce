import http from 'http';
import app from '../server/app.js';
import { pool } from '../server/config/db.js';

let server;
const PORT = 5556;
const BASE_URL = `http://localhost:${PORT}`;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n====================================================');
  console.log('🧪 Running Backend API & Integration Test Suite');
  console.log('====================================================\n');

  try {
    // Start test server
    await new Promise((resolve) => {
      server = app.listen(PORT, resolve);
    });

    // 1. Health Check
    console.log('[1] Health Check Verification');
    const health = await request('GET', '/health');
    assert(health.status === 200 || health.status === 503, 'GET /health returns HTTP 200 (connected) or 503 (disconnected)');
    assert(typeof health.body.success === 'boolean', 'Health response includes success boolean');
    assert(health.body.status !== undefined, 'Health response includes status field');
    assert(health.body.database !== undefined, 'Health response reports database connection status');

    // 2. Authentication & Input Validation
    console.log('\n[2] Authentication & Input Validation (Zod)');
    const invalidRegister = await request('POST', '/api/v1/auth/register', { email: 'notanemail' });
    assert(invalidRegister.status === 400, 'Invalid registration rejects with 400');
    assert(invalidRegister.body.errorCode === 'VALIDATION_ERROR', 'Rejection has VALIDATION_ERROR code');
    assert(Array.isArray(invalidRegister.body.details), 'Rejection provides validation details array');

    const invalidLogin = await request('POST', '/api/v1/auth/login', {});
    assert(invalidLogin.status === 400, 'Empty login payload rejects with 400');
    assert(invalidLogin.body.errorCode === 'VALIDATION_ERROR', 'Empty login payload has VALIDATION_ERROR');

    // 3. Courses API
    console.log('\n[3] Courses API & Pagination');
    const coursesRes = await request('GET', '/api/v1/courses?page=1&limit=5');
    assert(
      coursesRes.status === 200 || coursesRes.status === 503,
      `GET /api/v1/courses handles query (HTTP ${coursesRes.status})`
    );
    if (coursesRes.status === 200) {
      assert(coursesRes.body.success === true, 'Courses response reports success: true');
      assert(Array.isArray(coursesRes.body.data), 'Courses response data is an array');
      assert(coursesRes.body.pagination !== undefined, 'Courses response includes pagination metadata');
    } else {
      assert(coursesRes.body.errorCode === 'DATABASE_UNAVAILABLE', 'Returns DATABASE_UNAVAILABLE when database is offline');
    }

    // 4. Categories API
    console.log('\n[4] Categories Taxonomy');
    const catRes = await request('GET', '/api/v1/categories');
    assert(
      catRes.status === 200 || catRes.status === 503,
      `GET /api/v1/categories handles query (HTTP ${catRes.status})`
    );

    // 5. Instructors API
    console.log('\n[5] Teachers & Instructors API');
    const teachersRes = await request('GET', '/api/v1/teachers');
    assert(
      teachersRes.status === 200 || teachersRes.status === 503,
      `GET /api/v1/teachers handles query (HTTP ${teachersRes.status})`
    );

    // 6. Support & FAQ API
    console.log('\n[6] FAQ & Contact API');
    const faqRes = await request('GET', '/api/v1/support/faq');
    assert(
      faqRes.status === 200 || faqRes.status === 503,
      `GET /api/v1/support/faq handles query (HTTP ${faqRes.status})`
    );

    const contactInvalid = await request('POST', '/api/v1/support/contact', { name: 'A' });
    assert(contactInvalid.status === 400, 'Invalid contact submission rejects with 400');
    assert(contactInvalid.body.errorCode === 'VALIDATION_ERROR', 'Contact validation returns VALIDATION_ERROR');

    // 7. Coupon Validation API
    console.log('\n[7] Coupon Validation Logic');
    const invalidCoupon = await request('POST', '/api/v1/coupons/validate', { code: '', cartSubtotal: 100 });
    assert(invalidCoupon.status === 400, 'Empty coupon code rejected with 400 VALIDATION_ERROR');

    // 8. Public Certificate Verification
    console.log('\n[8] Public Certificate Verification Endpoint');
    const certVerify = await request('GET', '/api/v1/certificates/verify/FAKE-CERT-12345');
    assert(
      certVerify.status === 404 || certVerify.status === 503,
      `Certificate verification handled (HTTP ${certVerify.status})`
    );

    // 9. Authorization & Route Protection
    console.log('\n[9] Authorization & Route Protection');
    const unauthCart = await request('GET', '/api/v1/cart');
    assert(unauthCart.status === 401, 'Protected /cart route rejects unauthenticated request with 401');
    assert(unauthCart.body.errorCode === 'UNAUTHORIZED', 'Unauthenticated request has UNAUTHORIZED code');

    const unauthOrders = await request('GET', '/api/v1/orders');
    assert(unauthOrders.status === 401, 'Protected /orders route rejects with 401');

    const unauthAdmin = await request('GET', '/api/v1/admin/stats');
    assert(unauthAdmin.status === 401, 'Protected /admin/stats rejects with 401');

    console.log('\n====================================================');
    console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
    console.log('====================================================\n');

    if (failed > 0) {
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
    await pool.end();
  }
}

runTests();
