const http = require('http');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("=".repeat(80));
console.log(" 🚜 VERIFYING TOOLS & MACHINERY RENTAL MODULE ('UBER FOR FARM MACHINERY')");
console.log("=".repeat(80));

let failures = 0;

function assert(condition, testName) {
    if (condition) {
        console.log(`[PASS] ${testName}`);
    } else {
        console.error(`[FAIL] ${testName}`);
        failures++;
    }
}

// 1. Static Files & DOM Check
console.log("\n[Test Suite 1: index.html & styles.css Markup & Styling]");
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');

assert(html.includes('data-tab="rentals"'), "index.html: Nav tab button for Machinery Rental present");
assert(html.includes('id="rentals"'), "index.html: #rentals tab panel present");
assert(html.includes('id="equipment-grid"'), "index.html: #equipment-grid dynamic machine cards container present");
assert(html.includes('id="btn-use-location"'), "index.html: 📍 'Use My Location' GPS button present");
assert(html.includes('id="modal-machine-details"'), "index.html: Machine Details Modal present");
assert(html.includes('id="modal-rental-booking"'), "index.html: 4-Step Rental Booking Modal present");
assert(html.includes('id="modal-list-machine"'), "index.html: 'List Your Machine' Owner Modal present");

assert(css.includes('.rentals-container'), "styles.css: .rentals-container rule defined");
assert(css.includes('.equipment-card'), "styles.css: .equipment-card rule defined");
assert(css.includes('.btn-rent-now'), "styles.css: .btn-rent-now action button defined");
assert(css.includes('.equipment-verified-badge'), "styles.css: Verified Owner badge styled");

// 2. Local Machine Image Assets Check
console.log("\n[Test Suite 2: Machine Image Assets in assets/equipment/]");
const equipDir = path.join(__dirname, 'assets', 'equipment');
const assets = fs.readdirSync(equipDir);
const keyMachines = [
    'mahindra_575_tractor.png',
    'john_deere_tractor.png',
    'sonalika_tractor.png',
    'swaraj_tractor.png',
    'claas_harvester.png',
    'preet_harvester.png',
    'vst_power_tiller.png',
    'kirloskar_power_tiller.png',
    'garuda_kisan_drone.png',
    'dji_agras_drone.png',
    'shaktiman_rotavator.png',
    'happy_seeder_machine.png'
];

keyMachines.forEach(img => {
    assert(assets.includes(img), `Asset file '${img}' present in assets/equipment/`);
});

// 3. Backend REST API Tests
console.log("\n[Test Suite 3: Backend REST API Endpoints on http://localhost:8000]");

function testHttpJson(url, options = {}) {
    return new Promise((resolve, reject) => {
        const req = http.request(url, options, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, raw: data });
                }
            });
        });
        req.on('error', reject);
        if (options.body) req.write(options.body);
        req.end();
    });
}

