const mysql = require('mysql2/promise');
const http = require('http');
const nodemailer = require('nodemailer');
const moment = require('moment-timezone');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'parekhpriyanka177@gmail.com',
    pass: 'znawwvkxomafnhxh',
  },
});

async function connectToDatabase() {
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

async function findBlogsScheduledForPublishing() {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM pages WHERE published >= NOW() AND published < DATE_ADD(NOW(), INTERVAL 24 HOUR)');
    const blogsByUser = {};
    rows.forEach(blog => {
      if (!blogsByUser[blog.id]) {
        blogsByUser[blog.id] = [];
      }
      blogsByUser[blog.id].push(blog);
    });

    for (const id in blogsByUser) {
      const [userData] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
      if (userData.length > 0) {
        const user = userData[0];
        await sendEmailToUser(user.email, user.name, blogsByUser[id]);
      }
    }
    connection.end();
  } catch (error) {
    console.error('Error finding blogs scheduled for publishing:', error);
  }
}

async function sendEmailToUser(userEmail, name, blogEntries) {
  try {
    const mailOptions = {
      from: 'parekhpriyanka177@gmail.com',
      to: userEmail,
      subject: 'Scheduled Blog Publishing Reminder',
      text: `Dear ${name}, you have blogs scheduled to be published tomorrow.`,
      html: `
      <!DOCTYPE html>
<html>
<head>
  <title>Email Template</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
  <div style="background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h3 style="color: #333;">Rapid Page Builder</h3>
      </div>
 
      <div style="background-color: #fff; border: 1px solid #e0e0e0; border-radius: 5px; padding: 20px;">
        <p style="font-size: 14px; color: #333; margin: 0;">Good Morning, ${name}</p>
        <p style="font-size: 12px; font-weight: bold; color: #333; margin-top: 10px;">Pages Publishing Today</p>
 
        <!-- Blog Entries -->
        ${blogEntries
          .map(
            (blog) => `
          <div style="margin-bottom: 15px;">
            <p style="font-size: 14px; color: #333; margin: 0;">${
              blog.title
            }</p>
            <p style="font-size: 12px; color: #007bff; margin: 0;">${moment(
              blog.published
            ).format("MMM DD, YYYY")}</p>
            <div style="background-color: #e7f0ff; padding: 10px; border-radius: 5px; margin-top: 5px;">
              <p style="font-size: 12px; color: #333; margin: 0;">Please visit "${
                blog.title
              }"</p>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  </div>
</body>
</html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail} successfully.`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
findBlogsScheduledForPublishing();
