// Third-Party Imports
import { Counter } from 'prom-client';

export const TASK_QUEUE = 'freight-delay-queue';

export const METRICS = {
  trafficApiCalls: new Counter({
    name: 'traffic_api_calls_total',
    help: 'Total number of traffic API calls',
    labelNames: ['status'],
  }),
  notificationAttempts: new Counter({
    name: 'notification_attempts_total',
    help: 'Total number of notification attempts',
    labelNames: ['status'],
  }),
  delayMinutesGauge: new Counter({
    name: 'delivery_delay_minutes',
    help: 'Current delivery delay in minutes',
    labelNames: ['status'],
  }),
} as const;
