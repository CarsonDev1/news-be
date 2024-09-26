const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { validationResult } = require('express-validator');

exports.signup = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

	const { username, email, password } = req.body;

	try {
		let user = await User.findOne({ email });
		if (user) return res.status(400).json({ msg: 'User already exists' });

		user = new User({ username, email, password });
		await user.save();

		const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

		res.status(201).json({
			msg: 'User registered successfully',
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
			},
			token,
		});
	} catch (error) {
		res.status(500).send('Server error');
	}
};

exports.signin = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

		const isMatch = await user.comparePassword(password);
		if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

		const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

		res.json({
			msg: 'Login successful',
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
			},
			token,
		});
	} catch (error) {
		res.status(500).send('Server error');
	}
};

exports.getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user.userId).select('-password');
		if (!user) {
			return res.status(404).json({ msg: 'User not found' });
		}
		res.json(user);
	} catch (error) {
		res.status(500).send('Server error');
	}
};
