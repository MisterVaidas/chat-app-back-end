const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Room = require('../models/Room');

// Create a new message
router.post('/create', async (req, res) => {
    const { content, sender, room } = req.body;

    const message = new Message({ content, sender, room });
    try {
        const savedMessage = await message.save();
        res.json(savedMessage);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error sending the message.' });
    }
});

// Get all messages from the specific room
router.get('/room/:roomId', async (req, res) => {
    try {
        const messages = await Message.find({ room: req.params.roomId }).populate('sender', 'username');
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching the messages.' });
    }
});

// Delete a message
router.delete('/message/:messageId', async (req, res) => {
    const messageId = req.params.messageId;

    try {
        // Check if message exists
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found.' });
        }

        // Proceed with the deletion
        await Message.findByIdAndDelete(messageId);
        res.json({ message: 'Message deleted successfully.' });

    } catch (err) {
        res.status(500).json({ error: 'Error deleting the message.' });
    }
});


module.exports = router;