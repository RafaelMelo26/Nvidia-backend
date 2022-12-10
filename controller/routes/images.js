var express = require("express");
var router = express.Router();
const multer = require("multer");
const Image = require("../../model/image");
const fetch = require("node-fetch");
const storage = multer.memoryStorage();
const upload = multer({ storage });
var jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(400).json({ error: "Not authenticated" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return res.status(400).json({ error: "Not authenticated" });
  }

  const name = req.query.name;
  if (!name) {
    return res.status(400).json({ msg: "Name not provided" });
  }

  const Images = await Image.find({
    name: { $regex: name, $options: "i" },
  }).exec();

  if (!Images) {
    return res
      .status(400)
      .json({ error: "No Images were found with this name" });
  }

  res.status(200).json(Images);
});

router.post("/", upload.single("url"), (req, res) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(400).json({ error: "Not authenticated" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return res.status(400).json({ error: "Not authenticated" });
  }

  fetch(`${process.env.URL_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "image/png" },
    body: req.file.buffer,
  })
    .then((r) => r.json())
    .then(
      async (resFile) => {
        const newImage = new Image({
          name: req.body.name,
          url: resFile.url,
        });

        newImage.save();

        return res.status(200).json({ msg: "Created with success" });
      },
      (err) => {
        return res.status(500).json({ msg: "Fail to save image" });
      }
    );
});

module.exports = router;
