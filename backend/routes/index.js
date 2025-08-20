const express = require('express');
const router = express.Router();
const error = require('../middlewares/error');
const UserRoute = require("./v1/user/userRoute");
const ProjectRoute = require("./v1/project/projectRoute");

const v1Routes = express.Router();
v1Routes.use('/user', UserRoute);
v1Routes.use('/project', ProjectRoute);

router.use('/v1', v1Routes);
router.use(error);

module.exports = router;
