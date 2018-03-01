// 'use strict';
var mongoose        = require('mongoose');
var passport        = require('passport');
var Account         = require('../models/Account');
var Countries       = require('../models/Countries');
/*
ExcelJS
*/
var Excel           = require('exceljs');
// var workbook        = new Excel.Workbook();
/******************************************************** */


var accountController = {};


accountController.doLogin = function(req, res, next) {   
    passport.authenticate('local', function(err, user, info) {
      if (err) { 
          return next(err); 
      }
  
      if (!user) { 
        req.flash('alert-danger', "Usuário não encontrado, Favor revisar usuário e senha.")  
        return res.redirect('/login') 
      }
      
      req.logIn(user, function(loginErr) {      
        if (loginErr) { 
            return next(loginErr); 
        }
        
        return res.redirect('/');
      });
    })(req, res, next);
   }

/**
 * CRUD
 */ 
accountController.list = function(req, res) {       
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };
    
    Account
        .find()   
        .limit(limit)
        .skip(limit * page)
        .exec(function(err, siti){       
            
            Account.count().exec(function(err, count){   
                    if(err) {  
                        console.log('Error no save:'+ err);
                        switch (err.code)
                        {
                            case 11000: 
                                req.flash('alert-danger', 'Estes dados já existem no registro de usuários.');    
                                break;        
                            default: 
                                req.flash('alert-danger', "Erro ao salvar:"+ err);  
                                break;
                        }
                    }else{        
                        console.log(siti);                
                        res.render('users/index',
                        { title: 'CTM [v1.0.0] - Usuários', 
                            list: siti,
                            user: req.user,
                            page: page + 1,
                            pages: Math.ceil(count / limit)}
                        );   
                    }    
                }); 
            });               
  };

accountController.create = function(req, res){   
    try {
        
     res.render('users/new', { title: 'CTM [v1.0.0] - Novo Usuário', user: req.user });              
                 
    } catch ( err ) {                
        res.render('errors/500', {message:'Erro interno, favor informar o administrador!Detalhe do erro:'+err});    
    };

  }; 
 
accountController.show = function(req, res){ 
  if (req.params.id != null || req.params.id != undefined) {      
    Account.findOne({_id: req.params.id})  
        .exec(function (err, actuser) {            
                if (err) {
                    switch (err.code)
                    {
                        case 11000: 
                            req.flash('alert-danger', 'Estes dados já existem no registro de Usuários.');    
                            break;        
                        default: 
                            req.flash('alert-danger', "Erro ao exibir:"+ err);  
                            break;
                    }   
                } else {                     
                   
                            req.flash('alert-info', 'Dados salvos com sucesso!'); 
                            res.render('users/show', {accounts: actuser, user: req.user});
                         
                }
            });
    } else {    
        res.render('errors/500', {message:'Erro interno, favor informar o administrador!'});    
    }
  }    

accountController.edit = function(req, res){ 
  Account.findOne({_id: req.params.id}).exec(function (err, accuser) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de Usuários.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao editar:"+ err)  
                 break;
          };   
        } else {    
           
                    res.render('users/edit', {uaccount: accuser, user: req.user});
                           
        };
      });
  };

accountController.update = function(req, res){  
    
    var moduser;
    if (req.user){
        moduser = req.user.username;
    }
    var npwd = req.body.password;
    var initials = getInitials(req.body.fullname);

    Account.findByIdAndUpdate(
          req.params.id,          
          { $set: 
              { 
                username: req.body.username, 
                fullname: req.body.fullname,
                email: req.body.email,
                role: req.body.role,
                gender: req.body.gender,                
                active: req.body.active,
                accountPrefix:initials,
                modifiedBy: moduser
              }
          }, 
          { new: true }, 
   function (err, uacc) {                                                              
        if (err) {         
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de Usuários.');    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao atualizar:"+ err);  
                 break;
          }             
           
          res.render('users/edit', {uaccount:uacc,user: req.user});
               
        }else{
            Account.findByUsername(uacc.username).then(function(sanitizedUser){
                    if (sanitizedUser){
                        sanitizedUser.setPassword(npwd, function(){
                            sanitizedUser.save();
                            req.flash('alert-info', 'Dados salvos com sucesso!') 
                            res.redirect("/users/show/"+uacc._id);
                        })
                    } else {
                        req.flash('alert-danger', 'Falha ao definir o usuario para troca a senha. Favor contactar o Administrado.') 
                    }          
                },function(uerr){
                 
                 res.render('users/edit', {uaccount:uacc,user: req.user});
                      
            })       
            
        };
      });
  };

