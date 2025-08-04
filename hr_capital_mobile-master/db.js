import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("hr_capital.db");

export const initDB = () => {
  db.execAsync(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        phone TEXT,
        email TEXT UNIQUE,
        password TEXT
      );`
    );
};

// Register new user
export const registerUser = async (username, phone, email, password, onSuccess, onError) => {
  try {
    await db.runAsync(
      "INSERT INTO users (username, phone, email, password) VALUES (?, ?, ?, ?);",
      [username, phone, email, password]
    );
    console.log("✅ User registered");
    onSuccess();
  } catch (err) {
    console.error("❌ registerUser error:", err);
    onError(err);
  }
};

export const checkUserExists = async (email) => {
  try {
    const result = await db.getFirstAsync(
      "SELECT * FROM users WHERE email = ?;",
      [email]
    );
    return !!result; // true if user found, false otherwise
  } catch (error) {
    console.error("❌ checkUserExists error:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const user = await db.getFirstAsync(
      "SELECT * FROM users WHERE email = ? AND password = ?;",
      [email, password]
    );
    return user || null;
  } catch (error) {
    console.error("❌ loginUser error:", error);
    throw error;
  }
};