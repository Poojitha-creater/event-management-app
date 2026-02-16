const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET api/events (Search, Filter, Browse)
router.get('/', async (req, res) => {
    const { search, category, location } = req.query;
    let query = {};

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (location) query.location = location;

    try {
        const events = await Event.find(query).sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// @route   POST api/events/register/:id
router.post('/register/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: "Event not found" });

        if (event.attendees.length >= event.capacity) {
            return res.status(400).json({ msg: "Event is full" });
        }

        if (event.attendees.includes(req.user.id)) {
            return res.status(400).json({ msg: "Already registered" });
        }

        event.attendees.push(req.user.id);
        await event.save();

        await User.findByIdAndUpdate(req.user.id, { $push: { registeredEvents: event._id } });

        res.json({ msg: "Successfully registered", event });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// @route   GET api/events/dashboard
router.get('/dashboard', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('registeredEvents');
        res.json(user.registeredEvents);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;