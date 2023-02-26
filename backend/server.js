const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const Schema = mongoose.Schema;
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

// Connect Server
app.listen(4000, () => {
  console.log("server is up and running on port 4000");
});

// Connect DB
//remplacer avec le string connection obtenue sur MongoDB Atlas
// <username> : le username de votre choix à la création d'un nouveau user
// <password> : noter et conserver ce password
// <database> : le nom de la base de données que vous avez crééé
// exemple = mongodb+srv://<username>:<password>@clustermern-j9nty.mongodb.net/<database>?retryWrites=true&w=majority
const db = "mongodb+srv://fallalioune:test1234@cluster0.ubsfmis.mongodb.net/data";
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("successfully connected to db"))
  .catch((err) => console.log(err));

//Todo Schema
let todoSchema = new Schema({
  text: String,
  isCompleted: Boolean,
});
let Todo = mongoose.model("Todo", todoSchema);

//Routes
app.use("/todos", router);

//read
router.route("/").get(function (_, res) {
  Todo.find(function (err, items) {
    if (err) {
      res.send(400).send(`ERROR ${err}`);
    } else {
      res.status(200).send(items);
    }
  });
});

//create
router.route("/add").post(function (req, res) {
  let todo = new Todo(req.body);
  todo
    .save()
    .then(() => {
      res.status(200).send({ message: `${todo.text} is successfully added` });
    })
    .catch((err) =>
      res.status(400).send({ error: `error adding document ${err}` })
    );
});

//update
router.route("/:id").put(function (req, res) {
  Todo.findByIdAndUpdate(req.params.id, req.body)
    .then((todo) => {
      todo.isCompleted = !todo.isCompleted;
      todo.save();
      res.status(200).send({ message: `${todo.text} is successfully updated` });
    })
    .catch((err) =>
      res.status(400).send({ error: `error adding document ${err}` })
    );
});

//delete
router.route("/:id").delete(function (req, res) {
  Todo.findByIdAndRemove(req.params.id, function () {
    res.status(200).send({ message: `todo is successfully deleted` });
  }).catch((err) =>
    res.status(400).send({ error: `error adding document ${err}` })
  );
});
