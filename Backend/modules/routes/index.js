const express = require('express');
const router = express.Router();


const admin = require('./adminRouter');
router.use('/admin', admin);

router.get('/', (req, res) => {
  res.json('Welcome to Home Page');
    // translate('Ik spreek Engels', { to: 'en' }).then(res => {
    //     console.log(res.text);
    //     //=> I speak English
    //     console.log(res.from.language.iso);
    //     //=> nl
    //   }).catch(err => {
    //     console.error(err);
    //   });
});

module.exports = router;
