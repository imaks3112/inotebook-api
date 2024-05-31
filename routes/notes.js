const exporess = require('express');
const router = exporess.Router();

router.get('/', (req, res) => {
    res.json([]);
})

module.exports = router;