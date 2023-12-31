const express = require("express");
const { check, validationResult } = require("express-validator");

const route = express.Router();

module.exports = (params) => {
  const { feedbackService } = params;

  route.get("/", async (req, res, next) => {
    try {
      const feedback = await feedbackService.getList();

      const errors = req.session.feedback ? req.session.feedback.errors : false;
      const successMessage = req.session.feedback
        ? req.session.feedback.message
        : false;

      req.session.feedback = {};

      res.render("layout", {
        pageTitle: "Feedback",
        template: "feedback",
        feedback,
        errors,
        successMessage,
      });
    } catch (error) {
      return next(error);
    }
  });

  route.post(
    "/",
    [
      check("name")
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage("A name is required"),
      check("email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required"),
      check("title")
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage("A title is required"),
      check("message")
        .trim()
        .isLength({ min: 5 })
        .escape()
        .withMessage("A message is required"),
    ],
    async (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        req.session.feedback = {
          errors: errors.array(),
        };
        return res.redirect("/feedback");
      }

      const { name, email, title, message } = req.body;
      await feedbackService.addEntry(name, email, title, message);

      req.session.feedback = {
        message: "Thanks for feedback",
      };

      return res.redirect("/feedback");
    }
  );
  return route;
};
