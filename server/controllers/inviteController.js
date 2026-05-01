const WorkspaceInvite = require('../models/WorkspaceInvite');
const WorkspaceMember = require('../models/WorkspaceMember');
const User = require('../models/User');

/**
 * @desc    Send an invite to a user
 * @route   POST /api/invites
 * @access  Private (Leader Only)
 */
exports.sendInvite = async (req, res) => {
  try {
    const { workspaceId, userEmail } = req.body;

    // 1. Check if the requester is the LEADER of the workspace
    const requesterMembership = await WorkspaceMember.findOne({
      workspaceId,
      userId: req.user._id
    });

    if (!requesterMembership || requesterMembership.role !== 'Admin') {
      return res.status(403).json({ message: 'Only workspace leaders can send invitations.' });
    }

    // 2. Find the user to invite
    const userToInvite = await User.findOne({ email: userEmail });
    if (!userToInvite) {
      return res.status(404).json({ message: 'User with this email not found.' });
    }

    // 3. Check if they are already a member
    const alreadyMember = await WorkspaceMember.findOne({ workspaceId, userId: userToInvite._id });
    if (alreadyMember) {
      return res.status(400).json({ message: 'User is already a member of this workspace.' });
    }

    // 4. Check if an invite is already pending
    const existingInvite = await WorkspaceInvite.findOne({ workspaceId, receiverId: userToInvite._id, status: 'pending' });
    if (existingInvite) {
      return res.status(400).json({ message: 'An invitation is already pending for this user.' });
    }

    // 5. Create the Invite
    const invite = await WorkspaceInvite.create({
      workspaceId,
      senderId: req.user._id,
      receiverId: userToInvite._id,
      status: 'pending'
    });

    res.status(201).json(invite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all pending invites for the logged-in user
 * @route   GET /api/invites
 * @access  Private
 */
exports.getMyInvites = async (req, res) => {
  try {
    const invites = await WorkspaceInvite.find({ receiverId: req.user._id, status: 'pending' })
      .populate('workspaceId', 'name')
      .populate('senderId', 'firstName lastName');
    
    res.json(invites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Accept or Decline an invite
 * @route   PUT /api/invites/:id
 * @access  Private
 */
exports.respondToInvite = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'declined'
    const invite = await WorkspaceInvite.findById(req.params.id);

    if (!invite) return res.status(404).json({ message: 'Invitation not found.' });

    // Ensure only the receiver can respond
    if (invite.receiverId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized.' });
    }

    if (status === 'accepted') {
      // 1. Create the membership
      await WorkspaceMember.create({
        workspaceId: invite.workspaceId,
        userId: invite.receiverId,
        role: 'Member'
      });
      
      invite.status = 'accepted';
    } else {
      invite.status = 'declined';
    }

    await invite.save();
    res.json({ message: `Invitation ${status} successfully.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
