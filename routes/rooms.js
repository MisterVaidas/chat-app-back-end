const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Room = require('../models/Room');

// Helper function to check if a string is a valid ObjectId
function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

router.post('/create', async (req, res) => {
    const { name, creator } = req.body;

    // Validate creator ID format
    if (!isValidObjectId(creator)) {
        console.log(creator);
        return res.status(400).json({ error: 'Invalid creator ID format.' });
    }

    // Check if room with the same name already exists
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
        return res.status(400).json({ error: 'Room with this name already exists.' });
    }

    const room = new Room({ name, creator, users: [creator] });
    try {
        const savedRoom = await room.save();
        res.json({ id: savedRoom._id, name: savedRoom.name });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating the room.' });
    }
});

// To retrieve and list all the available chat rooms.
router.get('/list', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching the rooms.' });
    }
});

// Joining a room(adding users ID to the room).
router.put('/join/:roomId', async (req, res) => {
    const userId = req.body.userId;

    try {
        const room = await Room.findById(req.params.roomId);
        if (!room) {
            return res.status(400).json({ error: 'Room not found.' });
        }
        room.users.push(userId); // Add user to room's members array
        await room.save();
        res.json({ message: 'Successfully joined the room.' });
    } catch (err) {
        res.status(500).json({ error: 'Error joining the room.' });
    }
});

router.put('/exit/:roomId', async (req, res) => {
    const userId = req.body.userId;

    try {
        const room = await Room.findById(req.params.roomId);
        if (!room) {
            return res.status(400).json({ error: 'Room not found.' });
        }
        room.users.pull(userId); // Remove user from room's members array
        await room.save();
        res.json({ message: 'Successfully left the room.' });
    } catch (err) {
        res.status(500).json({ error: 'Error leaving the room.' });
    }
});

router.put('/invite/:roomId', async (req, res) => {
    const userId = req.body.userId; // The ID of the user being invited

    try {
        const room = await Room.findById(req.params.roomId);
        if (!room) {
            return res.status(400).json({ error: 'Room not found.' });
        }
        room.invitedUsers.push(userId); 
        await room.save();
        res.json({ message: 'Successfully invited the user.' });
    } catch (err) {
        res.status(500).json({ error: 'Error inviting the user.' });
    }
});


module.exports = router;