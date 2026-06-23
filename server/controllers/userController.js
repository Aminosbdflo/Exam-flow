import User from '../models/User.js';
import Exam from '../models/Exam.js';
import Result from '../models/Result.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        tokens: user.tokens,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id }).populate('exam', 'title duration');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin only
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Admin only
export const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalExams = await Exam.countDocuments();
    const totalResults = await Result.countDocuments();

    // Difficulty breakdown
    const difficultyStats = await Exam.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);

    // Recent results
    const recentResults = await Result.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('exam', 'title');

    // Recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    res.json({
      totalUsers,
      totalExams,
      totalResults,
      difficultyStats,
      recentResults,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin only: Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin only: Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
