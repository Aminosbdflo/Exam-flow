import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    providedAnswer: { type: String },
    isCorrect: { type: Boolean, required: true }
  }]
}, { timestamps: true });

const Result = mongoose.model('Result', resultSchema);
export default Result;
