import Exam from '../models/Exam.js';
import User from '../models/User.js';
import Result from '../models/Result.js';

// Get all exams (for admin) or published exams (for users)
export const getExams = async (req, res) => {
  try {
    const query = req.user?.role === 'admin' ? {} : { isPublished: true };
    // Only return exam metadata, not questions, to list them
    const exams = await Exam.find(query).select('-questions');
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single exam with questions to take it
export const startExam = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check tokens before taking the exam
    if (user.role !== 'admin' && user.tokens <= 0) {
      return res.status(403).json({ message: 'Insufficient tokens', action: 'REDIRECT_PRICING' });
    }

    const exam = await Exam.findById(req.params.id);
    if (!exam || (!exam.isPublished && user.role !== 'admin')) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Deduct a token
    if (user.role !== 'admin') {
      user.tokens -= 1;
      await user.save();
    }

    // Don't send correct answers to the client
    const examForClient = exam.toObject();
    if (user.role !== 'admin') {
      examForClient.questions.forEach(q => delete q.correctAnswer);
    }

    res.json(examForClient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit exam and auto-grade
export const submitExam = async (req, res) => {
  try {
    const { answers } = req.body; // array of { questionId, providedAnswer }
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    let score = 0;
    const gradedAnswers = answers.map(ans => {
      const question = exam.questions.id(ans.questionId);
      let isCorrect = false;

      if (question) {
        // Simple case-insensitive exact match for input, or exact match for MCQ/TF
        isCorrect = question.correctAnswer.toLowerCase().trim() === (ans.providedAnswer || '').toLowerCase().trim();
        if (isCorrect) score++;
      }

      return {
        questionId: ans.questionId,
        providedAnswer: ans.providedAnswer,
        isCorrect
      };
    });

    const result = await Result.create({
      user: req.user._id,
      exam: exam._id,
      score,
      totalQuestions: exam.questions.length,
      answers: gradedAnswers
    });

    // Save to user history & update progress
    const user = await User.findById(req.user._id);
    user.examHistory.push({
      examId: exam._id,
      examTitle: exam.title,
      score,
      totalQuestions: exam.questions.length,
    });

    // Progress: +10% per exam, capped at 100
    user.graduationProgress = Math.min(user.graduationProgress + 10, 100);

    // Level logic
    if (user.examHistory.length >= 10) user.level = 'Advanced';
    else if (user.examHistory.length >= 5) user.level = 'Intermediate';

    await user.save();

    res.status(201).json({ result, user: { level: user.level, graduationProgress: user.graduationProgress, examHistory: user.examHistory } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin only: Create a new exam
export const createExam = async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin only: Update exam (add questions, change status)
export const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin only: Delete exam
export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
