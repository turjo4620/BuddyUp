const express = require('express');
const router = express.Router();
const {
  getResearches,
  getResearch,
  createResearch
} = require('../controllers/researchController');

const {
  sendResearchJoinRequest,
  getResearchJoinRequests
} = require('../controllers/researchJoinRequestController');

// Join request routes (specific routes must come before parameterized routes)
router.post('/joinRequests', sendResearchJoinRequest);
router.get('/:researchId/joinRequests', getResearchJoinRequests);

// Research project routes
router.get('/', getResearches);
router.get('/:id', getResearch);
router.post('/', createResearch);

module.exports = router;