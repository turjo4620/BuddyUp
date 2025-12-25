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

router.route('/:id')
  .get(getProfile)
  .put(updateProfile)
  .delete(deleteProfile);

// Additional filtering routes
router.get('/department/:department', getProfilesByDepartment);
router.get('/filter/skills', getProfilesBySkills);

module.exports = router;