const router = require('express').Router();
const packageController = require('./packageController');
const path = require('path');
const multer = require('multer'); 

multer({
    dest: path.dirname(require.main.filename) + '/src/modules/packages/statics/'
});

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.dirname(require.main.filename) + '/src/modules/packages/statics/')
    },
    filename: (req, file, cb) => {
        if (file.mimetype == 'application/octet-stream')
            cb(null, file.originalname);
        else{
            req.fileValidationError = 'Invalid file format';
            cb(null, file.originalname);
        }
        
    }
});

let upload = multer({storage: storage});

router.route('/')
.get(packageController.chooseFile);

router.route('/index')
.get(packageController.index);

router.route('/load')
.get(packageController.fillData);

router.route('/loadFile')
.post(upload.single('poetry'), packageController.loadFile);

router.route('/viewPanel/:name')
.get(packageController.viewPanel);

router.route('/view/:id')
.get(packageController.get);


module.exports = router;
