import dotenv from "dotenv";
import fs from "fs";
import Mustache from "mustache";
import fetch from "node-fetch";

dotenv.config();

const MUSTACHE_MAIN_DIR = "./main.mustache";

let DATA = {
  name: "Carl (aka Cid)",
  city: "Graham",
  state: "WA",
  country: "US",
  date: new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
    timeZone: "America/Los_Angeles",
    hour12: false,
  }),
};

async function setWeatherInformation() {
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Graham,US&appid=${process.env.OPEN_WEATHER_MAP_KEY}&units=imperial`
  )
    .then((r) => r.json())
    .then((r) => {
      DATA.temperature = Math.round(r.main.temp);
      DATA.weather = r.weather[0].description;
    });
}

async function generateReadMe() {
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;

    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync("README.md", output);
  });
}

async function action() {
  await setWeatherInformation();
  await generateReadMe();
}

action();
