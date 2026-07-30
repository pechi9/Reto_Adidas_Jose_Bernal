const express = require("express");
const ctrl = require("../controllers/launchesController");

const router = express.Router();

router.get("/markets", ctrl.markets);

router.get("/", ctrl.list);
router.post("/", ctrl.create);

router.get("/:id", ctrl.get);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

router.post("/:id/transition", ctrl.transition);

router.post("/:id/assets", ctrl.addAsset);
router.delete("/:id/assets/:assetId", ctrl.removeAsset);

module.exports = router;