async function runApiTests() {
    try {
        // GET /api/equipment
        const getRes = await testHttpJson('http://localhost:8000/api/equipment?category=all');
        assert(getRes.status === 200, "GET /api/equipment returned HTTP 200 OK");
        assert(getRes.data.count >= 20, `GET /api/equipment returned ${getRes.data.count} machines (>= 20 requirement)`);
        
        const sample = getRes.data.equipment[0];
        console.log(`   Sample Machine: "${sample.name}" | ₹${sample.rate_hourly}/hr | 📍 ${sample.distance_km} km away | Owner: ${sample.owner_name}`);
        assert(sample.owner_phone && sample.owner_whatsapp, "Owner contact phone and WhatsApp number populated");
        assert(sample.verified === 1, "Owner verification status verified");

        // POST /api/equipment/book
        const bookingPayload = JSON.stringify({
            machine_id: sample.id,
            farmer_name: "Farmer Rajesh Patel",
            farmer_phone: "+91 98765 11223",
            duration_type: "hourly",
            duration_count: 4,
            start_date: "2026-08-15",
            start_time: "07:30 AM",
            fulfillment_type: "delivery"
        });

        const bookRes = await testHttpJson('http://localhost:8000/api/equipment/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bookingPayload) },
            body: bookingPayload
        });

        assert(bookRes.status === 201, "POST /api/equipment/book returned HTTP 201 Created");
        assert(bookRes.data.booking_id && bookRes.data.booking_id.startsWith('KRISHI-RENT-'), `Generated Booking Reference ID: ${bookRes.data.booking_id}`);
        assert(bookRes.data.total_amount > 0, `Computed Transparent Cost Breakdown Total: ₹${bookRes.data.total_amount}`);

        // GET /api/equipment/my-bookings
        const myBookings = await testHttpJson('http://localhost:8000/api/equipment/my-bookings');
        assert(myBookings.status === 200, "GET /api/equipment/my-bookings returned HTTP 200 OK");
        assert(myBookings.data.count >= 1, "Booking persisted in SQLite database and retrieved successfully");

        // GET /api/equipment/owner-dashboard
        const ownerDash = await testHttpJson('http://localhost:8000/api/equipment/owner-dashboard');
        assert(ownerDash.status === 200, "GET /api/equipment/owner-dashboard returned HTTP 200 OK");
        assert(ownerDash.data.total_machines >= 20, `Owner Studio total machines: ${ownerDash.data.total_machines}`);
        assert(ownerDash.data.total_earnings > 0, `Owner Studio gross earnings tracked: ₹${ownerDash.data.total_earnings}`);

        // 4. app.js Runtime & Sandbox Execution
        console.log("\n[Test Suite 4: app.js Sandbox Runtime Validation]");
        const appCode = fs.readFileSync('app.js', 'utf8');

        const mockDom = {
            getElementById: (id) => ({
                id,
                style: {},
                classList: { add: () => {}, remove: () => {}, toggle: () => {} },
                addEventListener: () => {},
                setAttribute: () => {},
                innerHTML: "",
                textContent: "",
                value: ""
            }),
            querySelectorAll: () => [],
            addEventListener: () => {}
        };

        const mockStorage = {};
        const sandbox = {
            window: { addEventListener: () => {} },
            document: mockDom,
            console: { log: () => {}, warn: () => {}, error: () => {} },
            fetch: async () => ({ ok: true, json: async () => ({ equipment: [] }) }),
            navigator: { geolocation: { getCurrentPosition: () => {} } },
            localStorage: {
                getItem: (k) => mockStorage[k] || null,
                setItem: (k, v) => { mockStorage[k] = v; },
                removeItem: (k) => { delete mockStorage[k]; }
            },
            setTimeout: () => {},
            setInterval: () => {},
            alert: () => {},
            Date: Date,
            Math: Math,
            URLSearchParams: URLSearchParams
        };

        vm.createContext(sandbox);
        vm.runInContext(appCode, sandbox);
        console.log("[PASS] app.js parsed, initialized, and executed in mock DOM sandbox with ZERO syntax errors!");

        assert(typeof sandbox.window.renderEquipmentGrid === 'function', "renderEquipmentGrid exposed globally on window");
        assert(typeof sandbox.window.openMachineDetailsModal === 'function', "openMachineDetailsModal exposed globally on window");
        assert(typeof sandbox.window.openRentalBookingModal === 'function', "openRentalBookingModal exposed globally on window");
        assert(typeof sandbox.window.submitRentalBooking === 'function', "submitRentalBooking exposed globally on window");
        assert(typeof sandbox.window.submitMachineListing === 'function', "submitMachineListing exposed globally on window");

        console.log("\n" + "=".repeat(80));
        if (failures === 0) {
            console.log(" 🎉 ALL TOOLS & MACHINERY RENTAL TESTS PASSED WITH 100% SUCCESS! ");
        } else {
            console.error(` ❌ ${failures} TEST(S) FAILED`);
            process.exit(1);
        }
        console.log("=".repeat(80));
    } catch (e) {
        console.error("Test execution failed:", e);
        process.exit(1);
    }
}

runApiTests();
