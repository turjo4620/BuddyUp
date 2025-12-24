const JoinRequest = require('../models/JoinRequest');

// Send join request
exports.sendRequest = async (req, res) => {
    try {
        const request = new JoinRequest(req.body);
        await request.save();
        res.status(201).json(request);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get join requests for a project
exports.getRequests = async (req, res) => {
    try {
        const requests = await JoinRequest.find({ projectId: req.params.projectId });
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
