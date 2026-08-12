const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const Member = require("../models/member.model");
const Loan = require("../models/loan.model")

//get api
router.get("/members", protect, async (req, res) => {
    try {
        const members = await Member.find();
        res.json(members);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get one
router.get("/members/:id", async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        res.json(member);
    } catch (err) {
        res, status(500).json(err);
    }
})

//post api
router.post("/members", async (req, res) => {
    try {
        const newMember = new Member(req.body);
        const saved = await newMember.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json(err);
    }
});

//update api
router.put("/members/:id", async (req, res) => {
    try {
        const updatedMember = await
            Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedMember);
    } catch (err) {
        res.status(500).json(err);
    }
});

/* Update api
router.put("/:id", async (req, res) => {
    try {
        const UpdatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedMember);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}); */

//delete api
router.delete("/members/:id", async (req, res) => {
    try {
        const memberId = req.params.id;
        await Loan.deleteMany({ memberId: memberId });
        await
            Member.findByIdAndDelete(memberId);
        res.json("Member deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;