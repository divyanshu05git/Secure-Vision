import express from 'express';

const router=express.Router();

const violations=[]

export const saveViolation = (violation) => {
  violations.push({
    id: violations.length + 1,
    timestamp: new Date().toISOString(),
    type: violation.class_name,
    confidence: violation.confidence,
    bbox: violation.bbox,
  });
};


router.get("/violations", (req, res) => {
  return res.json(violations);
});

router.get("/violations/stats", (req, res) => {
  const stats = {};
  violations.forEach((v) => {
    stats[v.type] = (stats[v.type] || 0) + 1;
  });
  return res.json(stats);
});

router.delete("/violations", (req, res) => {
  violations.length = 0;
  return res.json({ message: "Violations cleared" });
});

export default router;
