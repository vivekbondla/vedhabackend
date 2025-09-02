const multer = require("multer");
const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const path = require("path");

// Setup S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    acl: "private", // keep files private, generate signed URLs later
    key: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, `checklist/${Date.now()}_${file.originalname}`);
    },
  }),
});

module.exports = upload;
