const router = require("express").Router();
const RequestController = require("./request.controller").controller;

router.get("/", (req, res, next) => {
  let limit = parseInt(req.query.limit) || 20;
  let start = parseInt(req.query.start) || 0;
  let search = req.query.search ? req.query.search.value : null;
  RequestController.list({ limit, start, search: search })
    .then(docs => res.json(docs))
    .catch(next);
});

router.post("/", async (req, res, next) => {
  try {
    let payload = req.body;
    payload.coordinates = [req.body.long, req.body.lat];
    delete payload.lat;
    delete payload.long;
    if (payload.type == "request") {
      payload.mapdata = {
        type: "Feature",
        properties: {
          description: `<strong>${payload.name} needs help!!</strong><p>${payload.message}</p><p>Time: ${payload.time}</p><p>Reach out to me at ${payload.contact}</p>`
        },
        geometry: {
          type: "Point",
          coordinates: payload.coordinates
        }
      };
    } else {
      payload.mapdata = {
        type: "Feature",
        properties: {
          description: `<strong>${payload.name} needs help!!</strong><p>${payload.message}</p><p>Time: ${payload.time} hr</p><p>Reach out to me at ${payload.contact}</p>`
        },
        geometry: {
          type: "Point",
          coordinates: payload.coordinates
        }
      };
    }
    let request = await RequestController.add(payload);
    res.json(request);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
