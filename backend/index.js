const mysql = require("mysql2/promise");
const http = require("http");
const cronStatus=require('./routes/cronStatus');
const url = require("url");
const { registerUser, loginUser } = require("./routes/user");
const { addPage, getAllPages, DeleteData, getOne, editData, getPublishedPages, getBlog } = require("./routes/pages");
const {verifyToken, protectRoute}=require("./routes/jwtVerify");
const PORT = 5000;

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Adjust as needed for your domain
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  const { pathname } = url.parse(req.url, true);

    // Check if the request path starts with /v1
    if (pathname.startsWith("/v1")) {
        // Exclude token verification for login, register, getallpublished, and getbyurl routes
        if (req.method === "POST" && pathname === "/v1/register") {
            registerUser(req, res);
        } else if (req.method === "POST" && pathname === "/v1/login") {
            loginUser(req, res);
        } else if (req.method === "GET" && pathname === "/v1/getPublishedPages") {
            getPublishedPages(req, res);
        } else if (req.method === "GET" && pathname.startsWith("/v1/getblog/")) {
            const url = pathname.split("/")[3]; // Extract the item ID from the URL
            console.log(url);
            getBlog(req, res, url);
        } else {
            // Apply token verification middleware to all other routes under /v1
            verifyToken(req, res, () => {
                // Route handling logic
                if (req.method === "POST" && pathname === "/v1/addpage") {
                    // Apply protectRoute middleware to protect the addpage route
                    protectRoute(req, res, () => {
                        addPage(req, res);
                    });
                } else if (req.method === "DELETE" && pathname.startsWith("/v1/deleteData/")) {
                    const id = pathname.split("/")[3]; // Extract the item ID from the URL
                    protectRoute(req, res, () => {
                        DeleteData(req, res, id);
                    });
                } else if (req.method === "PUT" && pathname.startsWith("/v1/editpage/")) {
                    const id = pathname.split("/")[3]; // Extract the item ID from the URL
                    protectRoute(req, res, () => {
                        editData(req, res, id);
                    });
                } else if (req.method === "GET" && pathname.startsWith("/v1/getone/")) {
                    const id = pathname.split("/")[3]; // Extract the item ID from the URL
                    protectRoute(req, res, () => {
                        getOne(req, res, id);
                    });
                } else if (req.method === "GET" && pathname === "/v1/getallpage") {
                    protectRoute(req, res, () => {
                        getAllPages(req, res);
                    });
                } else {
                    res.writeHead(404, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Not found", success: false }));
                }
            });
        }
    } else {
        // Handle non-/v1 routes
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }
});



const connection = require("./db");
const { collection } = require("../Models/AddPage");
if (connection) {
  console.log("db connected successfully");
} else {
  console.log("err");
}


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
