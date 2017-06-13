require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const Lesson = require('./models/Lesson');

const seedLessons = require('./seedLessons');

mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI || 'http://localhost:27017/sebulba');

const port = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/lessons', (req, res) => {
    Lesson
      .find()
      .exec()
      .then(lessons => res.json(lessons));
});

app.get('/api/lessons/:id', (req, res) => {
    Lesson
      .findById(req.params.id)
      .exec()
      .then(lesson => lesson ? res.json(lesson) : res.status(404).send());
});

app.post('/api/lessons', (req, res) => {
  const newLesson = new Lesson(req.body);

  newLesson
    .save()
    .then(l => res.json(l));
});

app.get('/api/lessonReset', (req, res) => {
  Lesson
    .find()
    .exec()
    .then(lessons => Promise.all(lessons.map(l => {
      l.completed = false;

      return l.save();
    })))
    .then(() => res.status(200).send());
});


app.put('/api/lessons/:id', (req, res) => {
  Lesson
    .findById(req.params.id)
    .exec()
    .then(l => {
      l.completed = req.body.completed;

      return l.save();
    })
    .then((l) => {
      res.status(200).send(l);
    });
});

app.get('/api/seedLessons/:token', (req, res) => {
  if(req.params.token !== process.env.SECURITY_TOKEN) {
   return res.status(404).send(); 
  } 

  Lesson
    .remove({})
    .then(() => Lesson.insertMany(seedLessons))
    .then(() => res.status(200).send());
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});