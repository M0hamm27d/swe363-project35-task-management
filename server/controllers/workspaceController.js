const Workspace = require('../models/Workspace');
const WorkspaceMember = require('../models/WorkspaceMember');

/**
 * @desc    Create a new workspace
 * @route   POST /api/workspaces
 * @access  Private (User Only)
 */
exports.createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;

    // 1. Create the Workspace
    const workspace = await Workspace.create({
      name,
      description,
      ownerId: req.user._id // The creator is the owner
    });

    // 2. Automatically add the creator as the 'Admin' (Leader) of this workspace
    await WorkspaceMember.create({
      workspaceId: workspace._id,
      userId: req.user._id,
      role: 'Admin' // In your schema, Admin = Leader
    });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all workspaces for the logged-in user
 * @route   GET /api/workspaces
 * @access  Private (User Only)
 */
exports.getWorkspaces = async (req, res) => {
  try {
    // 1. Find all memberships for this user
    const memberships = await WorkspaceMember.find({ userId: req.user._id }).populate('workspaceId');

    // 2. Extract just the workspace data from the memberships
    const workspaces = memberships.map(m => m.workspaceId);

    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Add a member to a workspace
 * @route   POST /api/workspaces/:id/members
 * @access  Private (Leader Only)
 */
exports.addMember = async (req, res) => {
  try {
    const { userEmail, role } = req.body;
    const workspaceId = req.params.id;

    // 1. Check if the logged-in user is the LEADER of this workspace
    const requesterMembership = await WorkspaceMember.findOne({
      workspaceId,
      userId: req.user._id
    });

    if (!requesterMembership || requesterMembership.role !== 'Admin') {
      return res.status(403).json({ message: 'Only workspace leaders can add members' });
    }

    // 2. Find the user to add (You might need a User.findOne here if sending email)
    // For now, let's assume we send the userId in the request for simplicity
    const { userIdToAdd } = req.body;

    // 3. Check if they are already a member
    const alreadyMember = await WorkspaceMember.findOne({ workspaceId, userId: userIdToAdd });
    if (alreadyMember) {
      return res.status(400).json({ message: 'User is already a member of this workspace' });
    }

    // 4. Add the new member
    const newMember = await WorkspaceMember.create({
      workspaceId,
      userId: userIdToAdd,
      role: role || 'Member'
    });

    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Remove a member from a workspace
 * @route   DELETE /api/workspaces/:id/members/:userId
 * @access  Private (Leader Only)
 */
exports.removeMember = async (req, res) => {
  try {
    const workspaceId = req.params.id;
    const userIdToRemove = req.params.userId;

    // 1. Check if the requester is the LEADER
    const requesterMembership = await WorkspaceMember.findOne({
      workspaceId,
      userId: req.user._id
    });

    if (!requesterMembership || requesterMembership.role !== 'Admin') {
      return res.status(403).json({ message: 'Only workspace leaders can remove members' });
    }

    // 2. Prevent leader from removing themselves (Optional safety check)
    if (userIdToRemove === req.user._id.toString()) {
      return res.status(400).json({ message: 'Leaders cannot remove themselves from their own workspace' });
    }

    // 3. Remove the member
    await WorkspaceMember.findOneAndDelete({ workspaceId, userId: userIdToRemove });

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
