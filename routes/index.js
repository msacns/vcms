var passport = require('passport');
var express = require('express');
var router = express.Router();


var Account = require('../models/Account');
var Supplier = require('../controllers/supplierController');
var Customer = require('../controllers/customerController');
var Statuses = require('../controllers/statusController');
var UserAccount = require('../controllers/accountController');
var Operations = require('../controllers/operationController');
var Reports   = require('../controllers/reportController');
var Master  = require('../controllers/masterController');

router.get('/', require('permission')(['Administração','Visualização','Manutenção']),  isLoggedIn, Master.list);

router.get('/register', require('permission')(['init']),  function(req, res) {
  res.render('register', {});
});

router.post('/register', require('permission')(['init']),  function(req, res, next) {
  
  Account.register(new Account({username: req.body.username}), req.body.password, function(err) {
    if (err) {
      console.log('error while user register!', err);
      return next(err);
    }

    console.log('user registered!');

    res.redirect('/');
  });
});

router.get('/login', function(req, res) {
  res.render('login', {title: 'CTM [v1.0.0]', user: req.user});
});

router.post('/login', UserAccount.doLogin);

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


// ++++++++++++++++++++++ Suppliers +++++++++++++++++++++++++++

router.get('/suppliers', require('permission')(['Administração','Manutenção']), isLoggedIn, Supplier.list);
// Get single user by id
router.get('/suppliers/show/:id',  require('permission')(['Administração','Manutenção']), isLoggedIn, Supplier.show);
// Create user
router.get('/suppliers/new', require('permission')(['Administração','Manutenção']), isLoggedIn, Supplier.create);
// Save user
router.post('/suppliers/save',  require('permission')(['Administração','Manutenção']), isLoggedIn, Supplier.save);
// Edit user
router.get('/suppliers/edit/:id',  require('permission')(['Administração','Manutenção']), isLoggedIn, Supplier.edit);
// Edit user
router.post('/suppliers/update/:id',  require('permission')(['Administração','Manutenção']), isLoggedIn,  Supplier.update);
// Delete
router.post('/suppliers/delete/:id',  require('permission')(['Administração','Manutenção']), isLoggedIn, Supplier.delete);

router.get('/suppliers/exportxls',  require('permission')(['Administração','Manutenção']),  isLoggedIn, Supplier.export2excel);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// ++++++++++++++++++++++ Customers +++++++++++++++++++++++++++

router.get('/customers',  require('permission')(['Administração','Manutenção']), isLoggedIn, Customer.list);
// Get single user by id
router.get('/customers/show/:id',  require('permission')(['Administração','Manutenção']), isLoggedIn, Customer.show);
// Create user
router.get('/customers/new', require('permission')(['Administração','Manutenção']), isLoggedIn, Customer.create);
// Save user
router.post('/customers/save',  require('permission')(['Administração','Manutenção']), isLoggedIn, Customer.save);
// Edit user
router.get('/customers/edit/:id', require('permission')(['Administração','Manutenção']), isLoggedIn, Customer.edit);
// Edit user
router.post('/customers/update/:id', require('permission')(['Administração','Manutenção']),isLoggedIn,  Customer.update);
// Delete
router.post('/customers/delete/:id', require('permission')(['Administração','Manutenção']), isLoggedIn, Customer.delete);

router.get('/customers/exportxls', require('permission')(['Administração','Manutenção']), isLoggedIn, Customer.export2excel);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Statuses +++++++++++++++++++++++++++

router.get('/statuses',  require('permission')(['Administração','Manutenção']), isLoggedIn, Statuses.list);
// Get single user by id
router.get('/statuses/show/:id', require('permission')(['Administração','Manutenção']), isLoggedIn, Statuses.show);
// Create user
router.get('/statuses/new', require('permission')(['Administração','Manutenção']), isLoggedIn, Statuses.create);
// Save user
router.post('/statuses/save', require('permission')(['Administração','Manutenção']), isLoggedIn, Statuses.save);
// Edit user
router.get('/statuses/edit/:id', require('permission')(['Administração','Manutenção']), isLoggedIn, Statuses.edit);
// Edit user
router.post('/statuses/update/:id', require('permission')(['Administração','Manutenção']),isLoggedIn,  Statuses.update);
// Delete
router.post('/statuses/delete/:id', require('permission')(['Administração','Manutenção']), isLoggedIn, Statuses.delete);

