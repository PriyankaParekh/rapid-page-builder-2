const express = require("express");
const mongodb = require("./db");
const cors = require("cors");
const app = express();
const moment = require("moment-timezone");
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use(express.json());
app.use("/v1", require("./Routes/Register"));
app.use("/v1", require("./Routes/Pages"));

const cron = require("node-cron");
const Pages = require("./Models/AddPage");
const User = require("./Models/User");
const nodemailer = require("nodemailer");

const updateEntryStatusById = async () => {
  try {
    // Find the entry by ID
    const currentTime = moment().tz("Asia/Kolkata");
    const entry = await Pages.find({
      published: { $lte: currentTime },
      status: "scheduled",
    });

    if (!entry) {
      console.error(`Entry with ID ${id} not found.`);
      return;
    }
    await Promise.all(
      entry.map(async (page) => {
        page.status = "Published";
        await page.save();
      })
    );

    // Get the current time

    // Update entry status based on published time
    //   const publishedTime = new Date(entry.published);
    console.log(entry);
    //   entry.status = "Published";

    // Save the updated entry back to the database
    //   await entry.save();

    console.log(`Entry status updated successfully for ID`);
  } catch (error) {
    console.error(`Error occurred while updating entry status for ID`, error);
  }
};

// Schedule the cron job to update entry status for a specific ID every hour
cron.schedule("* * * * *", async () => {
  try {
    // Pass the ID of the record you want to update
    await updateEntryStatusById();
  } catch (error) {
    console.error("Error occurred during scheduled task:", error);
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "parekhpriyanka177@gmail.com",
    pass: "znawwvkxomafnhxh",
  },
});

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

// Function to find blogs scheduled for publishing within the next 24 hours
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
cron.schedule("0 2 * * *", async () => {
  //year month date hr min
  // Find blogs scheduled for publishing within the next 24 hours and send emails to authors
  console.log("hiii");
  await findBlogsScheduledForPublishing();
});

app.listen(5000, () => {
  console.log(`Example app listening on port 5000`);
});
