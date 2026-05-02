const Tag = require('../models/Tag');
const WorkspaceMember = require('../models/WorkspaceMember');

/**
 * @desc    Get all available tags (Personal + Workspace)
 * @route   GET /api/tags/workspace/:workspaceId
 * @access  Private
 */
exports.getTags = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // 1. Fetch Personal Tags
    const personalTags = await Tag.find({ userId: req.user._id, workspaceId: null });

    // 2. Fetch Workspace Tags (if workspaceId is provided)
    let workspaceTags = [];
    if (workspaceId && workspaceId !== 'null') {
      // Check if user is a member first
      const isMember = await WorkspaceMember.findOne({ workspaceId, userId: req.user._id });
      if (isMember) {
        workspaceTags = await Tag.find({ workspaceId });
      }
    }

    res.json({ personalTags, workspaceTags });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create a new tag
 */
exports.createTag = async (req, res) => {
  try {
    const { name, color, workspaceId } = req.body;

    // If it's a WORKSPACE tag, check if the user is a Leader
    if (workspaceId) {
      const membership = await WorkspaceMember.findOne({ workspaceId, userId: req.user._id });
      if (!membership || membership.role !== 'leader') {
        return res.status(403).json({ message: 'Only team leaders can create tags in a workspace.' });
      }
    }

    const tag = await Tag.create({
      name,
      colorCode: color,
      workspaceId: workspaceId || null,
      userId: req.user._id
    });

    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update a tag
 */
exports.updateTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ message: 'Tag not found' });

    // 1. Personal Tag Security
    if (!tag.workspaceId) {
      if (tag.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
    } 
    // 2. Workspace Tag Security (Leader only)
    else {
      const membership = await WorkspaceMember.findOne({ 
        workspaceId: tag.workspaceId, 
        userId: req.user._id 
      });
      if (!membership || membership.role !== 'leader') {
        return res.status(403).json({ message: 'Only leaders can update workspace tags.' });
      }
    }

    if (req.body.color) {
      req.body.colorCode = req.body.color;
      delete req.body.color;
    }

    const updatedTag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete a tag
 */
exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ message: 'Tag not found' });

    // 1. Personal Tag Security
    if (!tag.workspaceId) {
      if (tag.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
    } 
    // 2. Workspace Tag Security (Leader only)
    else {
      const membership = await WorkspaceMember.findOne({ 
        workspaceId: tag.workspaceId, 
        userId: req.user._id 
      });
      if (!membership || membership.role !== 'leader') {
        return res.status(403).json({ message: 'Only leaders can delete workspace tags.' });
      }
    }

    await tag.deleteOne();
    res.json({ message: 'Tag removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
