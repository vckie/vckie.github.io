---
title: "Domain Expiry Monitoring with n8n - Automated Notifications"
date: 12-10-2025 10:30:00
categories: [Automation, n8n, Domain Management]
tags: [n8n, RDAP, Google Sheets, Gmail, Monitoring]
---

In this blog, we'll explore how to build an automated domain expiry monitoring system using n8n. This workflow tracks your domain names, checks their expiration dates using RDAP (Registration Data Access Protocol), and sends email alerts when renewal is due.


## Overview

Managing multiple domain names can be challenging, especially when it comes to tracking expiration dates. Missing a renewal deadline can result in losing your domain or facing expensive recovery fees. This n8n workflow automates the entire monitoring process by:

- Reading domain names from a Google Sheet
- Querying RDAP APIs for current domain information
- Calculating days until expiration
- Updating records in Google Sheets
- Sending beautifully formatted email alerts when domains are approaching expiry

<script src="https://gist.github.com/vckie/311c32d1f749daed5c0890e305c152cb.js"></script>

## Prerequisites

Before setting up this workflow, ensure you have:

- n8n installed (cloud or self-hosted)
- Google account with Google Sheets access
- Gmail account for sending notifications
- Basic understanding of n8n workflows

## Workflow Architecture

The workflow consists of 10 nodes working together:

1. **Manual Trigger** - Initiates the workflow
2. **Get row(s) in sheet** - Reads domain list from Google Sheets
3. **HTTP Request** - Queries RDAP API for domain data
4. **Code (RDAP Parser)** - Extracts and formats domain information
5. **Update row in sheet** - Saves parsed data back to Google Sheets
6. **If Condition** - Checks if domain is expiring soon
7. **Code1 (Email Generator)** - Creates HTML email content
8. **Get Mail Id** - Retrieves recipient email from sheet
9. **Merge** - Combines email content with recipient data
10. **Send a message** - Sends notification via Gmail

## Step-by-Step Setup

### Step 1: Create Your Google Sheet

Create a Google Sheet named "Domain Monitor" with two sheets:

**Monitor List (Main Sheet):**
```
| Domain          | Threshold | MailId              |
|-----------------|-----------|---------------------|
| example.com     | 30        | admin@company.com   |
| mysite.org      | 60        | ops@company.com     |
```

**Updated record (Results Sheet):**
```
| domain | status | registrar | createdDate | updatedDate | expiryDate | daysToExpiry | nameservers | rdapSelf | registrarRdap |
```

### Step 2: Configure the Trigger

The workflow starts with a manual trigger, but you can replace this with a Schedule Trigger to run automatically:

```
Node: When clicking 'Execute workflow'
Type: Manual Trigger
Purpose: Initiates the workflow on demand
```

**Tip:** For automation, replace with Schedule Trigger (e.g., daily at 9 AM)

### Step 3: Read Domains from Google Sheets

```
Node: Get row(s) in sheet
Type: Google Sheets
Operation: Read all rows
Configuration:
  - Document: Domain Monitor
  - Sheet: Monitor List
  - Credentials: Google Sheets OAuth2
```

This node fetches all domains you want to monitor, along with their individual threshold days and notification email addresses.

### Step 4: Query RDAP API

```
Node: HTTP Request
Type: HTTP Request
Configuration:
  URL: https://rdap.identitydigital.services/rdap/domain/{{ $json.Domain }}
  Method: GET
```

The HTTP Request node queries the RDAP API for each domain. RDAP is the modern replacement for WHOIS, providing structured JSON data about domain registrations.

**Why RDAP?**
- Standardized JSON format
- More reliable than WHOIS
- Better rate limiting
- Consistent across registrars

### Step 5: Parse RDAP Response

The Code node extracts relevant information from the RDAP JSON response:

```javascript
function safeParse(maybeStr) {
  if (maybeStr == null) return null;
  if (typeof maybeStr === 'string') {
    try { return JSON.parse(maybeStr); } catch (e) { return null; }
  }
  if (typeof maybeStr === 'object') return maybeStr;
  return null;
}

function getEventDate(events, action) {
  const e = (events || []).find(ev => ev.eventAction === action);
  return e ? e.eventDate : null;
}

function daysBetween(fromIso, toIso) {
  const from = new Date(fromIso).getTime();
  const to = new Date(toIso).getTime();
  if (isNaN(from) || isNaN(to)) return null;
  return Math.ceil((to - from) / (1000 * 60 * 60 * 24));
}
```

**Extracted Data:**
- Domain name
- Registration status
- Registrar name
- Creation date
- Last update date
- Expiration date
- Days until expiry
- Name servers
- RDAP links

### Step 6: Update Google Sheet

```
Node: Update row in sheet
Type: Google Sheets
Operation: Update
Configuration:
  - Document: Domain Monitor
  - Sheet: Updated record
  - Match Column: domain
  - Auto-map input data
```

The parsed domain information is written back to the "Updated record" sheet, creating a historical record of all checks.

### Step 7: Check Expiry Threshold

```
Node: If
Type: Conditional
Configuration:
  Condition: {{ $json.daysToExpiry }} <= {{ $('Get row(s) in sheet').item.json.Threshold }}
```

