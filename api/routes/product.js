const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const multer = require('multer');
const auth = require('../auth/auth');

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './uploads/');
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now().toString()+file.originalname);
    }
});

const fileFilter = (req, file, cb)=>{

    if(file.mimetype === 'image/jpeg'
     || file.mimetype === 'image/png'
     || file.mimetype === 'image/jpg'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}

const upload = multer({storage: storage, limits:{
    fileSize: 1024 * 1024 * 5},
    fileFilter: fileFilter
});

router.route('/product')
.post(auth, upload.single('imagefile'), controller.createProduct)
.get(controller.getAllProducts);

router.route('/product/:id')
.get(controller.getProduct)
.patch(auth, controller.patchProduct)
.delete(auth, controller.deleteProduct);

module.exports = router;