: backend
1. i have changed the index.js to the server.js as there was no index file 
2. I setted up the cloudinary and refersh tokens secrect key
3. server got connected and started sucesfully
4. backend me cors ka jo link tha {origin: 'http://localhost:5173'} '/' hata diya hai
5. const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET); ye line replace kar di hai authControllers se kyuki ENV JWT_SECRET likha hai
6. productController.js — reduce mein - → + (totalStock galat calculate ho raha tha)
7. productController.js — inventories.filter() → inventories.find() (stock always undefined tha)
8. productController.js — Cloudinary fail hone par 500 throw karne ki jagah fallback image use karo
9. Dashboard.jsx — showToast stale closure fix (toast remove nahi ho raha tha)
10. Dashboard.jsx — setLoading(true) → setLoading(false) catch block mein