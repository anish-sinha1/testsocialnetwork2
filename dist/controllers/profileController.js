"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGithubProfile = exports.deleteEducation = exports.profileEducation = exports.deleteExperience = exports.profileExperience = exports.deleteProfile = exports.getProfileById = exports.getAllProfiles = exports.createUserProfile = exports.getUserProfile = void 0;
const express_validator_1 = require("express-validator");
const request_1 = __importDefault(require("request"));
const profileModel_1 = __importDefault(require("../models/profileModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const getUserProfile = async (req, res, next) => {
    try {
        const profile = await profileModel_1.default.findOne({ user: req.user.id }).populate("user", ["name", "avatar"]);
        if (!profile) {
            return res.status(404).json({
                message: "No profile for that user",
            });
        }
        res.status(200).json({
            profile,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "server error",
        });
    }
};
exports.getUserProfile = getUserProfile;
const createUserProfile = async (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "failed",
            errors: errors,
        });
    }
    const { company, website, location, bio, status, githubUsername, skills, youtube, facebook, twitter, instagram, linkedin, tiktok, } = req.body;
    let profileFields = {};
    profileFields.social = {};
    console.log(profileFields);
    profileFields.user = req.user.id;
    if (company)
        profileFields.company = company;
    if (website)
        profileFields.website = website;
    if (location)
        profileFields.location = location;
    if (bio)
        profileFields.bio = bio;
    if (status)
        profileFields.status = status;
    if (githubUsername)
        profileFields.githubUsername = githubUsername;
    if (skills) {
        profileFields.skills = skills
            .split(",")
            .map((skill) => skill.trim());
    }
    console.log(profileFields);
    console.log(profileFields.social);
    if (twitter)
        profileFields.social.twitter = twitter;
    if (youtube)
        profileFields.social.youtube = youtube;
    if (facebook)
        profileFields.social.facebook = facebook;
    if (instagram)
        profileFields.social.instagram = instagram;
    if (linkedin)
        profileFields.social.linkedin = linkedin;
    if (tiktok)
        profileFields.social.tiktok = tiktok;
    console.log(profileFields);
    try {
        console.log(req.user.id);
        let profile = await profileModel_1.default.findOne({ user: req.user.id });
        if (profile) {
            console.log("why are we here");
            profile = await profileModel_1.default.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
            return res.status(200).json({
                profile,
            });
        }
        profile = new profileModel_1.default(profileFields);
        console.log(profile.user);
        console.log(profile);
        await profile.save();
        res.status(201).json({
            profile,
        });
    }
    catch (err) {
        res.status(500).json({
            status: "failed",
            data: {
                message: err.message,
            },
        });
    }
};
exports.createUserProfile = createUserProfile;
const getAllProfiles = async (req, res, next) => {
    try {
        const profiles = await profileModel_1.default.find().populate("User", ["name", "avatar"]);
        res.status(200).json({
            profiles,
        });
    }
    catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};
exports.getAllProfiles = getAllProfiles;
const getProfileById = async (req, res, next) => {
    try {
        const profile = await profileModel_1.default.findOne({ user: req.params.userId }).populate("user", ["name", "avatar"]);
        if (!profile)
            return res
                .status(400)
                .json({ message: "No profile found for that user" });
        res.status(200).json({
            profile,
        });
    }
    catch (err) {
        if (err.kind === "ObjectId") {
            return res
                .status(400)
                .json({ message: "No profile found for that user" });
        }
        res.status(500).json({
            error: err.message,
        });
    }
};
exports.getProfileById = getProfileById;
const deleteProfile = async (req, res, next) => {
    try {
        await profileModel_1.default.findOneAndRemove({ user: req.user.id });
        await userModel_1.default.findOneAndRemove({ _id: req.user.id });
        res.status(204).json({
            status: "deleted",
        });
    }
    catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};
exports.deleteProfile = deleteProfile;
const profileExperience = async (req, res, next) => {
    console.log("->");
    console.log(req.user);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const { title, company, location, from, to, current, description } = req.body;
    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
    };
    console.log(newExp);
    try {
        const profile = await profileModel_1.default.findOne({ user: req.user.id });
        console.log(profile);
        profile.experience.unshift(newExp);
        await profile.save();
        res.status(200).json({
            profile,
        });
    }
    catch (err) {
        res.status(500).json({ message: "server error" });
    }
};
exports.profileExperience = profileExperience;
const deleteExperience = async (req, res, next) => {
    try {
        const profile = await profileModel_1.default.findOne({ user: req.user.id });
        const removeIndex = profile.experience
            .map((item) => item.id)
            .indexOf(req.params.experienceId);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.status(204).json({
            profile,
        });
    }
    catch (err) {
        res.status(500).json({ message: "server error" });
    }
};
exports.deleteExperience = deleteExperience;
const profileEducation = async (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const { school, degree, fieldOfStudy, from, to, current, description } = req.body;
    const newEdu = {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description,
    };
    try {
        const profile = await profileModel_1.default.findOne({ user: req.user.id });
        console.log(profile);
        profile.education.unshift(newEdu);
        await profile.save();
        res.status(200).json({
            profile,
        });
    }
    catch (err) {
        res.status(500).json({ message: "server error" });
    }
};
exports.profileEducation = profileEducation;
const deleteEducation = async (req, res, next) => {
    try {
        const profile = await profileModel_1.default.findOne({ user: req.user.id });
        const removeIndex = profile.experience
            .map((item) => item.id)
            .indexOf(req.params.educationId);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.status(204).json({
            profile,
        });
    }
    catch (err) {
        res.status(500).json({ message: "server error" });
    }
};
exports.deleteEducation = deleteEducation;
const getGithubProfile = async (req, res, next) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`,
            method: "GET",
            headers: { "user-agent": "node.js" },
        };
        request_1.default(options, (error, response, body) => {
            if (error)
                throw error;
            if (response.statusCode !== 200)
                return res.status(404).json({ message: "repositories not found" });
            res.status(200).json(JSON.parse(body));
        });
    }
    catch (err) {
        res.status(500).json({ message: "server error" });
    }
};
exports.getGithubProfile = getGithubProfile;
