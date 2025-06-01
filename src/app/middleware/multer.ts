import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, './public/temp');
   },
   filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
   },
});

const upload = multer({
   storage: storage,
   limits: { fileSize: 10 * 1024 * 1024 },
   fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif/;
      const extname = allowedTypes.test(
         path.extname(file.originalname).toLowerCase()
      );
      const mimetype = allowedTypes.test(file.mimetype);

      if (extname && mimetype) {
         return cb(null, true);
      } else {
         cb(new Error('Only images are allowed!'));
      }
   },
});
export const multerMiddleware = upload.single('image');
export const multerMiddlewareArray = upload.array('images', 5);
