"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const profileSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
const Profile = mongoose_1.model("Profile", profileSchema);
exports.default = Profile;
