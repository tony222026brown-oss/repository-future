/* server/controllers/login.controller.js */
import User from "../models/User.js";
import { generateToken } from "../manage/jwt.js";

export const login = async (req, res) => {
  try {
    const { userID, device } = req.body;

    if (!userID || device !== "windows") {
      return res.status(400).json({
        error: "Requête invalide",
        received: req.body,
      });
    }

    const user = await User.findOne({ userID });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    user.isLoggedIn = true;

    if (!user.hasAccount) {
      user.hasAccount = true;
      user.type = "company";
    }

    await user.save();

    const token = generateToken({
      userID: user.userID,
      type: user.type,
      device,
    });

    return res.json({
      success: true,
      token,
      user: {
        userID: user.userID,
        name: user.name,
        type: user.type,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      error: "Erreur serveur",
      message: error.message,
    });
  }
};
