# @replyio/n8n-nodes-reply

This is an n8n official community node for [Reply.io](https://reply.io) - a sales engagement platform that automates multichannel outreach across email, LinkedIn, calls, SMS, and WhatsApp.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Nodes

### Reply

Interact with Reply.io API to manage contacts, sequences, and contact statuses.

**Resources & Operations:**

| Resource | Operations |
|----------|------------|
| Contact | Create, Get, Get Many, Update, Delete |
| Contact Status | Update Status, Clear Status |
| Sequence | Get, Get Many, Get Contacts, Add Contact, Start, Pause, Archive |

### Reply Trigger

Starts workflows when Reply.io events occur.

**Supported Events:**

| Category | Events |
|----------|--------|
| Email | Sent, Opened, Bounced, Link Clicked, Replied, Reply Categorized |
| LinkedIn | Message Sent, Message Replied, Connection Sent, Connection Accepted, Reply Categorized |
| Sequence | Contact Finished, Contact Opted Out, Contact Called |
| Account Health | Email Connection Lost, Email Account Error |

## Credentials

1. Log in to your [Reply.io](https://reply.io) account
2. Go to **Settings** > **API Key**
3. Copy your API key
4. In n8n, create new Reply API credentials and paste the key