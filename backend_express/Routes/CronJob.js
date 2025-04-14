const cron = require('node-cron');
const Pages = require("/home/ad.rapidops.com/priyanka.parekh/Documents/vscode/finalProject/Models/AddPage");
const User=require("/home/ad.rapidops.com/priyanka.parekh/Documents/vscode/finalProject/Models/User");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const moment = require("moment-timezone");

const url =
  "mongodb+srv://parekhjainam229:W1xnsWFpStGuUH2P@cluster0.hgklfv1.mongodb.net/pageBuilder";
const connection = mongoose.connect(url);

connection
  .then(() => {
    console.log("successfully connected to DB");
  })
  .catch((err) => {
    console.log("Error in connection", err);
  });

// Define the cron job function to update the entry status based on ID

async function findBlogsScheduledForPublishing() {
  try {
    // Calculate the current date and the date after 24 hours
    const currentDate = moment().tz("Asia/Kolkata");
    const next24HoursDate = moment().tz("Asia/Kolkata").add(24, "hours");

    // Query blogs scheduled for publishing within the next 24 hours
    const blogs = await Pages.find({
      published: { $gte: currentDate.toDate(), $lt: next24HoursDate.toDate() },
    }).select("title id published");
    console.log(blogs);
    const blogsByUser = blogs.reduce((acc, blog) => {
      if (!acc[blog.id]) {
        acc[blog.id] = [];
      }
      acc[blog.id].push(blog);
      return acc;
    }, {});

    for (const id in blogsByUser) {
      const user = await User.findOne({ _id: id }).select("email name");
      if (user) {
        // Get blog entries for the user
        const userBlogEntries = blogsByUser[id];

        // Send email to the user with their blog entries
        await sendEmailToUser(user.email, user.name, userBlogEntries);
      }
    }
  } catch (error) {
    console.error("Error finding blogs scheduled for publishing:", error);
  }
}
async function sendEmailToUser(userEmail, name, blogEntries) {
  try {
    // Compose email message
    const mailOptions = {
      from: "parekhpriyanka177@gmail.com",
      to: userEmail,
      subject: "Scheduled Blog Publishing Reminder",
      text: `Dear User, you have blogs scheduled to be published tomorrow.`,
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

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail} successfully.`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "parekhpriyanka177@gmail.com",
    pass: "znawwvkxomafnhxh",
  },
});
// Schedule the cron job to update entry status for a specific ID every hour
console.log("priyankaaaaaaa");

  findBlogsScheduledForPublishing();
console.log("priyanka");
