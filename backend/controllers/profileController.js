const Profile = require('../models/Profile');

// Create a new profile
exports.createProfile = async (req, res) => {
    try {
        const profile = new Profile(req.body);
        await profile.save();
        res.status(201).json(profile);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all profiles
exports.getProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find();
        res.status(200).json(profiles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
