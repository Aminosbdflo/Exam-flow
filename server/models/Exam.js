import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ['mcq', 'tf', 'input'], required: true },
  text: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true }
});

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  category: { type: String, default: 'General' },
  isPublished: { type: Boolean, default: false },
  questions: [questionSchema]
}, { timestamps: true });

const Exam = mongoose.model('Exam', examSchema);
export default Exam;
