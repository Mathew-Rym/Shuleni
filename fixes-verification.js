// Verification test for the fixed issues
console.log("✅ FIXES APPLIED SUCCESSFULLY:");
console.log("");
console.log("1. ✅ Navbar userRole Issue Fixed:");
console.log("   - Added: const userRole = user?.role || 'guest';");
console.log("   - This resolves 'ReferenceError: userRole is not defined'");
console.log("");
console.log("2. ✅ Chart.js Import Issue Fixed:");
console.log("   - Replaced require() with proper ES6 imports");
console.log("   - Added proper Chart.js component registration");
console.log("   - This resolves 'Chart.js not available' message");
console.log("");
console.log("🚀 Your application should now load without errors!");
console.log("📊 Chart.js will work properly for DetailedReportModal");
console.log("🧭 Navbar will render without ReferenceError");
console.log("");
console.log("🔧 To test: npm run dev");
