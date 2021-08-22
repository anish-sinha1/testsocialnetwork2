import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import request from "request";
import Profile, {
  IExperience,
  IProfile,
  IEducation,
  ISocial,
} from "../models/profileModel";
import User, { IUser } from "../models/userModel";

declare module "express-serve-static-core" {
  interface Request {
    user: IUser;
  }
}

export const getUserProfile: RequestHandler = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(404).json({
        message: "No profile for that user",
      });
    }
    res.status(200).json({
      profile,
    });
  } catch (err) {
    res.status(500).json({
      message: "server error",
    });
  }
};

export const createUserProfile: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "failed",
      errors: errors,
    });
  }

  const {
    company,
    website,
    location,
    bio,
    status,
    githubUsername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
    tiktok,
  } = req.body;

  let profileFields: IProfile = {} as IProfile;
  profileFields.social = {} as ISocial;
  console.log(profileFields);

  profileFields.user = req.user.id;

  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubUsername) profileFields.githubUsername = githubUsername;
  if (skills) {
    profileFields.skills = skills
      .split(",")
      .map((skill: string) => skill.trim());
  }
  console.log(profileFields);
  console.log(profileFields.social);
  if (twitter) profileFields.social.twitter = twitter;
  if (youtube) profileFields.social.youtube = youtube;
  if (facebook) profileFields.social.facebook = facebook;
  if (instagram) profileFields.social.instagram = instagram;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (tiktok) profileFields.social.tiktok = tiktok;
  console.log(profileFields);
  try {
    console.log(req.user.id);
    let profile: IProfile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      console.log("why are we here");
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.status(200).json({
        profile,
      });
    }
    profile = new Profile(profileFields);
    console.log(profile.user);
    console.log(profile);
    await profile.save();
    res.status(201).json({
      profile,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: {
        message: err.message,
      },
    });
  }
};

export const getAllProfiles: RequestHandler = async (req, res, next) => {
  try {
    const profiles = await Profile.find().populate("User", ["name", "avatar"]);
    res.status(200).json({
      profiles,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const getProfileById: RequestHandler = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile)
      return res
        .status(400)
        .json({ message: "No profile found for that user" });
    res.status(200).json({
      profile,
    });
  } catch (err) {
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

export const deleteProfile: RequestHandler = async (req, res, next) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.status(204).json({
      status: "deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const profileExperience: RequestHandler = async (req, res, next) => {
  console.log("->");
  console.log(req.user);
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { title, company, location, from, to, current, description } = req.body;
  const newExp: IExperience = {
    title,
    company,
    location,
    from,
    to,
    current,
    description,
  } as IExperience;
  console.log(newExp);
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    console.log(profile);
    profile.experience.unshift(newExp);
    await profile.save();
    res.status(200).json({
      profile,
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

export const deleteExperience: RequestHandler = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.experience
      .map((item: IExperience) => item.id)
      .indexOf(req.params.experienceId);

    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.status(204).json({
      profile,
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

export const profileEducation: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { school, degree, fieldOfStudy, from, to, current, description } =
    req.body;
  const newEdu: IEducation = {
    school,
    degree,
    fieldOfStudy,
    from,
    to,
    current,
    description,
  } as IEducation;

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    console.log(profile);
    profile.education.unshift(newEdu);
    await profile.save();
    res.status(200).json({
      profile,
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

export const deleteEducation: RequestHandler = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.experience
      .map((item: IEducation) => item.id)
      .indexOf(req.params.educationId);

    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.status(204).json({
      profile,
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

export const getGithubProfile: RequestHandler = async (req, res, next) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };
    request(options, (error, response, body) => {
      if (error) throw error;
      if (response.statusCode !== 200)
        return res.status(404).json({ message: "repositories not found" });
      res.status(200).json(JSON.parse(body));
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};
