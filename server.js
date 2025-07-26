const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 8080;

console.log("Starting Taxclusive static server...");

// Serve static files from the out directory
app.use(
  express.static(path.join(__dirname, "out"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  })
);

// Handle all routes by serving appropriate HTML files
app.get("*", (req, res) => {
  const requestedPath = req.path;

  // Remove trailing slash if present
  const cleanPath = requestedPath.replace(/\/$/, "") || "/";

  // Try different file paths
  const possiblePaths = [
    path.join(__dirname, "out", cleanPath + ".html"),
    path.join(__dirname, "out", cleanPath, "index.html"),
    path.join(__dirname, "out", cleanPath),
    path.join(__dirname, "out", "index.html"),
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return res.sendFile(filePath);
    }
  }

  // Fall back to 404
  const notFoundPath = path.join(__dirname, "out", "404.html");
  if (fs.existsSync(notFoundPath)) {
    return res.status(404).sendFile(notFoundPath);
  }

  res.status(404).send("Page not found");
});

app.listen(PORT, () => {
  console.log(`✓ Taxclusive server running on port ${PORT}`);
  console.log(`✓ Serving files from: ${path.join(__dirname, "out")}`);
  const outDir = path.join(__dirname, "out");
  if (fs.existsSync(outDir)) {
    console.log(`✓ Out directory exists with ${fs.readdirSync(outDir).length} files`);
  } else {
    console.error("✗ Out directory does not exist!");
  }
});
