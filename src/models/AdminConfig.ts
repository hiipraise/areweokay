import mongoose, { Schema, Model } from 'mongoose';

export interface IAdminConfig {
  username: string;
  password: string;
  updatedAt: Date;
}

const AdminConfigSchema = new Schema<IAdminConfig>({
  username: { type: String, required: true, default: 'hiipraise' },
  password: { type: String, required: true, default: 'deaa0da01614' },
  updatedAt: { type: Date, default: Date.now },
});

const AdminConfig: Model<IAdminConfig> = mongoose.models.AdminConfig || mongoose.model<IAdminConfig>('AdminConfig', AdminConfigSchema);

export default AdminConfig;
