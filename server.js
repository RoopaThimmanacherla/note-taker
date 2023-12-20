const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.port || 3001;
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("/*", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json(data);
    }
  });
});
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note.`);

  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const parsedNotes = JSON.parse(data);

        parsedNotes.push(newNote);

        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedNotes, null, 4),
          (err) =>
            err
              ? console.error(err)
              : console.info("successfully updated note!")
        );
        const response = {
          status: "success",
          body: parsedNotes,
        };

        console.log(response);
        res.status(201).json(response);
      }
    });
  } else {
    res.status(500).json("Error in posting review");
  }
});
app.get("/GET/*", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

app.listen(PORT, () =>
  console.log(`app listening at http://localhost:${PORT}`)
);
