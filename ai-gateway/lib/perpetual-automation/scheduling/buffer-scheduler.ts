/**
 * Buffer Scheduler
 *
 * Manages timing constraints between agent calls:
 * - 24-48 hour buffer between Agent01 and Agent02
 * - 24-48 hour buffer between Agent02 and human consultation
 * - Respects business hours and timezone
 */

import { Lead, AgentCallSession, SchedulingConstraints } from '../types';

export interface SchedulingWindow {
  earliest: Date;
  latest: Date;
  preferredSlots: Date[];
}

export interface SchedulingResult {
  success: boolean;
  scheduledTime?: Date;
  error?: string;
  alternativeSlots?: Date[];
}

export class BufferScheduler {
  private config: SchedulingConstraints;

  constructor(config?: Partial<SchedulingConstraints>) {
    // Default configuration
    this.config = {
      minBufferHours: config?.minBufferHours ?? 24,
      maxBufferHours: config?.maxBufferHours ?? 48,
      maxCallDurationMinutes: config?.maxCallDurationMinutes ?? 5,
      businessHoursStart: config?.businessHoursStart ?? 9, // 9 AM
      businessHoursEnd: config?.businessHoursEnd ?? 17, // 5 PM
      allowedDays: config?.allowedDays ?? [1, 2, 3, 4, 5], // Monday-Friday
      timezone: config?.timezone ?? 'America/New_York',
      maxRescheduleAttempts: config?.maxRescheduleAttempts ?? 3,
      rescheduleDelayHours: config?.rescheduleDelayHours ?? 24,
    };
  }

  /**
   * Calculate scheduling window for Agent02 call after Agent01
   */
  calculateAgent02Window(agent01Session: AgentCallSession): SchedulingWindow {
    if (!agent01Session.completedAt) {
      throw new Error('Agent01 session must be completed before scheduling Agent02');
    }

    const baseTime = agent01Session.completedAt;
    return this.calculateWindow(baseTime);
  }

  /**
   * Calculate scheduling window for human consultation after Agent02
   */
  calculateHumanConsultationWindow(agent02Session: AgentCallSession): SchedulingWindow {
    if (!agent02Session.completedAt) {
      throw new Error('Agent02 session must be completed before scheduling human consultation');
    }

    const baseTime = agent02Session.completedAt;
    return this.calculateWindow(baseTime);
  }

  /**
   * Calculate a scheduling window based on a base time
   */
  private calculateWindow(baseTime: Date): SchedulingWindow {
    // Calculate earliest time (baseTime + minBufferHours)
    const earliest = new Date(baseTime);
    earliest.setHours(earliest.getHours() + this.config.minBufferHours);

    // Calculate latest time (baseTime + maxBufferHours)
    const latest = new Date(baseTime);
    latest.setHours(latest.getHours() + this.config.maxBufferHours);

    // Generate preferred slots within the window
    const preferredSlots = this.generatePreferredSlots(earliest, latest);

    return {
      earliest,
      latest,
      preferredSlots,
    };
  }

  /**
   * Schedule next call within the appropriate window
   */
  async scheduleNext(
    lead: Lead,
    previousSession: AgentCallSession,
    nextAgentType: 'agent02' | 'human'
  ): Promise<SchedulingResult> {
    try {
      // Calculate scheduling window
      let window: SchedulingWindow;
      if (nextAgentType === 'agent02') {
        window = this.calculateAgent02Window(previousSession);
      } else {
        window = this.calculateHumanConsultationWindow(previousSession);
      }

      // Find the best available slot
      const scheduledTime = this.findBestSlot(window, lead);

      if (!scheduledTime) {
        return {
          success: false,
          error: 'No available slots found in the scheduling window',
          alternativeSlots: window.preferredSlots,
        };
      }

      return {
        success: true,
        scheduledTime,
        alternativeSlots: window.preferredSlots.filter(
          (slot) => slot.getTime() !== scheduledTime.getTime()
        ),
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Scheduling failed: ${error.message}`,
      };
    }
  }

  /**
   * Generate preferred time slots within a window
   */
  private generatePreferredSlots(earliest: Date, latest: Date): Date[] {
    const slots: Date[] = [];
    const current = new Date(earliest);

    // Generate slots in 30-minute increments
    while (current <= latest) {
      if (this.isBusinessHour(current)) {
        slots.push(new Date(current));
      }

      // Move to next 30-minute slot
      current.setMinutes(current.getMinutes() + 30);
    }

    return slots;
  }

  /**
   * Find the best available slot for a lead
   */
  private findBestSlot(window: SchedulingWindow, lead: Lead): Date | null {
    // Prioritize slots that are:
    // 1. Within business hours
    // 2. On allowed days
    // 3. Not too early or too late

    for (const slot of window.preferredSlots) {
      if (this.isValidSlot(slot)) {
        return slot;
      }
    }

    // If no preferred slots work, return the earliest valid time
    const current = new Date(window.earliest);
    while (current <= window.latest) {
      if (this.isValidSlot(current)) {
        return new Date(current);
      }
      current.setHours(current.getHours() + 1);
    }

    return null;
  }

  /**
   * Check if a time slot is valid (business hours, allowed day)
   */
  private isValidSlot(time: Date): boolean {
    return this.isBusinessHour(time) && this.isAllowedDay(time);
  }

  /**
   * Check if time is within business hours
   */
  private isBusinessHour(time: Date): boolean {
    const hour = time.getHours();
    return hour >= this.config.businessHoursStart && hour < this.config.businessHoursEnd;
  }

  /**
   * Check if day is allowed
   */
  private isAllowedDay(time: Date): boolean {
    const day = time.getDay(); // 0 = Sunday, 6 = Saturday
    return this.config.allowedDays.includes(day);
  }

  /**
   * Check if a call can be rescheduled
   */
  canReschedule(session: AgentCallSession, attemptNumber: number): boolean {
    return attemptNumber < this.config.maxRescheduleAttempts;
  }

  /**
   * Calculate reschedule time
   */
  calculateRescheduleTime(originalTime: Date, attemptNumber: number): Date {
    const rescheduleTime = new Date(originalTime);
    const delayHours = this.config.rescheduleDelayHours * attemptNumber;
    rescheduleTime.setHours(rescheduleTime.getHours() + delayHours);

    // Ensure it's during business hours
    while (!this.isValidSlot(rescheduleTime)) {
      rescheduleTime.setHours(rescheduleTime.getHours() + 1);
    }

    return rescheduleTime;
  }

  /**
   * Get current configuration
   */
  getConfig(): SchedulingConstraints {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<SchedulingConstraints>): void {
    this.config = { ...this.config, ...updates };
  }
}

export const bufferScheduler = new BufferScheduler();
