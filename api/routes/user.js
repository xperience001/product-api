const ExpressBrute = require('express-brute');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');

const environment = process.env.NODE_ENV;
let store = null;

if (environment === 'development'){
    // stores state locally, don't use this in production
    store = new ExpressBrute.MemoryStore();
} else {
    // stores state with memcached
    store = new MemcachedStore(['127.0.0.1'], {
        prefix: 'NoConflicts'
    });
}

// to delay us from login when we hit the rendpoint too often
const bruteforce = new ExpressBrute(store,{
    freeRetries: 5,
    minWait: 2*60*1000, // 5 minutes
    maxWait: 30*60*1000});// 1 hour
router.route('/signup')
.post(controller.createUser)
//.get(controller.getUsers);

router.route('/signin')// error 429 if we hit this route too often
.post(bruteforce.prevent, controller.logUserIn);

router.route('/user/:id')
.delete(controller.deleteUser);;

module.exports = router;