import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

export const login = async (req, res) => {
    try {
      const { userID, device } = req.body;

      console.log("JWT_SECRET =", process.env.JWT_SECRET);
  
      if (!userID || device !== "windows") {
        return res.status(400).json({ error: "❌ Requête invalide" });
      }
  
      const user = await User.findOne({ userID });
  
      if (!user) {
        return res.status(404).json({ error: "❌ Utilisateur introuvable" });
      }
  
      // Mise à jour statut connexion
      user.isLoggedIn = true;
  
      // Création automatique du compte business
      if (!user.hasAccount) {
        user.hasAccount = true;
        user.type = "business";
        user.businessName = `${user.name} Business`;
        user.profileBusiness = 0;
      }
  
      await user.save();
  
      const token = generateToken({
        userID: user.userID,
        type: user.type,
        device: "windows",
      });
      
      res.json({
        success: true,
        token,
        user: {
          userID: user.userID,
          name: user.name,
          type: user.type,
        },
      });
      
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "❌ Erreur serveur" });
    }
  }