const Workspace = require('../models/Workspace');
const WorkspaceMember = require('../models/WorkspaceMember');

/**
 * @desc    Create a new workspace
 * @route   POST /api/workspaces
 */
exports.createWorkspace = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const workspace = await Workspace.create({
      name,
      description,
      color: color || '#1e4db7',
      ownerId: req.user._id
    });

    await WorkspaceMember.create({
      workspaceId: workspace._id,
      userId: req.user._id,
      role: 'Admin'
    });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all workspaces for the user (with member names and roles)
 * @route   GET /api/workspaces
 */
exports.getWorkspaces = async (req, res) => {
  try {
    // 1. Find all workspaces where the user is a member
    const memberships = await WorkspaceMember.find({ userId: req.user._id });
    const workspaceIds = memberships.map(m => m.workspaceId);

    // 2. Fetch those workspaces
    const workspaces = await Workspace.find({ _id: { $in: workspaceIds } }).lean();

    // 3. For each workspace, fetch the members and the current user's role
    const workspacesWithDetails = await Promise.all(workspaces.map(async (ws) => {
      const allMembers = await WorkspaceMember.find({ workspaceId: ws._id }).populate('userId', 'firstName lastName');
      
      return {
        ...ws,
        members: allMembers.map(m => `${m.userId.firstName} ${m.userId.lastName}`),
        role: allMembers.find(m => m.userId._id.toString() === req.user._id.toString())?.role,
        leader: allMembers.find(m => m.role === 'Admin')?.userId?.firstName // For the "Leader: Name" display
      };
    }));

    res.json(workspacesWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Leave a workspace
 * @route   DELETE /api/workspaces/:id/leave
 */
exports.leaveWorkspace = async (req, res) => {
  try {
    await WorkspaceMember.findOneAndDelete({ workspaceId: req.params.id, userId: req.user._id });
    res.json({ message: 'Left workspace successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Disband (Delete) a workspace (Leader Only)
 * @route   DELETE /api/workspaces/:id
 */
exports.disbandWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

    // Only the owner/leader can disband
    if (workspace.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the workspace owner can disband it.' });
    }

    await Workspace.findByIdAndDelete(req.params.id);
    await WorkspaceMember.deleteMany({ workspaceId: req.params.id });
    // Note: You might also want to delete all tasks in this workspace
    res.json({ message: 'Workspace disbanded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Add a member
 */
exports.addMember = async (req, res) => {
  try {
    const { userIdToAdd, role } = req.body;
    const workspaceId = req.params.id;

    const requesterMembership = await WorkspaceMember.findOne({ workspaceId, userId: req.user._id });
    if (!requesterMembership || requesterMembership.role !== 'Admin') {
      return res.status(403).json({ message: 'Only leaders can add members' });
    }

    await WorkspaceMember.create({ workspaceId, userId: userIdToAdd, role: role || 'Member' });
    res.status(201).json({ message: 'Member added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Remove a member
 */
exports.removeMember = async (req, res) => {
  try {
    const { userIdToRemove } = req.params;
    const workspaceId = req.params.id;

    const requesterMembership = await WorkspaceMember.findOne({ workspaceId, userId: req.user._id });
    if (!requesterMembership || requesterMembership.role !== 'Admin') {
      return res.status(403).json({ message: 'Only leaders can remove members' });
    }

    await WorkspaceMember.findOneAndDelete({ workspaceId, userId: userIdToRemove });
    res.json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
