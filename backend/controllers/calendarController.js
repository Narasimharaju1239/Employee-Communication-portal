export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date } = req.body;
    const updated = await CalendarEvent.findByIdAndUpdate(
      id,
      { title, description, date },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event updated', event: updated });
  } catch (error) {
    res.status(500).json({ message: 'Event update failed', error });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CalendarEvent.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Event deletion failed', error });
  }
};
import CalendarEvent from '../models/CalendarEvent.js';

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, createdBy } = req.body;
    const newEvent = new CalendarEvent({ title, description, date, createdBy });
    await newEvent.save();
    res.status(201).json({ message: 'Event created' });
  } catch (error) {
    res.status(500).json({ message: 'Event creation failed', error });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await CalendarEvent.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch events', error });
  }
};
