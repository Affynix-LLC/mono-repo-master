import { saveLeadToAirtable } from './airtable.js';

const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_REGEX = /(\+?\d[\d\s().-]{7,}\d)/;
const WEBSITE_REGEX = /(https?:\/\/[^\s]+)|([A-Z0-9.-]+\.[A-Z]{2,})(\/[^\s]*)?/i;

const sanitizeValue = (value) => {
  if (!value) return '';
  return String(value).trim();
};

const splitNameParts = (name) => {
  if (!name) {
    return { firstName: '', lastName: '' };
  }
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  return {
    firstName: parts.slice(0, -1).join(' '),
    lastName: parts.slice(-1).join(' ')
  };
};

const extractName = (text) => {
  if (!text) return '';
  const patterns = [
    /my name is ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /i am ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /this is ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return '';
};

const extractCompany = (text) => {
  if (!text) return '';
  const patterns = [
    /company is ([A-Z0-9][\w\s&.-]{1,80})/i,
    /company name is ([A-Z0-9][\w\s&.-]{1,80})/i,
    /we are ([A-Z0-9][\w\s&.-]{1,80})/i,
    /i work at ([A-Z0-9][\w\s&.-]{1,80})/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return '';
};

const extractContactDetails = (messages) => {
  const userMessages = messages.filter((msg) => msg.role === 'user');
  const combined = userMessages.map((msg) => msg.content).join('\n');

  const emailMatch = combined.match(EMAIL_REGEX);
  const phoneMatch = combined.match(PHONE_REGEX);
  const websiteMatch = combined.match(WEBSITE_REGEX);

  return {
    name: extractName(combined),
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0] : '',
    company: extractCompany(combined),
    website: websiteMatch ? websiteMatch[0] : ''
  };
};

const formatTranscript = (messages) =>
  messages
    .map((msg) => `${msg.role?.toUpperCase() || 'UNKNOWN'}: ${msg.content}`)
    .join('\n\n');

export const captureLeadFromConversation = async ({ conversationId, dbHelpers }) => {
  if (!conversationId || !dbHelpers) {
    return null;
  }

  const conversation = dbHelpers.getConversation(conversationId);
  if (!conversation) {
    return null;
  }

  const metadata = conversation.metadata || {};
  if (metadata.lead_capture?.status === 'saved') {
    return metadata.lead_capture;
  }

  const messages = dbHelpers.getMessagesByConversation(conversationId);
  if (!messages || messages.length === 0) {
    return null;
  }

  const contact = extractContactDetails(messages);
  const nameParts = splitNameParts(contact.name);
  const business = sanitizeValue(contact.company);
  const website = sanitizeValue(contact.website);
  const phone = sanitizeValue(contact.phone);
  const email = sanitizeValue(contact.email);

  if (!email || !business || !website || !phone || !nameParts.firstName) {
    return null;
  }

  const now = new Date().toISOString();
  const leadPayload = {
    firstName: sanitizeValue(nameParts.firstName),
    lastName: sanitizeValue(nameParts.lastName),
    email,
    phone,
    business,
    website,
    source: sanitizeValue(metadata.source) || 'Website',
    status: sanitizeValue(metadata.status),
    priority: sanitizeValue(metadata.priority),
    clientType: sanitizeValue(metadata.clientType),
    role: sanitizeValue(metadata.role),
    pathType: sanitizeValue(metadata.pathType),
    conversationId,
    transcript: formatTranscript(messages),
    notes: formatTranscript(messages).slice(0, 2000),
    submittedAt: now
  };

  const recordId = await saveLeadToAirtable(leadPayload);

  const updatedMetadata = {
    ...metadata,
    lead_capture: {
      status: 'saved',
      email: leadPayload.email,
      airtable_record_id: recordId,
      captured_at: now
    }
  };

  dbHelpers.update('conversations', conversationId, { metadata: updatedMetadata });

  return {
    airtable_record_id: recordId,
    captured_at: now
  };
};
