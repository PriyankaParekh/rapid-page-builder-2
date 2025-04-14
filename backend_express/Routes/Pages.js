const express = require("express");
const Pages = require("../Models/AddPage");
const router = express.Router();
const moment = require('moment-timezone');
const { verifyToken, protectRoute } = require("../jwtVerify");

router.post("/addpage",verifyToken,protectRoute ,async (req, res) => {
  const { title, subtext, body, url, createdBy, id, author, attach } = req.body;
  console.log(req.body);
  let { published } = req.body;

  // Check if any of the required fields are missing
  if (!title || !subtext || !body || !url || !createdBy || !id || !author) {
    return res.status(400).json({ success: false, message: "Required fields are missing" });
  }
  const page = await Pages.findOne({ url });
  if (page) {
    return res.status(400).json({ success: false, message: "Page with the same URL already exists" });
  }
  try {
    // Parse published date if available
    if (published) {
      published = moment(published).tz('Asia/Kolkata').toDate();
    }

    // Extract file paths from the request body
    // const imagePaths = files.map(file => file.path);

    // Create new page with image paths
    await Pages.create({
      title,
      subtext,
      url,
      showAuthor: req.body.showAuthor,
      createdBy,
      modifiedBy:null,
      createdAt: new Date(),
      modifiedAt: null,
      body,
      author,
      attach, // Save image paths
      id,
      status: req.body.status,
      published
    });

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});



router.get("/getallpage", async (req, res) => {
  try {
    const data = await Pages.find();
    res.json({ success: true, data: { data } });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

router.get("/getPublishedPages", async (req, res) => {
  try {
    const data = await Pages.find({status:"Published"});
    res.json({ success: true, data: { data } });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

router.put("/editpage/:id",verifyToken,protectRoute , async (req, res) => {
  const id = req.params.id;
  const updateFields = req.body;

  try {
    // Find the page by id
    const page = await Pages.findById(id);

    // If the page doesn't exist, return a 404 error
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    page.modifiedAt = new Date();

    // Set the modifiedBy field to the current user
    page.modifiedBy = req.body.author;


    let published = req.body.published;

    if(published != ''){
      req.body.published =  moment(published).tz('Asia/Kolkata').toDate();
    }
    // Update only the fields that are provided in the request body
    Object.keys(updateFields).forEach((key) => {
      if (updateFields[key] !== undefined) {
        page[key] = updateFields[key];
      }
    });
console.log(page);
    // Save the updated page
    await page.save();

    // Return a success message
    res.status(200).json({ success: true, data: { page } });
  } catch (error) {
    // Return a 500 error if there's an internal server error
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/getone/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Pages.find({ _id: id });
    res.json({ success: true, data: { data } });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

router.get("/getblog/:url", async (req, res) => {
  const { url } = req.params;
  try {
    const data = await Pages.find({ url: url, status:"Published" });
    if(data.length===0){
    res.json({ success: false});

    } else{

      res.json({ success: true, data: { data } });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});



router.delete("/deleteData/:id", async (req, res) => {
  const result = await Pages.deleteOne({ _id: req.params.id });
  res.send(result);
});

module.exports = router;
