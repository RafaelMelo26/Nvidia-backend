var express = require("express");
var router = express.Router();
const { validateToken } = require("./authLogin");
const multer = require("multer");
const Image = require("../../model/image");
const fetch = require("node-fetch");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", async (req, res) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(400).json({ error: "Not authenticated" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decoded) {
    if (err) return res.status(400).json({ error: "Not authenticated" });

    req.token = token;
    req.userId = decoded.id;
  });
  const { name } = req.query;
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

router.post("/", upload.single("image"), (req, res) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(400).json({ error: "Not authenticated" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decoded) {
    if (err) return res.status(400).json({ error: "Not authenticated" });

    req.token = token;
    req.userId = decoded.id;
  });
  fetch(`${process.env.FILESTACK_URL_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "image/png" },
    body: req.file.buffer,
  })
    .then((r) => r.json())
    .then(
      async (resFile) => {
        const newCard = new Image({
          name: req.body.name,
          url: resFile.url,
        });

        newCard.save();

        return res.status(200).json({ msg: "Created with success" });
      },
      (err) => {
        return res.status(500).json({ msg: "Fail to save image" });
      }
    );
});

module.exports = router;