router.get('/statuses/exportxls',  require('permission')(['Administração','Manutenção']), isLoggedIn, Statuses.export2excel);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ User Account +++++++++++++++++++++++++++

router.get('/users',  require('permission')(['Administração']), isLoggedIn, UserAccount.list);
// Get single user by id
router.get('/users/show/:id',  require('permission')(['Administração']),isLoggedIn, UserAccount.show);
// Create user
router.get('/users/new',  require('permission')(['Administração']),isLoggedIn, UserAccount.create);
// Save user
router.post('/users/save',  require('permission')(['Administração']),isLoggedIn, UserAccount.save);
// Edit user
router.get('/users/edit/:id',  require('permission')(['Administração']),isLoggedIn, UserAccount.edit);
// Edit user
router.post('/users/update/:id', require('permission')(['Administração']),isLoggedIn,  UserAccount.update);
// Delete
router.post('/users/delete/:id', require('permission')(['Administração']), isLoggedIn, UserAccount.delete);

router.get('/users/exportxls',  require('permission')(['Administração']), isLoggedIn, UserAccount.export2excel);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Operations Account +++++++++++++++++++++++++++

router.get('/operations', require('permission')(['Administração','Manutenção']),  isLoggedIn, Operations.list);
// Get single user by id
router.get('/operations/show/:id', require('permission')(['Administração','Manutenção']),isLoggedIn, Operations.show);
// Create user
router.get('/operations/new', require('permission')(['Administração','Manutenção']), isLoggedIn, Operations.create);
// Save user
router.post('/operations/save',require('permission')(['Administração','Manutenção']), isLoggedIn, Operations.save);
// Edit user
router.get('/operations/edit/:id',require('permission')(['Administração','Manutenção']), isLoggedIn, Operations.edit);
// Edit user
router.post('/operations/update/:id',require('permission')(['Administração','Manutenção']),isLoggedIn,  Operations.update);
// Delete
router.post('/operations/delete/:id',require('permission')(['Administração','Manutenção']), isLoggedIn, Operations.delete);

router.get('/operations/exportxls', require('permission')(['Administração','Manutenção']), isLoggedIn, Operations.export2excel);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Report Operations Grid +++++++++++++++++++++++++++
// View List
router.get('/report/operation',require('permission')(['Administração','Visualização']),  isLoggedIn, Reports.operationsshow);
// loadData
router.get('/report/operations',require('permission')(['Administração','Visualização']),  isLoggedIn, Reports.operationslist);
// Excel
router.get('/report/exportxls',require('permission')(['Administração','Visualização']),  isLoggedIn, Reports.export2excel);
// // updateItem
// router.put('/report/operations',  isLoggedIn, Reports.operationsupdate);
// // deleteItem
// router.delete('/report/operations',  isLoggedIn, Reports.operationsdelete);

// View List
router.get('/report/pivot', require('permission')(['Administração','Visualização']), isLoggedIn, Reports.pivot);

// View Customers
router.get('/report/pivot/customers',require('permission')(['Administração','Visualização']), isLoggedIn, Reports.customers);

// View Status
router.get('/report/pivot/status',require('permission')(['Administração','Visualização']), isLoggedIn, Reports.status);

// View Suppliers
router.get('/report/pivot/suppliers',require('permission')(['Administração','Visualização']), isLoggedIn, Reports.suppliers);

// View Operations
router.get('/report/pivot/operations',require('permission')(['Administração','Visualização']), isLoggedIn, Reports.operations);
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Dashboard Updates +++++++++++++++++++++++++++
router.get('/dashboard/timeline',require('permission')(['Administração','Visualização','Manutenção']), isLoggedIn, Master.showtimeline);
router.get('/dashboard/timelinegroups', require('permission')(['Administração','Visualização','Manutenção']), isLoggedIn, Master.showtimelinegroups);


// ++++++++++++++++++++++ Errors +++++++++++++++++++++++++++
router.get('/errors/403', function(req, res) {
  res.render('errors/403');
});


module.exports = router;

function isLoggedIn(req, res, next) {            
   if (req.isAuthenticated())        
      return next();

   res.redirect('/login');
}