// server/controllers/bookingController.js
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { sendBookingEmail } from '../utils/email.js';

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('room', 'name')
      .populate('bookedBy', 'email name role'); // <-- Add role here
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
};

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    console.log('Booking request body:', req.body);
    console.log('Authenticated user:', req.user);
    const { room, date, time } = req.body;
    if (!room || !date || !time) {
      return res.status(400).json({ message: 'Room, date, and time are required', body: req.body });
    }

    // Combine date and time as a local datetime string
    // date: "2025-06-26", time: "17:30"
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    // Note: month is 0-based in JS Date
    const startTime = new Date(year, month - 1, day, hours, minutes, 0, 0);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    // Check for time conflict
    const conflict = await Booking.findOne({
      room,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });
    if (conflict) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }

    const newBooking = new Booking({
      room,
      bookedBy: req.user._id,
      startTime,
      endTime
    });

    await newBooking.save();

    // Send booking confirmation email
    const user = await User.findById(req.user._id);
    const roomObj = await Room.findById(room);
    const bookingTime = `${date} at ${time}`;
    await sendBookingEmail(
      user.email,
      'Room Booking Successful',
      `Your room booking for <b>${roomObj.name}</b> on <b>${bookingTime}</b> is successful.`,
      null,
      null,
      user.name,
      'INCOR Group',
      '',
      'https://incor-group.com/privacy',
      'https://incor-group.com/terms'
    );

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({
      message: 'Booking failed',
      error: err.message,
      stack: err.stack
    });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('bookedBy', 'role email name').populate('room', 'name');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Only allow employees to cancel their own bookings
    if (
      req.user.role === 'Employee' &&
      booking.bookedBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Employees can only cancel their own bookings' });
    }

    // Admin can cancel their own bookings and Employee bookings, but NOT SuperAdmin bookings
    if (req.user.role === 'Admin') {
      if (booking.bookedBy.role === 'SuperAdmin') {
        return res.status(403).json({ message: 'Admins cannot cancel SuperAdmin bookings' });
      }
      if (
        booking.bookedBy._id.toString() !== req.user._id.toString() &&
        booking.bookedBy.role !== 'Employee'
      ) {
        return res.status(403).json({ message: 'Admins can only cancel their own or Employee bookings' });
      }
    }

    // Determine who cancelled
    let cancelledBy = req.user.role;
    let cancelledByText = '';
    if (cancelledBy === 'SuperAdmin' && booking.bookedBy.role !== 'SuperAdmin') {
      cancelledByText = ' by Super Admin';
    } else if (cancelledBy === 'Admin' && booking.bookedBy.role === 'Employee') {
      cancelledByText = ' by Admin';
    }

    await booking.deleteOne();

    // Send cancellation email
    await sendBookingEmail(
      booking.bookedBy.email,
      'Room Booking Cancelled',
      `Your room booking for <b>${booking.room.name}</b> on <b>${booking.startTime.toLocaleString()}</b> has been cancelled${cancelledByText}.`
    );

    res.status(200).json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Error cancelling booking', error: err.message });
  }
};
