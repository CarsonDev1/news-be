const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');
const {
	getAllArticles,
	getArticleById,
	createArticle,
	updateArticle,
	deleteArticle,
} = require('../controllers/articleController');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({ storage });

router.get('/articles', getAllArticles);
router.get('/articles/:id', getArticleById);
router.post(
	'/articles',
	auth,
	checkRole(['admin']),
	upload.fields([{ name: 'image' }, { name: 'video' }]),
	createArticle
);
router.put(
	'/articles/:id',
	auth,
	checkRole(['admin']),
	upload.fields([{ name: 'image' }, { name: 'video' }]),
	updateArticle
);
router.delete('/articles/:id', deleteArticle);

router.post('/articles', auth, checkRole(['admin']), createArticle);

module.exports = router;
