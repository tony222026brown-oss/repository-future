import mongoose from "mongoose";

/* server/models/User.js */
const userSchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true },
  type: { type: String, enum: ['company', 'help', 'era'], required: true, default: 'company' },
  phone: { type: String, unique: true, sparse: true, default: undefined },
  anonymous: { type: String, required: true, trim: true, default: '' },
  name: { type: String, required: true, trim: true, default: '' },
  gender: { type: String, enum: ['Male', 'Female', 'Organisation', 'Enterprise'], required: true },
  profileImage: { type: String, default: undefined },
  location: {
    country: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
  },
  badge: {
    type: String,
    enum: ['none', 'gold', 'verified'],
    default: 'none'
  },

  status: { type: String, default: undefined },
  bio: { type: String, default: undefined },

  dailyStats: {
    date: { type: Date, default: () => new Date().setHours(0, 0, 0, 0) },
  
    // Valeurs actuelles du jour
    dailyVotes: { type: Number, default: 0 },
    dailyViews: { type: Number, default: 0 },
    dailyVisits: { type: Number, default: 0 },
  
    // Records atteints
    recordDailyVotes: { type: Number, default: 0 },
    recordDailyViews: { type: Number, default: 0 },
    recordDailyVisits: { type: Number, default: 0 },
  },
  
  layoos: {
    balance: { type: Number, default: 0 }, // Monnaie de la plateforme
  }, 

  hasAccount: { type: Boolean, default: false },
  isLoggedIn: { type: Boolean, default: false },
  mood: { type: String, required: false, default: undefined },
  contentLike: { type: Number, default: 0 },
  lastMessage: { type: String, required: false, default: undefined },
  newMessages: { type: Number, default: 0 },
  lastMessageTime: { type: Date, default: Date.now },
  sentBox: { type: Boolean, default: undefined },
  secure: { type: Boolean, default: undefined },

  companies: [String],
  blockedUsers: [String],
  signalEnterprise: [String],

  actus: {
    mine: {
      active: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actu' }],
      expired: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actu' }],
    },
    received: {
      active: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actu' }],
      expired: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actu' }],
    }, 
    default: {
      mine: { active: [], expired: [] },
      received: { active: [], expired: [] }
    }
  },

  gifts: {
    mine: {
      active: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gift' }],
      expired: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gift' }],
    },
    received: {
      active: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gift' }],
      expired: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gift' }],
    },
    default: {
      mine: { active: [], expired: [] },
      received: { active: [], expired: [] }
    }
  },
}, {
  timestamps: true // Active createdAt et updatedAt automatiquement
});


export default mongoose.model('User', userSchema);

