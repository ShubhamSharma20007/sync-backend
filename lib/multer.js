import multer from "multer"
// for profile images upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/profiles/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })
  



// for chat files upload
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/files/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const fileUpload = multer({ storage: fileStorage })

export {upload, fileUpload}