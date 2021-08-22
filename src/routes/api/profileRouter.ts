import { authJWT } from "../../middleware/auth";
import { Router } from "express";
import * as profileController from "../../controllers/profileController";
import { check } from "express-validator";

const router = Router();

router
  .route("/")
  .get(profileController.getAllProfiles)
  .post(
    authJWT,
    check("status", "status is required!").not().isEmpty(),
    check("skills", "skills is required!").not().isEmpty(),
    profileController.createUserProfile
  )
  .delete(authJWT, profileController.deleteProfile);

/**
 * @route GET api/profile/me
 * @description Get current user's profile
 * @access private
 */

router.route("/me").get(authJWT, profileController.getUserProfile);

router.route("/users/:userId").get(profileController.getProfileById);
router
  .route("/experience")
  .put(
    authJWT,
    check("title", "title is required").not().isEmpty(),
    check("company", "company is required").not().isEmpty(),
    check("from", "start date is required").not().isEmpty(),
    profileController.profileExperience
  );

router
  .route("/experience/:experienceId")
  .delete(authJWT, profileController.deleteExperience);

router
  .route("/education")
  .put(
    authJWT,
    check("school", "school is required").not().isEmpty(),
    check("degree", "degree is required").not().isEmpty(),
    check("from", "start date is required").not().isEmpty(),
    profileController.profileEducation
  );

router
  .route("/education/:educationId")
  .delete(authJWT, profileController.deleteEducation);
router.route("/github/:username").get(profileController.getGithubProfile);

export default router;
