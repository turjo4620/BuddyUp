const express = require('express');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getProjectMembers,
  updateProjectStatus,
  getProjectsByOwner
} = require('../controllers/projectController');

const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

// Additional project management routes
router.get('/:id/members', getProjectMembers);
router.put('/:id/status', updateProjectStatus);
router.get('/owner/:ownerId', getProjectsByOwner);

module.exports = router;