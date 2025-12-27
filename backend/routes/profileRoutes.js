const express = require('express');
const {
  createProfile,
  getProfiles,
  getProfile,
  updateProfile,
  deleteProfile,
  getProfilesByDepartment,
  getProfilesBySkills
} = require('../controllers/profileController');

const router = express.Router();

router.route('/')
  .get(getProfiles)
  .post(createProfile);

// Specific routes must come before parameterized routes
router.get('/department/:department', getProfilesByDepartment);
router.get('/skills/filter', getProfilesBySkills); // Changed from /filter/skills to avoid conflict

router.route('/:id')
  .get(getProfile)
  .put(updateProfile)
  .delete(deleteProfile);

module.exports = router;