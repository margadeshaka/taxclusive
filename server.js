const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the Next.js export
app.use(express.static(path.join(__dirname, 'out')));

// Proxy API requests to Strapi if needed
if (process.env.NEXT_PUBLIC_STRAPI_URL) {
  app.use('/api', createProxyMiddleware({
    target: process.env.NEXT_PUBLIC_STRAPI_URL,
    changeOrigin: true,
    pathRewrite: { '^/api': '/api' }
  }));
}

// Handle all other routes by serving the appropriate HTML file
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, 'out', req.path);
  
  // Try to serve the exact path first
  res.sendFile(filePath + '.html', (err) => {
    if (err) {
      // If exact path doesn't exist, try index.html in that directory
      res.sendFile(path.join(filePath, 'index.html'), (err2) => {
        if (err2) {
          // Fall back to 404 page
          res.status(404).sendFile(path.join(__dirname, 'out', '404.html'), (err3) => {
            if (err3) {
              res.status(404).send('Page not found');
            }
          });
        }
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});