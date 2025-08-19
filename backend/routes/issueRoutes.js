import express from 'express';
import { deleteIssue } from '../controllers/issueController.js';
import {
  raiseIssue,
  getAllIssues,
  updateIssueStatus,
  addComment,
  exportIssuesExcel,
  exportIssuesPdf
} from '../controllers/issueController.js';


const router = express.Router();
// Only Admin/SuperAdmin can delete employee/admin issues
router.delete('/:id', protect, roleMiddleware(['Admin', 'SuperAdmin', 'admin', 'superadmin']), deleteIssue);


import { protect } from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

// All roles can raise issues
router.post('/raise', protect, roleMiddleware(['Employee', 'Admin', 'SuperAdmin', 'employee', 'admin', 'superadmin']), raiseIssue);

// Employees can only see their own issues, Admin/SuperAdmin can see all
router.get('/all', protect, async (req, res, next) => {
  const role = req.user.role?.toLowerCase();
  if (role !== 'superadmin') {
    req.query.raisedBy = req.user._id;
  }
  next();
}, getAllIssues);

// Only Admin/SuperAdmin can update status
router.put('/:id/status', protect, roleMiddleware(['Admin', 'SuperAdmin', 'admin', 'superadmin']), updateIssueStatus);

// All roles can comment
router.post('/:id/comment', protect, roleMiddleware(['Employee', 'Admin', 'SuperAdmin', 'employee', 'admin', 'superadmin']), addComment);

router.get('/export/excel', protect, roleMiddleware(['Admin', 'SuperAdmin', 'admin', 'superadmin']), exportIssuesExcel);
router.get('/export/pdf', protect, roleMiddleware(['Admin', 'SuperAdmin', 'admin', 'superadmin']), exportIssuesPdf);

export default router;
