import Task from "../models/Task.js";
import User from "../models/User.js";
import { sendGenericEmail } from "../utils/email.js";

// GET my tasks
const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate("assignedTo", "name email role")
      .populate("assignedBy", "name email role")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// GET all tasks (for admin/superadmin)
const getAllTasks = async (req, res) => {
  try {
    // only allow admins and superadmins
    if (req.user.role.toLowerCase() === "employee") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const tasks = await Task.find()
      .populate("assignedTo", "name email role")
      .populate("assignedBy", "name email role")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// POST assign a task
const assignTask = async (req, res) => {
  try {
    const { title, description, assigneeEmail, dueDate } = req.body;
    console.log('--- ASSIGN TASK DEBUG ---');
    console.log('Request body:', req.body);
    console.log('User from req:', req.user);

    const assignee = await User.findOne({ email: assigneeEmail });
    if (!assignee) {
      console.error('Assignee not found:', assigneeEmail);
      return res.status(404).json({ message: "Assignee not found" });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Only SuperAdmin can assign to Admin/Employee, Admin can assign to Employee
    const assignerRole = user.role.toLowerCase();
    const assigneeRole = assignee.role.toLowerCase();
    if (assignerRole === "employee") {
      console.error('Employee tried to assign a task');
      return res.status(403).json({ message: "Employees cannot assign tasks" });
    }
    if (assignerRole === "admin" && assigneeRole !== "employee") {
      console.error('Admin tried to assign to non-employee');
      return res.status(403).json({ message: "Admins can only assign tasks to employees" });
    }
    if (assignerRole === "superadmin" && assigneeRole === "superadmin") {
      console.error('SuperAdmin tried to assign to themselves');
      return res.status(403).json({ message: "SuperAdmin cannot assign tasks to themselves" });
    }

    const task = new Task({
      title,
      description,
      assignedTo: assignee._id,
      assignedBy: user._id,
      dueDate
    });

    await task.save();

    // Send email to assignee
    const subject = `New Task Assigned: ${title}`;
    const message = `Hello ${assignee.name},<br><br>You have been assigned a new task.<br><b>Task:</b> ${title}<br><b>Description:</b> ${description || "-"}<br><b>Deadline:</b> ${dueDate ? new Date(dueDate).toLocaleString() : "-"}<br><br>Assigned by: ${user.name} (${user.email})`;
    try {
      await sendGenericEmail(assignee.email, subject, message, { from: `"INCOR Notifications" <${process.env.EMAIL_USER}>` });
    } catch (e) {
      // Log but don't block
      console.error("Task assignment email failed:", e);
    }

    res.status(201).json({ message: "Task assigned successfully", task });
  } catch (err) {
    console.error('ASSIGN TASK ERROR:', err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// PATCH update task status
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const taskId = req.params.id;

    const task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // only the assignee can mark their task complete
    if (req.user._id.toString() !== task.assignedTo.toString()) {
      return res.status(403).json({ message: "You can only update your own tasks" });
    }

    task.status = status;
    await task.save();
    res.json({ message: "Task status updated", task });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// DELETE cancel a task
const cancelTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId).populate("assignedBy").populate("assignedTo");
    if (!task) return res.status(404).json({ message: "Task not found" });

    const user = req.user;
    const userRole = user.role.toLowerCase();

    // SuperAdmin can cancel any task assigned by admin or superadmin
    if (userRole === "superadmin") {
      // Only allow cancel if assignedBy is admin or superadmin
      const assignedByRole = task.assignedBy.role?.toLowerCase();
      if (assignedByRole === "admin" || assignedByRole === "superadmin") {
        // Send cancellation email to assignee
        try {
          const subject = `Task Cancelled: ${task.title}`;
          const message = `Hello ${task.assignedTo.name},<br><br>The following task has been cancelled:<br><b>Task:</b> ${task.title}<br><b>Description:</b> ${task.description || "-"}<br><b>Deadline:</b> ${task.dueDate ? new Date(task.dueDate).toLocaleString() : "-"}<br><br>Cancelled by: ${user.name} (${user.email})`;
          await sendGenericEmail(task.assignedTo.email, subject, message, { from: `"INCOR Notifications" <${process.env.EMAIL_USER}>` });
        } catch (e) {
          console.error("Task cancellation email failed:", e);
        }
        // Send cancellation email to assigner as well
        try {
          const subject2 = `Task You Assigned Was Cancelled: ${task.title}`;
          const message2 = `Hello ${task.assignedBy.name},<br><br>The following task you assigned has been cancelled:<br><b>Task:</b> ${task.title}<br><b>Description:</b> ${task.description || "-"}<br><b>Deadline:</b> ${task.dueDate ? new Date(task.dueDate).toLocaleString() : "-"}<br><br>Cancelled by: ${user.name} (${user.email})`;
          await sendGenericEmail(task.assignedBy.email, subject2, message2, { from: `"INCOR Notifications" <${process.env.EMAIL_USER}>` });
        } catch (e) {
          console.error("Task cancellation email to assigner failed:", e);
        }
        await task.deleteOne();
        return res.json({ message: "Task cancelled" });
      } else {
        return res.status(403).json({ message: "SuperAdmin can only cancel tasks assigned by admin or superadmin" });
      }
    }

    // Admin can only cancel tasks they assigned
    if (userRole === "admin") {
      if (task.assignedBy._id.equals(user._id)) {
        // Send cancellation email to assignee
        try {
          const subject = `Task Cancelled: ${task.title}`;
          const message = `Hello ${task.assignedTo.name},<br><br>The following task has been cancelled:<br><b>Task:</b> ${task.title}<br><b>Description:</b> ${task.description || "-"}<br><b>Deadline:</b> ${task.dueDate ? new Date(task.dueDate).toLocaleString() : "-"}<br><br>Cancelled by: ${user.name} (${user.email})`;
          await sendGenericEmail(task.assignedTo.email, subject, message, { from: `"INCOR Notifications" <${process.env.EMAIL_USER}>` });
        } catch (e) {
          console.error("Task cancellation email failed:", e);
        }
        // Send cancellation email to assigner as well
        try {
          const subject2 = `Task You Assigned Was Cancelled: ${task.title}`;
          const message2 = `Hello ${task.assignedBy.name},<br><br>The following task you assigned has been cancelled:<br><b>Task:</b> ${task.title}<br><b>Description:</b> ${task.description || "-"}<br><b>Deadline:</b> ${task.dueDate ? new Date(task.dueDate).toLocaleString() : "-"}<br><br>Cancelled by: ${user.name} (${user.email})`;
          await sendGenericEmail(task.assignedBy.email, subject2, message2, { from: `"INCOR Notifications" <${process.env.EMAIL_USER}>` });
        } catch (e) {
          console.error("Task cancellation email to assigner failed:", e);
        }
        await task.deleteOne();
        return res.json({ message: "Task cancelled" });
      } else {
        return res.status(403).json({ message: "Admins can only cancel their own assigned tasks" });
      }
    }

    // Employees cannot cancel tasks
    return res.status(403).json({ message: "Not authorized to cancel tasks" });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

export default {
  getMyTasks,
  getAllTasks,
  assignTask,
  updateTaskStatus,
  cancelTask
};