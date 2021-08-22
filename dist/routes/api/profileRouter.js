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
const auth_1 = require("../../middleware/auth");
const express_1 = require("express");
const profileController = __importStar(require("../../controllers/profileController"));
const express_validator_1 = require("express-validator");
const router = express_1.Router();
router
    .route("/")
    .get(profileController.getAllProfiles)
    .post(auth_1.authJWT, express_validator_1.check("status", "status is required!").not().isEmpty(), express_validator_1.check("skills", "skills is required!").not().isEmpty(), profileController.createUserProfile)
    .delete(auth_1.authJWT, profileController.deleteProfile);
/**
 * @route GET api/profile/me
 * @description Get current user's profile
 * @access private
 */
router.route("/me").get(auth_1.authJWT, profileController.getUserProfile);
router.route("/users/:userId").get(profileController.getProfileById);
router
    .route("/experience")
    .put(auth_1.authJWT, express_validator_1.check("title", "title is required").not().isEmpty(), express_validator_1.check("company", "company is required").not().isEmpty(), express_validator_1.check("from", "start date is required").not().isEmpty(), profileController.profileExperience);
router
    .route("/experience/:experienceId")
    .delete(auth_1.authJWT, profileController.deleteExperience);
router
    .route("/education")
    .put(auth_1.authJWT, express_validator_1.check("school", "school is required").not().isEmpty(), express_validator_1.check("degree", "degree is required").not().isEmpty(), express_validator_1.check("from", "start date is required").not().isEmpty(), profileController.profileEducation);
router
    .route("/education/:educationId")
    .delete(auth_1.authJWT, profileController.deleteEducation);
router.route("/github/:username").get(profileController.getGithubProfile);
exports.default = router;
