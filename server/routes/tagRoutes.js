const express = require('express');
const router = express.Router();
const { getTags, createTag, updateTag, deleteTag } = require('../controllers/tagController');
const { protect, userOnly } = require('../middleware/authMiddleware');

// All tag routes require login and user role
router.use(protect);
router.use(userOnly);

// URL: /api/tags
router.post('/', createTag);

// URL: /api/tags/workspace/:workspaceId
router.get('/workspace/:workspaceId', getTags);

// URL: /api/tags/:id
router.route('/:id')
  .put(updateTag)
  .delete(deleteTag);

module.exports = router;
