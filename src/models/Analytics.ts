import mongoose, { Schema, Model } from 'mongoose';

export interface IAnalytics {
  totalVisits: number;
  maleCount: number;
  femaleCount: number;
  lastUpdated: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>({
  totalVisits: { type: Number, default: 0 },
  maleCount: { type: Number, default: 0 },
  femaleCount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

const Analytics: Model<IAnalytics> = mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);

export default Analytics;