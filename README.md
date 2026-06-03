## Backend Fixes
1. Changed index.js to server.js as there was no index file
2. Set up Cloudinary and refresh token secret key in .env
3. Server connected and started successfully
4. Fixed CORS origin from `'http://localhost:5173'` to allow Vercel URL
5. Replaced `jwt.verify(token, process.env.JWT_ACCESS_SECRET)` with `process.env.JWT_SECRET` in authMiddleware
6. `productController.js` — `reduce` mein `-` → `+` (totalStock was calculating incorrectly)
7. `productController.js` — `inventories.filter()` → `inventories.find()` (stock was always undefined)
8. `productController.js` — Cloudinary failure now uses fallback image instead of throwing 500
9. `authController.js` — `sameSite: 'strict'` → `sameSite: 'none'` for cross-origin cookie support
10. `orderController.js` — Stock check condition was inverted `>=` → `<` (was always blocking valid orders)
11. `orderController.js` — `totalAmount` now multiplies `itemPrice * quantity` (was only adding price without quantity)
12. `orderController.js` — Removed swallowing `try/catch` that was hiding all errors as generic 500

## Frontend Fixes
1. `axios.js` — Refresh token URL was hardcoded to `localhost`, changed to use `instance` 
2. `axios.js` — Added guard to prevent infinite retry loop on `/auth/refresh` 401
3. `AuthContext.js` — `response.data.token` → `response.data.accessToken` in login and register (token was never being saved)
4. `AuthContext.js` — On profile fetch error, only remove token on 401, not on 404
5. `Dashboard.jsx` — `showToast` stale closure fix (toasts were never removing)
6. `Dashboard.jsx` — `setLoading(false)` in catch block (spinner never stopped on error)
7. `Dashboard.jsx` — `setLoading(true)` at start of `fetchData` (was set to false before fetch)
8. `Dashboard.jsx` — `/order` → `/orders` route fix (was 404ing)
9. `vercel.json` — Added rewrite rule to fix React Router 404 on direct URL/refresh