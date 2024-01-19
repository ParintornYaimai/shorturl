const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const ShortUrl = require("./models/shortUrlSchema"); // Change variable name to ShortUrl
const shortId = require("shortid");
const QRCode = require("qrcode");
app.set("view engine", "ejs");


//connect to database
mongoose
  .connect(process.env.DATABASE)

  .then(() => console.log("connected to database"))
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find(); 
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
    const shortUrl = `http://${req.headers.host}/${shortId.generate()}`;
    // Generate QR Code from the short URL
    const qrCode = await QRCode.toDataURL(shortUrl); 
    await ShortUrl.create({
      full: req.body.fullurl,
      short: shortUrl,
      qrCode: qrCode, 
    });
    res.redirect("/");
  });

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({
    short: `http://${req.headers.host}/${req.params.shortUrl}`,
  });
  if (shortUrl == null) return res.sendStatus(404);
  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.full);
});

app.listen(3000, () => console.log("Server ready"));
