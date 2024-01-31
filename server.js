const express = require("express");
const multer = require("multer");
const app = express();
const port = 80;
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const contacts = [{ name: "john", phone: "123232342", profile: "doctor" }];

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/upload", upload.single("image"), (req, res) => {
  const imageUrl = `/uploads/${req.file.originalname}`;
  res.json({ url: imageUrl });
});

app.post("/add-contact", (req, res) => {
  const { name, phone, profile } = req.body;
  const contact = { name, phone, profile };
  contacts.push(contact);
  res.json({ message: "Contact added successfully", contact });
});

app.get("/get-contacts", (req, res) => {
  res.json({ contacts });
});

app.put("/edit-contact/:name", (req, res) => {
  const name = req.params.name;
  const { phone, profile } = req.body;

  const index = contacts.findIndex((contact) => contact.name === name);

  if (index !== -1) {
    contacts[index].phone = phone;
    contacts[index].profile = profile;
    res.json({ message: "Contact edited successfully", contact: contacts[index] });
  } else {
    res.status(404).json({ message: "Contact not found" });
  }
});

app.delete("/delete-contact/:name", (req, res) => {
  const name = req.params.name;

  const index = contacts.findIndex((contact) => contact.name === name);

  if (index !== -1) {
    const deletedContact = contacts.splice(index, 1);
    res.json({ message: "Contact deleted successfully", contact: deletedContact[0] });
  } else {
    res.status(404).json({ message: "Contact not found" });
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
