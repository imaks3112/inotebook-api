const exporess = require('express');
const router = exporess.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require("express-validator");

// getAllthe notes : get request
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({user: req.user.id});
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Some error occured');
    }
});

// Add notes : get request
router.post('/addnote', fetchuser, [
    body('title', 'Please enter title').isLength({ min: 3 }),
    body('description', 'Description must be 5 charactes.').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const {title, description, tag } = req.body;
        // validations.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        
        const note = new Note({
            title, description, tag, user: req.user.id
        });
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Some error occured');
    }
});

module.exports = router;