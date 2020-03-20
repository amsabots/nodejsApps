const router = require('express').Router();
router.post('/status', (req, res)=>{
    console.log(req.body);
})
module.exports = router;