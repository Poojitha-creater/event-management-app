const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    organizer: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    capacity: { type: Number, required: true },
    category: { type: String, required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Text index for high-efficiency searching
EventSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Event', EventSchema);