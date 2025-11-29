import { isMobileIssue } from "../ML/classifier.js";
import Preprocess from "../ML/utility/preprocess.js";

// Controller function
export const getDiagnosi = (req, res) => {
  const { issue } = req.body;

  if (!issue) {
    return res.status(400).json({ error: "Issue description is required" });
  }

  const data = Preprocess(issue);
  const result = isMobileIssue(data);
  console.log(result);

  res.json({ issue, ...result });
};
