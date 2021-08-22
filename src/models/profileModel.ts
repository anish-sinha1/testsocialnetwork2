import mongoose, { Schema, model, Document } from "mongoose";

export interface IExperience extends Document {
  title?: string;
  company?: string;
  location?: string;
  from?: Date;
  to?: string;
  current?: boolean;
  description?: string;
}
export interface IEducation extends Document {
  school?: string;
  degree?: string;
  fieldOfStudy?: string;
  from?: Date;
  to?: Date;
  current?: boolean;
  description?: string;
}
export interface ISocial extends Document {
  youtube: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  tiktok: string;
}

export interface IProfile extends Document {
  user: mongoose.Schema.Types.ObjectId;
  company?: string;
  website?: string;
  location?: string;
  status: string;
  skills: string[];
  bio?: string;
  githubUsername?: string;
  experience?: IExperience;
  education?: IEducation;
  social: ISocial;
  date?: Date;
}

const profileSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  company: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  bio: {
    type: String,
    required: false,
  },
  githubUsername: {
    type: String,
    required: false,
  },
  experience: {
    type: [
      {
        title: {
          type: String,
          required: true,
        },
        company: {
          type: String,
          required: true,
        },
        location: {
          type: String,
        },
        from: {
          type: Date,
        },
        to: {
          type: Date,
        },
        current: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
        },
      },
    ],

    required: false,
  },

  education: {
    type: [
      {
        school: {
          type: String,
          required: true,
        },
        degree: {
          type: String,
          required: true,
        },
        fieldOfStudy: {
          type: String,
          required: true,
        },
        from: {
          type: Date,
          required: true,
        },
        to: {
          type: Date,
        },
        current: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
        },
        required: false,
      },
    ],
    required: false,
  },
  social: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    instagram: {
      type: String,
    },
    tiktok: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Profile = model("Profile", profileSchema);

export default Profile;
