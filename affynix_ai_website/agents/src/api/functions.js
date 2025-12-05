import { base44 } from './base44Client';

// Export functions that match the base44 API interface
export const intake = base44.functions.intake;
export const stripeWebhook = base44.functions.stripeWebhook;
export const ai = base44.functions.ai;
export const payments = base44.functions.payments;
export const clients = base44.functions.clients;
export const hubspot = base44.functions.hubspot;
export const intakeSyncAgent = base44.functions.intakeSyncAgent;
export const billingMonitorAgent = base44.functions.billingMonitorAgent;
export const aiAssistantAgent = base44.functions.aiAssistantAgent;
export const zeroXOrchestrator = base44.functions.zeroXOrchestrator;
export const onboardingAutomation = base44.functions.onboardingAutomation;
export const createCheckout = base44.functions.createCheckout;
export const sendToZapier = base44.functions.sendToZapier;
export const emailAutomation = base44.functions.emailAutomation;
export const leadScoring = base44.functions.leadScoring;
