const connection = require("../db");
const moment = require("moment-timezone");

async function addPage(req, res) {
  const connectToDatabase = await connection();

  try {
    // Parse request body
    let body = [];
    req
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", async () => {
        const requestData = JSON.parse(Buffer.concat(body).toString());

        // Extract required fields from request body
        const {
          title,
          subtext,
          body: pageBody,
          url,
          createdBy,
          id,
          author,
          attach,
          showAuthor,
          status,
        } = requestData;
        let { published } = requestData;
        // console.log(requestData);
        // Check if any required fields are missing
        if (
          !title ||
          !subtext ||
          !pageBody ||
          !url ||
          !createdBy ||
          !id ||
          !author
        ) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              message: "Required fields are missing",
            })
          );
          return;
        }

        // Create a database connection

        // Check if a page with the same URL already exists
        const [existingPages] = await connectToDatabase.execute(
          "SELECT * FROM pages WHERE url = ?",
          [url]
        );
        if (existingPages.length > 0) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              message: "Page with the same URL already exists",
            })
          );
          return;
        }
        let datee = null;
        // Parse published date if available
        if (published) {
          datee = moment(published).tz("Asia/Kolkata").toDate();
        }

        // Insert new page into the database
        await connectToDatabase.execute(
          "INSERT INTO pages (title, subtext, url, showAuthor, createdBy, body, author, attach, id, status, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            title,
            subtext,
            url,
            showAuthor,
            createdBy,
            pageBody,
            author,
            attach,
            id,
            status,
            datee,
          ]
        );

        // Close the database connectToDatabase
        await connectToDatabase.end();

        // Send success response
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      });
  } catch (error) {
    console.error("Error adding page:", error.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: false, message: "Internal server error" })
    );
  }
}

async function getAllPages(req, res) {
  try {
    const connectToDatabase = await connection();

    // Execute a SELECT query to retrieve all pages
    const [rows] = await connectToDatabase.execute("SELECT * FROM pages");

    // Close the database connectToDatabase
    await connectToDatabase.end();
    const data = { data: rows };
    // Send the retrieved data as JSON in the response
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, data: data }));
  } catch (error) {
    console.error("Error adding page:", error.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: false, message: "Internal server error" })
    );
  }
}

async function DeleteData(req, res, id){
    try{
        const connectToDatabase = await connection();
        const [result] = await connectToDatabase.execute('DELETE FROM pages WHERE _id = ?', [id]);
    
        // Close the database connectToDatabase
        await connectToDatabase.end();
    
        // Send the result of the deletion operation in the response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Record deleted successfully', affectedRows: result.affectedRows }));
     
    }  catch (error) {
        console.error("Error adding page:", error.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ success: false, message: "Internal server error" })
        );
      }
}

async function editData(req, res, id) {
  let body = [];
  req.on('data', (chunk) => {
      body.push(chunk);
  });

  req.on('end', async () => {
      try {
          body = Buffer.concat(body).toString();
          const updateFields = JSON.parse(body);

          const connectToDatabase = await connection();

          const [rows] = await connectToDatabase.execute('SELECT * FROM pages WHERE _id = ?', [id]);
          const page = rows[0];
          if (!page) {
              res.writeHead(404, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Page not found' }));
              return;
          }

          const modifiedAt = new Date();
          await connectToDatabase.execute('UPDATE pages SET modifiedAt = ? WHERE _id = ?', [modifiedAt, id]);

          if (updateFields.author !== undefined) {
              const modifiedBy = updateFields.author;
              await connectToDatabase.execute('UPDATE pages SET modifiedBy = ? WHERE _id = ?', [modifiedBy, id]);
          }

          if (updateFields.published !== '') {
            const published = moment(updateFields.published).tz("Asia/Kolkata");
            const formattedPublished = published.format("YYYY-MM-DD HH:mm:ss");
            console.log("Formatted published datetime:", formattedPublished); // Log the formatted datetime
            await connectToDatabase.execute('UPDATE pages SET published = ? WHERE _id = ?', [formattedPublished, id]);
        } else {
            console.log("No valid published datetime provided.");
        }

          const updateQueries = Object.entries(updateFields).map(([key, value], index) => {
              if (key === 'author' || key === '_id') return null;
              const query = `UPDATE pages SET ${key} = ? WHERE _id = ?`;
              return connectToDatabase.execute(query, [value, id]);
          });

          await Promise.all(updateQueries);

          connectToDatabase.end();

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, data: { page: updateFields } }));
      } catch (error) {
          console.error('Error updating page:', error.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Internal server error' }));
      }
  });
}

async function getOne(req, res, id) {
    const connectToDatabase = await connection();

    try {
        const [rows] = await connectToDatabase.execute('SELECT * FROM pages WHERE _id = ?', [id]);
        
        if (rows.length > 0) {
            const data = { data: rows };
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, data: data }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Record not found' }));
        }
      } catch (error) {
        console.error('Error fetching record:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Internal server error' }));
      }
}

async function getPublishedPages(req, res) {
    try {
        const connectToDatabase = await connection();
  
        // Execute the SQL query to fetch published pages
        const [rows] = await connectToDatabase.execute('SELECT * FROM pages WHERE status = ?', ['Published']);
  
        // Close the connection connectToDatabase
        await connectToDatabase.end();
        const data = { data: rows };
  
        // Send the response with the fetched data
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, data: data }));
      } catch (error) {
        console.error('Error fetching published pages:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: 'Internal server error' }));
      }
}

async function getBlog(req, res, url) {
    try {
        const connectToDatabase = await connection();
  
        // Execute the SQL query to fetch the blog by URL and status "Published"
        const [rows] = await connectToDatabase.execute('SELECT * FROM pages WHERE url = ? AND status = ?', [url, 'Published']);
  
        // Close the connection connectToDatabase
        await connectToDatabase.end();
        const data = { data: rows };
        // Check if data is found or not
        if (rows.length === 0) {
          res.writeHead(200);
          res.end(JSON.stringify({ success: false }));
        } else {
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, data: data }));
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: 'Internal server error' }));
      }
   
}
module.exports = { addPage, getAllPages, DeleteData, editData, getOne, getPublishedPages, getBlog };
