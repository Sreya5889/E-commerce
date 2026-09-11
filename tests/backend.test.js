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

    // 10. Learning Paths API
    console.log('\n[10] Learning Paths API');
    const lpRes = await request('GET', '/api/v1/learning-paths?page=1&limit=20');
    assert(lpRes.status === 200, 'GET /api/v1/learning-paths returns 200');
    assert(Array.isArray(lpRes.body.data), 'Learning paths response contains array of paths');
    assert(lpRes.body.data.length >= 20, `Learning paths contains all 20 IT paths (found ${lpRes.body.data.length})`);
    assert(Boolean(lpRes.body.pagination), 'Learning paths response includes pagination metadata');

    const singleLp = await request('GET', '/api/v1/learning-paths/full-stack-developer');
    assert(singleLp.status === 200, 'GET /api/v1/learning-paths/:slug returns 200 for full-stack-developer');
    assert(singleLp.body.data?.slug === 'full-stack-developer', 'Full Stack Developer path returns correct slug');
    assert(Array.isArray(singleLp.body.data?.stages) && singleLp.body.data.stages.length > 0, 'Learning path contains stages roadmap');

    const searchLp = await request('GET', '/api/v1/learning-paths?search=python');
    assert(searchLp.status === 200, 'GET /api/v1/learning-paths?search=python returns 200');
    assert(searchLp.body.data.some(p => p.title.toLowerCase().includes('python')), 'Search results include Python Developer path');

    const unauthMyLp = await request('GET', '/api/v1/learning-paths/my/paths');
    assert(unauthMyLp.status === 401, 'Protected /learning-paths/my/paths rejects unauthenticated with 401');

    // 11. Aptitude Arena API
    console.log('\n[11] Aptitude Arena API');
    const aptCats = await request('GET', '/api/v1/aptitude/categories');
    assert(aptCats.status === 200, 'GET /api/v1/aptitude/categories returns 200');
    assert(Array.isArray(aptCats.body.data) && aptCats.body.data.length === 4, `Aptitude categories returns 4 categories (found ${aptCats.body.data?.length})`);

    const aptQs = await request('GET', '/api/v1/aptitude/questions?limit=10');
    assert(aptQs.status === 200, 'GET /api/v1/aptitude/questions returns 200');
    assert(Array.isArray(aptQs.body.data) && aptQs.body.data.length > 0, 'Questions returns array of questions');

    const aptMocks = await request('GET', '/api/v1/aptitude/mock-tests');
    assert(aptMocks.status === 200, 'GET /api/v1/aptitude/mock-tests returns 200');
    assert(Array.isArray(aptMocks.body.data) && aptMocks.body.data.length >= 5, `Mock tests returns 5 placement tests (found ${aptMocks.body.data?.length})`);

    const singleMock = await request('GET', '/api/v1/aptitude/mock-tests/comprehensive-it-placement-mock');
    assert(singleMock.status === 200, 'GET /api/v1/aptitude/mock-tests/:slug returns 200');
    assert(singleMock.body.data?.questions?.length === 20, 'Placement grand mock contains 20 questions');

    const dailyCh = await request('GET', '/api/v1/aptitude/daily-challenge');
    assert(dailyCh.status === 200, 'GET /api/v1/aptitude/daily-challenge returns 200');
    assert(dailyCh.body.data?.questions?.length === 5, 'Daily challenge returns 5 questions');

    const achs = await request('GET', '/api/v1/aptitude/achievements');
    assert(achs.status === 200, 'GET /api/v1/aptitude/achievements returns 200');
    assert(Array.isArray(achs.body.data) && achs.body.data.length === 8, 'Returns 8 milestones & achievements');

    // Start and submit an attempt
    const startAttempt = await request('POST', '/api/v1/aptitude/attempts', {
      mode: 'practice',
      total_questions: 2
    });
    assert(startAttempt.status === 201, 'POST /api/v1/aptitude/attempts returns 201');
    const attemptId = startAttempt.body.data?.id;

    const submitAttempt = await request('POST', `/api/v1/aptitude/attempts/${attemptId}/submit`, {
      answers: [
        { questionId: 'q-quant-01', selectedOption: 'A', timeSpentSeconds: 30 },
        { questionId: 'q-quant-02', selectedOption: 'B', timeSpentSeconds: 40 }
      ],
      time_spent_seconds: 70
    });
    assert(submitAttempt.status === 200, 'POST /api/v1/aptitude/attempts/:id/submit returns 200');
    assert(submitAttempt.body.data?.status === 'completed', 'Attempt status updated to completed');
    assert(typeof submitAttempt.body.data?.accuracy === 'number', 'Attempt computes accuracy percentage');
    assert(Array.isArray(submitAttempt.body.data?.topic_performance), 'Attempt computes topic performance breakdown');

    const historyRes = await request('GET', '/api/v1/aptitude/history');
    assert(historyRes.status === 200, 'GET /api/v1/aptitude/history returns 200');

    const analyticsRes = await request('GET', '/api/v1/aptitude/analytics');
    assert(analyticsRes.status === 200, 'GET /api/v1/aptitude/analytics returns 200');
    assert(typeof analyticsRes.body.data?.total_attempts === 'number', 'Analytics aggregates total attempts');

    // 6. CodeLab Sandbox & Problems
    console.log('\n[6] CodeLab Sandbox & DSA/SQL Problems');
    const codeLangs = await request('GET', '/api/v1/codelab/languages');
    assert(codeLangs.status === 200, 'GET /api/v1/codelab/languages returns 200');
    assert(Array.isArray(codeLangs.body.data) && codeLangs.body.data.length >= 4, `Returns supported code languages (found ${codeLangs.body.data?.length})`);

    const codeProblems = await request('GET', '/api/v1/codelab/problems');
    assert(codeProblems.status === 200, 'GET /api/v1/codelab/problems returns 200');
    assert(Array.isArray(codeProblems.body.data) && codeProblems.body.data.length >= 10, `Returns at least 10 coding problems (found ${codeProblems.body.data?.length})`);

    const singleProblem = await request('GET', '/api/v1/codelab/problems/two-sum-dsa');
    assert(singleProblem.status === 200, 'GET /api/v1/codelab/problems/two-sum-dsa returns 200');
    assert(singleProblem.body.data?.starter_templates !== undefined, 'Problem includes starter templates');

    const dailyCode = await request('GET', '/api/v1/codelab/daily');
    assert(dailyCode.status === 200, 'GET /api/v1/codelab/daily returns 200');

    // Sandboxed execution test
    const codeRun = await request('POST', '/api/v1/codelab/execute', {
      language: 'javascript',
      code: 'function twoSum(nums, target) { return [0, 1]; }',
      problem_id: singleProblem.body.data?.id
    });
    assert(codeRun.status === 200, 'POST /api/v1/codelab/execute executes code safely');
    assert(codeRun.body.data?.passedCount >= 1, 'Code evaluation returns test results');

    // 7. Real-World Projects Hub
    console.log('\n[7] Real-World Projects Hub');
    const projectsList = await request('GET', '/api/v1/projects');
    assert(projectsList.status === 200, 'GET /api/v1/projects returns 200');
    assert(Array.isArray(projectsList.body.data) && projectsList.body.data.length >= 4, `Returns projects list (found ${projectsList.body.data?.length})`);

    const singleProj = await request('GET', '/api/v1/projects/full-stack-e-commerce-marketplace');
    assert(singleProj.status === 200, 'GET /api/v1/projects/:slug returns 200');
    assert(singleProj.body.data?.steps?.length >= 3, 'Project blueprint contains step-by-step milestones');

    // 8. Interview Hub
    console.log('\n[8] Technical & HR Interview Hub');
    const interviewCats = await request('GET', '/api/v1/interview/categories');
    assert(interviewCats.status === 200, 'GET /api/v1/interview/categories returns 200');

    const interviewQs = await request('GET', '/api/v1/interview/questions');
    assert(interviewQs.status === 200, 'GET /api/v1/interview/questions returns 200');
    assert(Array.isArray(interviewQs.body.data) && interviewQs.body.data.length >= 10, `Returns at least 10 interview questions (found ${interviewQs.body.data?.length})`);

    const interviewPlans = await request('GET', '/api/v1/interview/plans');
    assert(interviewPlans.status === 200, 'GET /api/v1/interview/plans returns 200');

    // 9. Career Dashboard & Gamification
    console.log('\n[9] Career Readiness & Gamification Engine');
    const readiness = await request('GET', '/api/v1/career/readiness');
    assert(readiness.status === 200, 'GET /api/v1/career/readiness returns 200');
    assert(typeof readiness.body.data?.readinessScore === 'number', 'Readiness score is computed');
    assert(readiness.body.data?.breakdown !== undefined, 'Breakdown across 6 modules is computed');

    const gamificationProf = await request('GET', '/api/v1/gamification/profile');
    assert(gamificationProf.status === 200, 'GET /api/v1/gamification/profile returns 200');
    assert(typeof gamificationProf.body.data?.total_xp === 'number', 'Gamification profile returns total_xp');

    // 10. Curated Jobs & Internships
    console.log('\n[10] Curated Tech Jobs & Internships');
    const jobsList = await request('GET', '/api/v1/jobs');
    assert(jobsList.status === 200, 'GET /api/v1/jobs returns 200');
    assert(Array.isArray(jobsList.body.data) && jobsList.body.data.length >= 4, `Returns active tech jobs (found ${jobsList.body.data?.length})`);

    // 11. AI Career Assistant
    console.log('\n[11] AI Career Assistant');
    const aiChat = await request('POST', '/api/v1/ai-career/chat', {
      message: 'What should I learn next to become a full stack developer?'
    });
    assert(aiChat.status === 200, 'POST /api/v1/ai-career/chat returns 200');
    assert(typeof aiChat.body.data?.reply === 'string', 'AI Assistant returns contextual guidance');
    assert(Array.isArray(aiChat.body.data?.actionLinks), 'AI Assistant returns structured actionLinks');

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
