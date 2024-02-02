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

const products = [
  {
    data: {
      product: {
        is_active: true,
        cod_enabled: false,
        product_return: false,
        id: 42,
        name: "White shoe for men 2",
        description: "while shoe for men , running shoe",
        CategoryId: 1,
        CollectionId: null,
        CollectionStaticId: null,
        ThumbnailId: 4,
        shipping_value: 100,
        shipping_value_type: "SHIPPING_PRICE",
        updatedAt: "2024-01-11T10:20:44.274Z",
        createdAt: "2024-01-11T10:20:44.274Z",
        yt_video_link: null,
        LeadId: null,
      },
      variants: [
        {
          is_active: true,
          id: 95,
          name: "demo Product variant 4 ",
          price: "3000",
          quantity: 1,
          ProductId: 42,
          ThumbnailId: 1,
          createdAt: "2024-01-11T10:20:44.288Z",
          updatedAt: "2024-01-11T10:20:44.288Z",
          premium_price: null,
        },
        {
          is_active: true,
          id: 96,
          name: "demo Product variant 5  ",
          price: "3000",
          quantity: 1,
          ProductId: 42,
          ThumbnailId: 1,
          createdAt: "2024-01-11T10:20:44.288Z",
          updatedAt: "2024-01-11T10:20:44.288Z",
          premium_price: null,
        },
      ],
    },
  },
];

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

app.get("/get-products", (req, res) => {
  res.json({ products });
});

app.get("/", (req, res) => {
  res.json({ message: "Server is running in AWS " });
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
