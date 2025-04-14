
// const cron = require("node-cron");
// const connection=require("../db");
const moment=require('moment-timezone')


async function connection() {
    try {
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'priyanka',
        password: 'qwerty@1234',
        database: 'Project',
      });
      console.log('Connected to the database');
      return connection;
    } catch (error) {
      console.error('Error connecting to the database:', error.message);
      throw error;
    }
  }

// cron.schedule("* * * * *", async () => {
//     try {
//       await updateEntryStatus();
//     } catch (error) {
//       console.error("Error occurred during scheduled task:", error);
//     }
//   });
  
  // Define the updateEntryStatus function
  const updateEntryStatus = async () => {
    try {
      const currentTime = moment().tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
      
      // Get a connection from the pool
      const connectToDatabase = await connection();
    
      // Find entries with status 'scheduled' and publish time less than or equal to current time
      const [rows] = await connectToDatabase.execute(
        'SELECT * FROM pages WHERE published <= ? AND status = "scheduled"',
        [currentTime]
      );
    
      // Release the connectToDatabase
    
      if (!rows || rows.length === 0) {
        console.log('No entries to update.');
        return;
      }
    
      // Update status for each entry
      const blogIds = rows.map(row => row._id);
     
      if (blogIds.length === 0) {
        console.log('No blogs to publish');
        return;
      }
     
      // Update status to 'Published' for the blogs found
      const formattedIds = blogIds.join(',');
      await connectToDatabase.execute(
        `UPDATE pages SET status = "Published" WHERE _id IN (${formattedIds})`
      );
      connectToDatabase.end();
      console.log('Entry status updated successfully.');
    } catch (error) {
      console.error('Error occurred while updating entry status:', error);
    }
  };
  
  updateEntryStatus();
  