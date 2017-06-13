const mongoose = require('mongoose');
const { Schema } = mongoose;

const LessonSchema = new Schema({
    title: { type: String, required: true },
    generatorName: { type: String },
    markdown: { type: String, required: true },
    completed: { type: Boolean, required: true }
});

module.exports = mongoose.model('Lesson', LessonSchema);