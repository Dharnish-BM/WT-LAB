const express = require('express');
const router = express.Router();
const Faculty = require('../models/faculty.js');

// Create a new faculty
router.post('/add', async (req, res) => {
  const { name, department, email, phone, designation } = req.body;

  const newFaculty = new Faculty({
    name,
    department,
    email,
    phone,
    designation
  });

  try {
    const savedFaculty = await newFaculty.save();
    res.status(201).json(savedFaculty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all faculty
router.get('/', async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.json(faculties);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single faculty by ID
router.get('/:id', async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    res.json(faculty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a faculty by ID
router.put('/:id', async (req, res) => {
  const { name, department, email, phone, designation } = req.body;

  try {
    const updatedFaculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      { name, department, email, phone, designation },
      { new: true }
    );
    if (!updatedFaculty) return res.status(404).json({ message: 'Faculty not found' });
    res.json(updatedFaculty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a faculty by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedFaculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!deletedFaculty) return res.status(404).json({ message: 'Faculty not found' });
    res.json({ message: 'Faculty deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
