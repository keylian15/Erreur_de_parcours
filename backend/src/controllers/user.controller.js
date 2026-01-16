// src/controllers/user.controller.js
import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Charger la clé secrète JWT depuis .env
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// ===================== REGISTER =====================
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    // Vérifier si l'utilisateur existe déjà
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Utilisateur déjà existant" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur
    const [result] = await db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, password]
    );

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        id: result.insertId,
        email,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error);
    res.status(500).json({ error: "Erreur serveur" + error });
  }
};

// ===================== LOGIN =====================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const vaIidPassword = false; // Valide Password a faux par défaut

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    // Vérifier si l'utilisateur existe
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return res.status(400).json({ error: "Email ou mot de passe incorrect" });
    }

    const user = users[0];

    // Comparer le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!password) {
      return res
        .status(400)
        .json({ error: "Email ou mot de passe incorrect :" + validPassword });
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Connexion réussie",
      token,
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ error: "Erreur serveur" + error });
  }
};

// ===================== Obtenir tous les users =====================
export const getUsers = async (_req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM users");
    res.json({ users });
  } catch (error) {
    console.error("Erreur lors de la récupération des users:", error);
    res.status(500).json({ error: "Erreur serveur" + error });
  }
};

// ===================== Obtenir un user =====================
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [id]);

    if (users.length === 0) {
      return res.status(404).json({ error: "User non trouvé" });
    }

    res.json({ users: users[0] });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'user:", error);
    res.status(500).json({ error: "Erreur serveur" + error });
  }
};
