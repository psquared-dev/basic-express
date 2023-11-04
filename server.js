const express = require("express");
const path = require("path");
const cookieSession = require("cookie-session");
const FeedbackService = require("./services/FeedbackService");
const SpeakerService = require("./services/SpeakerService");
const routes = require("./routes");
const createHttpError = require("http-errors");

const feedbackService = new FeedbackService("./data/feedback.json");
const speakerService = new SpeakerService("./data/speakers.json");

const app = express();

app.set("trust proxy", 1);
app.use(
  cookieSession({ name: "session", keys: ["1212121212", "vcdfgdfgdfg"] })
);

app.set("view engine", "ejs");
app.set("views/", path.join(__dirname, "./views"));

app.locals.siteName = "ROUX Meetups";

app.use(express.static(path.join(__dirname, "./static")));
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  try {
    const names = await speakerService.getNames();
    res.locals.speakerNames = names;
    next();
  } catch (error) {
    return next(error);
  }
});

app.use(
  "/",
  routes({
    feedbackService,
    speakerService,
  })
);

app.use((req, res, next) => {
  //   next(res.sendStatus(404));
  return next(createHttpError(404, "File not found"));
});

app.use((error, req, res, next) => {
  console.log("#############");
  console.log(error);
  res.locals.message = error.message;
  const status = error.status || 500;
  res.locals.status = status;
  res.status(status);
  res.render("error");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});
