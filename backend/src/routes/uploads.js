import { Router } from "express";
import path from "path";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "url";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";
import { pool } from "../db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// On serverless hosts (Vercel) the filesystem is read-only and ephemeral, so
// uploads are persisted in MySQL instead. The disk directory is kept only as a
// local-dev fallback / serving path for legacy files.
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

export const UPLOADS_DIR = isServerless
  ? path.join(os.tmpdir(), "mubarak-uploads")
  : path.resolve(__dirname, "../../uploads");

try {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
} catch {
  /* read-only filesystem — disk fallback unavailable in this runtime */
}

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (ACCEPTED.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG and WEBP images are allowed."));
  },
});

const router = Router();

// POST /api/uploads  (multipart/form-data, field name "file")
//   persists the image in MySQL so it survives redeploys and cold starts.
//   Returns { url, path } — the root-relative "/uploads/<file>" path, which the
//   frontend resolves against the API origin at render time.
router.post("/", requireAuth, (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: "No file was uploaded." });

    const ext = (() => {
      if (req.file.mimetype === "image/png") return "png";
      if (req.file.mimetype === "image/webp") return "webp";
      return "jpg";
    })();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const relPath = `/uploads/${filename}`;

    try {
      await pool.query(
        "INSERT INTO uploaded_files (filename, mime, data, bytes) VALUES (?, ?, ?, ?)",
        [filename, req.file.mimetype, req.file.buffer, req.file.size]
      );
      // Keep the disk copy too so local dev can inspect uploads directly.
      try {
        fs.writeFileSync(path.join(UPLOADS_DIR, filename), req.file.buffer);
      } catch {
        /* disk unavailable — DB row is the source of truth */
      }
      return res.status(201).json({ ok: true, url: relPath, path: relPath });
    } catch (dbErr) {
      console.error("upload persist failed:", dbErr?.message);
      // Fallback: if DB write failed, still try the disk for local dev.
      try {
        fs.writeFileSync(path.join(UPLOADS_DIR, filename), req.file.buffer);
        return res.status(201).json({ ok: true, url: relPath, path: relPath });
      } catch {
        return res.status(500).json({ error: "Could not store this image." });
      }
    }
  });
});

// GET /uploads/:filename  — serve from MySQL first, disk as fallback.
// Express delegates the matching GET here (see app.js) before the static dir.
export async function serveUpload(req, res, next) {
  const filename = String(req.params.file || "");
  if (!filename || !/^[A-Za-z0-9_-]+\.(jpe?g|png|webp)$/i.test(filename)) {
    return next();
  }
  try {
    const [rows] = await pool.query(
      "SELECT mime, data FROM uploaded_files WHERE filename = ? LIMIT 1",
      [filename]
    );
    if (!rows.length) {
      // Not in the DB — fall through so the static middleware can serve the
      // file from disk (existing local uploads), otherwise it 404s.
      return next();
    }
    const { mime, data } = rows[0];
    res.set("Content-Type", mime);
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    return res.end(data);
  } catch (dbErr) {
    console.error("serve upload failed:", dbErr?.message);
    return res.status(500).json({ error: "Could not load this image." });
  }
}

export default router;