import express from "express";
import dotenv from "dotenv";
import isAuthed from "../middleware/is-authed";
import crypto from "crypto";
import pool from "../db/pool";
dotenv.config();
const router = express.Router();

router.get("/", isAuthed, (req, res) => {
  res.send("Hello from pass");
});

router.get("/pass/:id", isAuthed, async (req, res) => {
  const passwordRecord = await pool?.query(
    "SELECT * FROM passwords WHERE id = $1 ",
    [req.params.id]
  );
  const password = passwordRecord?.rows[0];
  if (!password) {
    return res.status(404).send("Password not found");
  }
  const algorithm = "aes-256-cbc";
  const iv = Buffer.from(password.iv, "hex");
  const key = Buffer.from(password.key, "hex");
  const secret = process.env.SECRET_KEY as string;
  const second_key = crypto
    .createHash("sha256")
    .update(String(secret))
    .digest("base64");

  const key_in_bytes = Buffer.from(second_key, "base64");
  const decipher = crypto.createDecipheriv(algorithm, key_in_bytes, iv);

  const first_decrypted = Buffer.concat([
    decipher.update(Buffer.from(password.password, "hex")),
    decipher.final(),
  ]);

  const decipher_2 = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([
    decipher_2.update(first_decrypted),
    decipher_2.final(),
  ]);

  res.send({ password: decrypted.toString() });
});

router.get("/pass", isAuthed, async (req, res) => {
  // get all passwords from db without revaling the password
  // join passwords and details table
  const passwordsRecords = await pool?.query(
    "SELECT p.id, d.title, p.created_at, p.updated_at FROM passwords as p , details as d WHERE p.id = d.password_id ORDER BY updated_at DESC"
  );
  const passwords = passwordsRecords?.rows.map((password) => {
    return {
      id: password.id,
      title: password.title,
      createdAt: password.created_at,
      updatedAt: password.updated_at,
    };
  });
  res.send(passwords);
});

router.post("/pass", isAuthed, async (req, res) => {
  const password = req.body.password;
  const title = req.body.title;
  const algorithm = "aes-256-cbc"; //Using AES encryption
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = Buffer.concat([cipher.update(password), cipher.final()]);
  const secret = process.env.SECRET_KEY as string;
  const second_key = crypto
    .createHash("sha256")
    .update(String(secret))
    .digest("base64");

  const key_in_bytes = Buffer.from(second_key, "base64");
  const cipher_2 = crypto.createCipheriv(algorithm, key_in_bytes, iv);
  encrypted = Buffer.concat([cipher_2.update(encrypted), cipher_2.final()]);

  try {
    const resp = await pool?.query(
      "INSERT INTO passwords (password, iv, key) VALUES ($1, $2, $3) RETURNING *",
      [encrypted.toString("hex"), iv.toString("hex"), key.toString("hex")]
    );
    try {
      await pool?.query(
        "INSERT INTO details (password_id, title) VALUES ($1, $2) RETURNING *",
        [resp?.rows[0].id, title]
      );
    } catch (error) {
      console.log(error);
      throw error;
    }

    res.send({
      id: resp?.rows[0].id,
      title: title,
      createdAt: resp?.rows[0].created_at,
      updatedAt: resp?.rows[0].updated_at,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
});

router.post("/pass/:id/details", isAuthed, (req, res) => {
  res.send(req.body);
});

router.get("/pass/:id/details", isAuthed, (req, res) => {
  res.send(req.params.id);
});

router.delete("/pass/:id", isAuthed, async (req, res) => {
  // delete password from db and details together
  const resp = await pool?.query(
    "DELETE FROM details WHERE password_id = $1 RETURNING *",
    [req.params.id]
  );

  res.send(resp?.rows[0]);
});

router.delete("/pass/batch", isAuthed, async (req, res) => {
  const ids = req.body.ids;
  // delete password from db and details together
  const resp = await pool?.query(
    "DELETE FROM details WHERE password_id IN ($1) RETURNING *",
    [ids]
  );
  res.send(resp?.rows);
});

router.delete("/pass", isAuthed, async (req, res) => {
  // delete all passwords from db
  await pool?.query("DELETE FROM passwords");
  res.send("success");
});

router.put("/pass/:id", isAuthed, async (req, res) => {
  // update password in db
  const password = req.body.password;
  const algorithm = "aes-256-cbc"; //Using AES encryption
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = Buffer.concat([cipher.update(password), cipher.final()]);
  // encrypt one more time with the passkey
  const passkey = process.env.PASSKEY as string;
  const cipher_2 = crypto.createCipheriv(algorithm, passkey, iv);
  encrypted = Buffer.concat([cipher_2.update(encrypted), cipher_2.final()]);

  // save to the db
  try {
    const resp = await pool?.query(
      "UPDATE passwords SET password = $1, iv = $2, key = $3 WHERE id = $4 RETURNING *",
      [
        encrypted.toString("hex"),
        iv.toString("hex"),
        key.toString("hex"),
        req.params.id,
      ]
    );
    res.send(resp?.rows[0]);
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export default router;
