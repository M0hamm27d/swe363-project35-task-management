const express = require('express');
const router = express.Router();
const { sendInvite, getMyInvites, respondToInvite } = require('../controllers/inviteController');
const { protect, userOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(userOnly);

// Send a new invite
router.post('/', sendInvite);

// Get my pending invites
router.get('/', getMyInvites);

// Accept or Decline an invite
router.put('/:id', respondToInvite);

module.exports = router;
