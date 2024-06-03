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

// Update existing notes : get request
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const {title, description, tag } = req.body;
        
        const newNote = {};
        if (title) {
            newNote.title = title
        }
        if (description) {
            newNote.description = description
        }
        if (tag) {
            newNote.tag = tag
        }

        // find the note tobe updated
        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).send('Not found!');
        }

        if (note.user.toString() !== req.user.id) {
            return res.sendStatus(401).send('Not allowed');
        }

        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})

        res.json(note);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Some error occured');
    }
});

// Delete notes : get request
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // find the note tobe deleted
        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).send({error: 'Not found!'});
        }

        // allow to delete only user is own
        if (note.user.toString() !== req.user.id) {
            return res.sendStatus(401).send('Not allowed');
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({success: 'Note has been deleted succesfully', status: '200'});
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Some error occured');
    }
});

module.exports = router;