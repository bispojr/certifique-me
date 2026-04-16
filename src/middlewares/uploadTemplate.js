const multer = require('multer')

const ALLOWED_MIMES = ['image/png', 'image/jpeg']
const MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter(_req, file, cb) {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Apenas arquivos PNG ou JPG são permitidos.'))
    }
  },
})

module.exports = upload.single('template_base')
