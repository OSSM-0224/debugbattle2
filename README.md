: backend
1. i have changed the index.js to the server.js as there was no index file 
2. I setted up the cloudinary and refersh tokens secrect key
3. server got connected and started sucesfully
4. backend me cors ka jo link tha {origin: 'http://localhost:5173'} '/' hata diya hai
5. const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET); ye line replace kar di hai authControllers se kyuki ENV JWT_SECRET likha hai
6.