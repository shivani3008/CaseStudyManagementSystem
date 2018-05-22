const express = require('express');
const router = express.Router();
const multer = require('multer');

const projectsController = require('../controllers/projects');
const urlCredentialController = require('../controllers/urlCredential');
const screenShotController = require('../controllers/screenShot');

const checkAuth = require('../middleware/check_Auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(err, destination);
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});

// project = new Project({
//         projectName: req.body.projectName
//     });
//     console.log(1);
//     project.validate((err) => {
//         console.log(2);
//         cb(null, false);
//         console.log("NENENE: ", err, __filename); // Will tell you that null is not allowed.
//     });

const fileFilter = (req, file, cb) => {
    //if (req.body.projectN)
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        // Reject a file
        cb(null, false);
    }
};
// fileSize: 1024 * 1024 * 5 (5MB)
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', checkAuth, projectsController.getAllProjects);
router.post('/', checkAuth, upload.any(), urlCredentialController.getUrlcredentials, screenShotController.insertScreenShots, projectsController.createProject);
router.post('/a', checkAuth, projectsController.createProject_);
router.get('/:id', checkAuth, projectsController.getProject);
router.patch('/:id', checkAuth, upload.any(), urlCredentialController.getUpdatedUrlcredentials, screenShotController.updateScreenShots, projectsController.editProject);
router.post('/search', checkAuth, projectsController.searchProject);

//router.patch('/a/:id', checkAuth, upload.any(), urlCredentialController.getUpdatedUrlcredentials, projectsController.editProject_);

module.exports = router;