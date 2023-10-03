import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json({ message: "testing done" });
});

export default router;