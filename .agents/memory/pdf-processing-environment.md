---
name: PDF processing environment
description: The wrapped system Python does not include pip or PyMuPDF by default.
---

When visual PDF inspection is required, the workspace's wrapped Python may not support `pip install` and may lack `fitz` entirely.

**Why:** Attempts to install PyMuPDF with the system Python failed because `pip` was unavailable, so PDF text extraction may be the only immediately available inspection path unless a project-supported Python package workflow is added.

**How to apply:** Check Python package availability early; if `fitz` is missing, avoid repeated system-pip retries and use an approved package-management path or the available text extraction instead.