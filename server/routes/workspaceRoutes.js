const express = require('express');
const router = express.Router();
const { 
  createWorkspace, 
  getWorkspaces, 
  addMember, 
  removeMember, 
  leaveWorkspace, 
  disbandWorkspace 
} = require('../controllers/workspaceController');
const { protect, userOnly } = require('../middleware/authMiddleware');

// All workspace routes are private and user-only
router.use(protect);
router.use(userOnly);

// URL: /api/workspaces
router.route('/')
  .post(createWorkspace)
  .get(getWorkspaces);

// URL: /api/workspaces/:id
router.route('/:id')
  .delete(disbandWorkspace);

// URL: /api/workspaces/:id/leave
router.delete('/:id/leave', leaveWorkspace);

// URL: /api/workspaces/:id/members
router.route('/:id/members')
  .post(addMember);

router.delete('/:id/members/:userIdToRemove', removeMember);

module.exports = router;
