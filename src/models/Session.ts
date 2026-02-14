// src/models/Session.ts
import mongoose, { Schema, Model } from 'mongoose';

export interface IQuestion {
  id: string;
  question: string;
  answer?: string;
  answeredBy?: 'partner' | 'stranger';
}

export interface ISession {
  sessionId: string;
  type: 'know-me' | 'stranger-comparison' | 'expression' | 'appreciation' | 'breakup' | 'safe-love';
  questions: IQuestion[];
  expression?: string;
  appreciationMessage?: string;
  isPublic: boolean;
  responses: {
    partnerId?: string;
    partnerAnswers?: IQuestion[];
    strangerAnswers?: IQuestion[][];
  };
  createdAt: Date;
  expiresAt?: Date;
}

const SessionSchema = new Schema<ISession>({
  sessionId: { type: String, required: true, unique: true, index: true },
  type: { 
    type: String, 
    required: true,
    enum: ['know-me', 'stranger-comparison', 'expression', 'appreciation', 'breakup', 'safe-love']
  },
  questions: [{
    id: String,
    question: String,
    answer: String,
    answeredBy: { type: String, enum: ['partner', 'stranger'] }
  }],
  expression: String,
  appreciationMessage: String,
  isPublic: { type: Boolean, default: false },
  responses: {
    partnerId: String,
    partnerAnswers: [{
      id: String,
      question: String,
      answer: String,
      answeredBy: String
    }],
    strangerAnswers: [[{
      id: String,
      question: String,
      answer: String,
      answeredBy: String
    }]]
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date
});

const Session: Model<ISession> = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);

export default Session;