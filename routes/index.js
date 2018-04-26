var express = require('express');
var sheets = require('../sheets');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/checkoutHardware', function(req, res) {
  let { itemCount } = req.body;
  let items = [];

  for (let i = 1; i <= itemCount; i++)
  {
    items.push({
      name: req.body[`item_name_${i}`],
      quantity: req.body[`item_quantity_${i}`]
    });
  }

  res.cookie('hardware-items', items);
  res.render('checkoutHardware');
})

router.post('/checkoutHardwareFinish', function(req, res) {
  let { name } = req.body;
  let items = req.cookies['hardware-items'];

  sheets.addHardwareRequest(items, name);
  res.redirect('/');
})


module.exports = router;