This conditional node checks if the domain's remaining days are less than or equal to the threshold set in your Google Sheet. Only domains meeting this condition proceed to the email notification step.

### Step 8: Generate Email Content

The Code1 node creates a professional HTML email:

```javascript
function banner(days) {
  const n = Number(days);
  if (!Number.isFinite(n)) return { color: '#90a4ae', text: 'Status Unknown' };
  if (n < 30)  return { color: '#e53935', text: '⚠️ Urgent: Expiring soon' };
  if (n < 90)  return { color: '#fb8c00', text: '⚠️ Renewal recommended' };
  return { color: '#43a047', text: '✔︎ Domain active' };
}
```

**Email Features:**
- Color-coded urgency banners
- Responsive HTML design
- Complete domain information table
- Professional formatting

### Step 9: Retrieve Recipient Email

```
Node: Get Mail Id
Type: Google Sheets
Operation: Lookup
Configuration:
  Filter: Domain = {{ $json.domain }}
  Return: MailId column
```

This ensures each domain notification goes to the correct recipient specified in your Monitor List sheet.

### Step 10: Send Email Notification

```
Node: Send a message
Type: Gmail
Configuration:
  To: {{ $item($itemIndex).$node["Get Mail Id"].json["MailId"] }}
  Subject: {{ $json.subject }}
  Message: {{ $json.html }}
```

The final node sends the formatted email via Gmail to the appropriate recipient.

## Email Template Preview

The generated email includes:

**Banner Colors:**
- 🟢 Green: More than 90 days remaining
- 🟠 Orange: 30-90 days remaining  
- 🔴 Red: Less than 30 days remaining

**Information Displayed:**
- Domain name with days remaining
- Registrar details
- Domain status
- Name servers
- Important dates (Created, Updated, Expiry)
- Direct links to RDAP resources

## Running the Workflow

### Manual Execution
1. Open your n8n workflow
2. Click "Execute workflow" button
3. Monitor the execution in real-time
4. Check your Google Sheets for updated records
5. Verify email notifications were sent

### Automated Execution
Replace the manual trigger with a Schedule Trigger:

```
Node: Schedule Trigger
Configuration:
  Trigger Interval: Days
  Days Between Triggers: 1
  Trigger at Hour: 9
  Trigger at Minute: 0
```

This runs the workflow daily at 9:00 AM, ensuring your domain monitoring stays current.

## Customization Options

### 1. Adjust Thresholds per Domain
Set different warning periods for different domains:
- Critical domains: 60-90 days
- Standard domains: 30 days
- Test domains: 7 days

### 2. Add Multiple Recipients
Modify the workflow to send to multiple email addresses:
```javascript
// In your sheet, use comma-separated emails
sendTo: "admin@company.com,ops@company.com"
```

### 3. Integration with Slack/Teams
Add Slack or Microsoft Teams nodes after the If condition to send notifications to team channels.

### 4. Historical Tracking
The "Updated record" sheet maintains a history of all domain checks, useful for:
- Audit trails
- Identifying patterns
- Compliance reporting

## Troubleshooting

### RDAP API Rate Limiting
If monitoring many domains, add a delay between HTTP requests:
```
Node: Wait (after HTTP Request)
Configuration: 1 second delay
```

### Email Not Sending
- Verify Gmail OAuth2 credentials
- Check Gmail quota limits (500 emails/day for free accounts)
- Ensure "Less secure app access" is not required

### Missing Domain Data
- Some domains may use different RDAP servers
- Check if the domain's TLD supports RDAP
- Fallback to WHOIS if needed

## Best Practices

1. **Regular Backups**: Export your Google Sheets regularly
2. **Test Notifications**: Run with test domains first
3. **Monitor Workflow Errors**: Set up n8n error notifications
4. **Keep Credentials Secure**: Use n8n's built-in credential system
5. **Document Changes**: Add notes when modifying thresholds

## Cost Considerations

This workflow is essentially free:
- n8n: Free self-hosted or cloud trial
- Google Sheets: Free up to 5M cells
- Gmail: Free for personal use (with limits)
- RDAP API: Free (no rate limit for reasonable use)

For production use at scale:
- Consider n8n Pro for better execution history
- Use G Suite for higher email limits
- Implement proper error handling and logging

## Conclusion

This n8n workflow provides a robust, automated solution for domain expiry monitoring. By leveraging RDAP APIs, Google Sheets, and Gmail, you can ensure your critical domains never expire unexpectedly.

The workflow is:
- **Scalable**: Monitor unlimited domains
- **Flexible**: Customize thresholds per domain
- **Reliable**: Daily automated checks
- **Professional**: Beautiful email notifications

### Next Steps

Consider enhancing the workflow with:
- SMS notifications for critical domains
- Integration with domain registrar APIs for auto-renewal
- Dashboard creation using Google Data Studio
- Slack/Teams integration for team notifications
- Historical analytics and reporting

## Additional Resources

- [n8n Documentation](https://docs.n8n.io/)
- [RDAP Protocol Specification](https://www.iana.org/assignments/rdap/rdap.xhtml)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [n8n Community](https://community.n8n.io/)

---

**Have questions or improvements?** Feel free to reach out or contribute to the workflow!

Thanks for reading, and happy automating! 🚀
