const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const jwtSecret = "mynameisPriyankaParekhITVGECsem6$#";

router.post("/register", async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(400).json({ error: 'User with this email already exists', success:false });
  }
  const salt = await bcrypt.genSalt(10);
  let seqPassword = await bcrypt.hash(req.body.password, salt);
  try {
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: seqPassword,
      newsletter: req.body.newsletter,
    });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});


router.post(
    "/login",
    (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        User.findOne({ email }).then((user) => {
            if (!user) {
                return res.status(404).json({ emailnotfound: "Email not found" });
            }
            bcrypt.compare(password, user.password).then((isMatch) => {
                if (isMatch) {
                    const data = {
                        id: user.id,
                        name: user.name,
                    };
                    jwt.sign(
                        data,
                        jwtSecret, {
                            expiresIn: "1h", // 1 year in seconds
                        },
                        (err, authToken) => {
                            res.json({
                                success: true,
                                authToken: authToken,
                                data: data
                            });
                        }
                    );
                    console.log(req.user);
                } else {
                    return res
                        .status(400)
                        .json({ passwordincorrect: "Password incorrect" });
                }
            });
        });
    }
);

  
module.exports = router;
