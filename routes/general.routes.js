// lib/server/routes/general.routes.js //
import express from "express";
const router = express.Router();
import actionOnUser from "./users.routes.js";
import actionOnAccount from "./account.routes.js";
import actionOnCustomers from "./messages.routes.js";
import test from "./test.routes.js";

router.use('/user', actionOnUser);

router.use('/account', actionOnAccount);

router.use('/customers', actionOnCustomers);

router.use('/test', test);

export default router;
