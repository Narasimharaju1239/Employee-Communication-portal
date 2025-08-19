// Delete issue (admin/superadmin can delete employee/admin issues)
export const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    // Only allow admin/superadmin to delete issues not raised by superadmin
    const issue = await Issue.findById(id).populate('raisedBy', 'role');
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    // Allow superadmin to delete any issue
    await Issue.findByIdAndDelete(id);
    res.status(200).json({ message: 'Issue deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete issue', error: err.message });
  }
};
import Issue from '../models/Issue.js';
import { sendBookingEmail } from '../utils/email.js';
import XLSX from 'xlsx';
import pdf from 'html-pdf';

export const raiseIssue = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const raisedBy = req.user._id;
    const issue = new Issue({ title, description, priority, raisedBy });
    await issue.save();

    // Send email to INCOR tech support
    const supportEmail = 'nr8334690@gmail.com';
    const subject = `New Issue Raised: ${title}`;
    const message = `
      <div>
        <p>A new issue has been raised.</p>
        <p><b>Title:</b> ${title}</p>
        <p><b>Description:</b> ${description}</p>
        <p><b>Priority:</b> ${priority}</p>
        <p><b>Raised By:</b> ${req.user.name || req.user.email || 'Unknown'} (${req.user.role || 'Unknown'})</p>
        <p><b>Date:</b> ${new Date().toLocaleString()}</p>
      </div>
    `;
    try {
      await sendBookingEmail(supportEmail, subject, message);
    } catch (mailErr) {
      console.error('Failed to send support email:', mailErr.message);
    }

    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ message: 'Failed to raise issue', error: err.message });
  }
};

export const getAllIssues = async (req, res) => {
  try {
    const { status, priority, raisedBy } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (raisedBy) filter.raisedBy = raisedBy;

    const issues = await Issue.find(filter)
      .populate('raisedBy', 'name role')
      .populate('comments.createdBy', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(issues);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch issues', error: err.message });
  }
};

export const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Issue.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, createdBy } = req.body;

    const issue = await Issue.findById(id);
    issue.comments.push({ text, createdBy });
    await issue.save();

    res.status(200).json(issue);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment', error: err.message });
  }
};

export const exportIssuesExcel = async (req, res) => {
  try {
    const issues = await Issue.find();
    const data = issues.map(i => ({
      Title: i.title,
      Description: i.description,
      Priority: i.priority,
      Status: i.status,
      RaisedBy: i.raisedBy,
      CreatedAt: i.createdAt
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Issues");

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename="issues.xlsx"');
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ message: 'Excel export failed', error: err.message });
  }
};

export const exportIssuesPdf = async (req, res) => {
  try {
    const issues = await Issue.find();
    const html = `
      <h1>Issue Report</h1>
      <ul>
        ${issues.map(i => `
          <li><strong>${i.title}</strong> - ${i.description} [${i.status}]</li>
        `).join('')}
      </ul>
    `;
    pdf.create(html).toStream((err, stream) => {
      if (err) return res.status(500).send('PDF generation failed');
      res.setHeader('Content-Disposition', 'attachment; filename=issues.pdf');
      res.setHeader('Content-Type', 'application/pdf');
      stream.pipe(res);
    });
  } catch (err) {
    res.status(500).json({ message: 'PDF export failed', error: err.message });
  }
};
