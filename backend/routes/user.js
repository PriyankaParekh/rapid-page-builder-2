const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../db");
const jwtSecret = "mynameisPriyankaParekhITVGECsem6$#";

async function registerUser(req, res) {
  const connectToDatabase = await connection();

  try {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    }).on("end", async () => {
      const data = JSON.parse(Buffer.concat(body).toString());

      // Check if user already exists
      const [existingUserRows] = await connectToDatabase.execute(
        "SELECT * FROM users WHERE email = ?",
        [data.email]
      );
      if (existingUserRows.length > 0) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "User with this email already exists",
            success: false,
          })
        );
        return;
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      // Insert new user into the database
      const [insertUserResult] = await connectToDatabase.execute(
        "INSERT INTO users (name, email, password, newsletter) VALUES (?, ?, ?, ?)",
        [data.name, data.email, hashedPassword, data.newsletter]
      );

      if (insertUserResult.affectedRows === 1) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      } else {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Internal server error",
            success: false,
          })
        );
      }
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ error: "Internal server error", success: false })
    );
  }
}

async function loginUser(req, res) {
  try {
      const connectToDatabase = await connection();
      
      const body = [];
      req.on("data", (chunk) => {
          body.push(chunk);
      }).on("end", async () => {
          const data = JSON.parse(Buffer.concat(body).toString());
          const { email, password } = data;
          
          // Check if the user exists in the database
          const [userRows] = await connectToDatabase.execute(
              "SELECT * FROM users WHERE email = ?",
              [email]
          );
          if (userRows.length === 0) {
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ emailnotfound: "Email not found" }));
              return;
          }
          
          const user = userRows[0];
          // Compare passwords
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
              const userData = {
                  id: user.id,
                  name: user.name,
              };
              
              jwt.sign(userData, jwtSecret, { expiresIn: 3600*5 }, (err, authToken) => {
                  if (err) {
                      res.writeHead(500, { "Content-Type": "application/json" });
                      res.end(JSON.stringify({ error: "Internal server error" }));
                      return;
                  }
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ success: true, authToken, data: userData }));
              });
          } else {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ passwordincorrect: "Password incorrect" }));
          }
      });
  } catch (error) {
      console.error("Error logging in user:", error.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error", success: false }));
  }
}


module.exports = { registerUser, loginUser };
