const path = require("path");
const express = require("express");

const speakersRoute = require("./speakers");
const feedbackRoute = require("./feedback");

const route = express.Router();

module.exports = (params) => {
  const { speakerService } = params;
  route.get("/", async (req, res, next) => {
    try {
      const artwork = await speakerService.getAllArtwork();
      const topSpeakers = await speakerService.getList();

      res.render("layout", {
        pageTitle: "welcome",
        template: "index",
        topSpeakers: topSpeakers,
        artwork,
      });
    } catch (error) {
      return next(error);
    }
  });

  route.use("/speakers", speakersRoute(params));
  route.use("/feedback", feedbackRoute(params));
  return route;
};
