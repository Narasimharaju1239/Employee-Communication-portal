import express from 'express';
import { createEvent, getAllEvents, updateEvent, deleteEvent } from '../controllers/calendarController.js';

const router = express.Router();

router.post('/create', createEvent);
router.get('/all', getAllEvents);

// Add update and delete routes
router.put('/update/:id', updateEvent);
router.delete('/delete/:id', deleteEvent);

export default router;
