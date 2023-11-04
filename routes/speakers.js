const path = require("path");
const express = require("express");

const route = express.Router();

module.exports = (params) => {
  const { speakerService } = params;

  route.get("/", async (req, res, next) => {
    try {
      const artwork = await speakerService.getAllArtwork();
      const speakers = await speakerService.getList();

      res.render("layout", {
        pageTitle: "Speakers",
        template: "speakers",
        speakers: speakers,
        artwork,
      });
    } catch (error) {
      return next(error);
    }
  });

  route.get("/:shortname", async (req, res, next) => {
    try {
      const speaker = await speakerService.getSpeaker(req.params.shortname);
      const artwork = await speakerService.getArtworkForSpeaker(
        req.params.shortname
      );

      res.render("layout", {
        pageTitle: "Speakers",
        template: "speakers-detail",
        speaker: speaker,
        artwork,
      });
    } catch (error) {
      return next(error);
    }
  });
  return route;
};