accountController.save  =   function(req, res){    
    var ulogin =  '';
  
    if (req.user){    
      ulogin =  req.user.userid;
    }
    var initials = getInitials(req.body.fullname);

    var user = new Account({ 
      username: req.body.username, 
      fullname: req.body.fullname,
      email: req.body.email, 
      role: req.body.role,
      accountPrefix: initials,      
      gender: req.body.gender,
      active: req.body.active,
      modifiedBy: ulogin
    })      
    
    Account.register(user, req.body.password, function(err, user) {      
      if(err) {            
        switch (err.code)
        {
           case 11000: 
               req.flash('alert-danger', 'Estes dados já existem no registro de usuários.');    
               break;        
           default: 
               req.flash('alert-danger', "Erro ao salvar:"+ err);  
               break;
        }           
        
        res.render('users/edit', {uaccount: req.body,user: req.user});
          
      } else {          
        req.flash('alert-info', 'Dados salvos com sucesso!');  
        res.redirect('/users/show/'+user._id);
      };
     });
  };

accountController.delete = function(req, res){        
    Account.remove({_id: req.params.id}, function(err) {
        if(err) {
          switch (err.code)
          {
            case 11000: 
                req.flash('alert-danger', 'Estes dados já existem no registro de Usuários.')    
                break;        
            default: 
                req.flash('alert-danger', "Erro ao deletar:"+ err)  
                break;
          }  
        } else {    
          req.flash('alert-info', 'Dados removidos com sucesso!')        
          res.redirect("/users");
        }
      });
  };

accountController.export2excel = function(req, res) {   
        
    Account
        .find()       
        .exec(function(err, uaccc){     
            Account.count().exec(function(err, count){                    
                if(count)    {
                    res.writeHead(200, {
                        'Content-Disposition': 'attachment; filename="usuarios.xlsx"',
                        'Transfer-Encoding': 'chunked',
                        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                      });
                    var workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res });
                    var worksheet = workbook.addWorksheet('lista');
                    worksheet.columns = [
                        { header: 'Código', key: 'userid', width: 10 },
                        { header: 'Usuário', key: 'username', width: 32 },
                        { header: 'Nome', key: 'fullname', width: 32 },
                        { header: 'Email', key: 'email', width: 15 },
                        { header: 'Perfil', key: 'role', width: 22},
                        { header: 'Ativo', key: 'active', width: 10}
                    ];                                        
                    for(i=0;i < count; i++){
                        var codfor = uaccc[i].userid;
                        var desfor = uaccc[i].username;
                        var desnm = uaccc[i].fullname;
                        var cdpais = uaccc[i].email;
                        var contac = uaccc[i].role;
                        var ativo = uaccc[i].active==true?'Sim':'Não';
                        
                        worksheet.addRow([codfor, desfor,desnm, cdpais,contac,ativo]).commit();
                    }                    
                    worksheet.commit();
                    workbook.commit();
                 } else {
                    req.flash('alert-danger', "Sem dados para exportar ao Excel."); 
                    res.redirect("/users");
                 };  
                }); 
            });               
  }  

module.exports = accountController;

var getInitials = function (string) {
    var names = string.split(' '),
        initials = names[0].substring(0, 1).toUpperCase();
    
    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }else{
        initials = names.substring(0, 1).toUpperCase();
    }   
    return initials;
 };