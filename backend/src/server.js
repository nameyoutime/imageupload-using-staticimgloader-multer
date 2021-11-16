const mongoose = require("mongoose");
const express = require("express");
const body = require("body-parser");
const Database = require("./database");
const imgSchema = require("../schemas/image.schemas");
const path = require('path');
const cors = require("cors");
const multer = require('multer');
const fs = require('fs');
const config = require("./config");

const app = express();
const db = new Database();
app.use(body.json());
app.use(cors({ origin: "*" }));

const Img = mongoose.model("img", imgSchema);

const dir = path.join(__dirname, 'public');
const enpointFront = `http://${config.HOST}:${config.PORT}/img?name=`

// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public')
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}-${Date.now()}`)
  }
})

const upload = multer({
  storage: storage
});

// ROUTES
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
})

app.post('/file', upload.array('file'), (req, res, next) => {
  file = req.file;
  let { data } = req.body;
  let temp = JSON.parse(data.toString());
  if (!file) {
    const error = new Error('No File')
    error.httpStatusCode = 400
    return next(error)
  }
  // console.log(req.file)

  // temp.file = req.file.filename
  // const img = new Img(temp);
  // db.createTask(img);
  res.send({ message: `item ${img.title} was created` });
})


app.post('/files', upload.array('files'), (req, res, next) => {
  const files = req.files;
  let { data } = req.body;
  let temp = JSON.parse(data.toString());
  if (!files) {
    const error = new Error('No File')
    error.httpStatusCode = 400
    return next(error)
  }
  // console.log(req.files.length)
  temp.file = [];
  for (let i = 0; i < files.length; i++) {
    temp.file.push({
      image: enpointFront + files[i].filename,
      thumbImage: enpointFront + files[i].filename,
      imageName: files[i].filename
    })
  }
  // console.log(temp)
  const img = new Img(temp);
  db.createTask(img);
  res.send({ sttus: 'ok' });
})

app.get("/imgs", async (req, res) => {
  let result = await Img.find();
  res.send(result);
});

app.delete("/delete", async (req, res) => {
  const { id } = req.query;
  try {
    let result = await Img.findById(id);
    let file = result.file;
    await Img.deleteOne({ _id: id });
    for (let i = 0; i < result.file.length; i++) {
      let path = `src/public/${file[i].imageName}`
      await fs.unlinkSync(path, (err) => {
        console.log(err)
      })
    }
    res.send(
      {
        message: `deleteted ${id}`
      }
    );
  } catch (e) {
    res.send({
      message: `can't delete ${id}`
    })
  }
});


app.get('/img', (req, res) => {

  let mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
  };
  let file = path.join(dir, req.query.name);
  let type = mime[path.extname(file).slice(1)] || 'text/plain';
  let s = fs.createReadStream(file);
  s.on('open', function () {
    res.set('Content-Type', type);
    s.pipe(res);
  });
  s.on('error', function () {
    res.set('Content-Type', 'text/plain');
    res.status(404).end('Not found');
  });
});

// app.get("/tasks", async (req, res) => {
//   let result = await Task.find();
//   res.send({
//     items: result,
//   });
// });

// app.post("/createTasks", (req, res) => {
//   let { name, content } = req.body;
//   const task1 = new Task({
//     name: name,
//     content: content,
//     createDate: Date.now(),
//     deadLine: Date.now() + 1000 * 60 * 60 * 24,
//   });

//   db.createTask(task1);
//   res.send(`item ${name} was created`);
// });

// app.delete("/delete", async (req, res) => {
//   const { name } = req.query;
//   try {
//     await Task.findOneAndRemove(name);
//     res.send(`destroy ${name}`);
//   }catch(e){
//       res.send({
//           message: `can't delete ${name}`
//       })
//   }
// });

// app.put("/update",async(req,res)=>{
//     const{name}=req.query;

//     Task.findOneAndUpdate(name,{
//         content:"hello"
//     })

//     res.send(`update ${name}`)
// })

module.exports = app;
