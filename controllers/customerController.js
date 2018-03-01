// 'use strict';
var mongoose        = require('mongoose');
var passport        = require('passport');
var Customer        = require('../models/Customers');
var Countries       = require('../models/Countries');
/*
ExcelJS
*/
var Excel           = require('exceljs');
// var workbook        = new Excel.Workbook();
/******************************************************** */


var customerController = {}

/**
 * CRUD
 */ 
 customerController.list = function(req, res) {   
    // var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };
    
    Customer
        .find()       
        .limit(limit)
        .skip(limit * page)
        .exec(function(err, customers){     
            Customer.count().exec(function(err, count){   
                    res.render('customers/index',
                    { title: 'CTM [v1.0.0] - Clientes', 
                        list: customers,
                        user: req.user,
                        page: page + 1,
                        pages: Math.ceil(count / limit)}
                    );
                }); 
            });               
  }

 customerController.create = function(req, res){   
    try {
        Countries
            .find()
            .exec(function(err, country){
                res.render('customers/new', { title: 'CTM [v1.0.0] - Novo Cliente',user: req.user, countries: country });              
        }); 
        
    } catch ( err ) {
        console.log('Error on load json:'+ err);
        // req.flash('alert-danger', "Erro ao exibir:"+ err) 
        res.render('errors/500', {message:'Erro interno, favor informar o administrador!Detalhe do erro:'+err});    
    };

  }; 
 
 customerController.show = function(req, res){ 
  if (req.params.id != null || req.params.id != undefined) {      
    Customer.findOne({_id: req.params.id})  
        .exec(function (err, customers) {            
                if (err) {
                    switch (err.code)
                    {
                        case 11000: 
                            req.flash('alert-danger', 'Estes dados já existem no registro de clientes.')    
                            break;        
                        default: 
                            req.flash('alert-danger', "Erro ao exibir:"+ err)  
                            break;
                    }   
                } else {                         
                    req.flash('alert-info', 'Dados salvos com sucesso!')  
                    res.render('customers/show', {user: req.user, clients: customers});
                }
            });
    } else {    
        res.render('errors/500', {message:'Erro interno, favor informar o administrador!'});    
    }
  };    

 customerController.edit = function(req, res){ 
  Customer.findOne({_id: req.params.id}).exec(function (err, customers) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de clientes.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao editar:"+ err)  
                 break;
          }   
        } else {    
            Countries
              .find().exec(function(err, country){
                res.render('customers/edit', {clients: customers,user: req.user, countries: country});
              });                
        };
      });
  }

 customerController.update = function(req, res){  
  
    var moduser;
    if (req.user){
        moduser = req.user.username;
    }

    Customer.findByIdAndUpdate(
          req.params.id,          
          { $set: 
              { 
                customer: req.body.customer, 
                description: req.body.description, 
                country: req.body.country,
                state: req.body.state,
                city: req.body.city,
                contact: req.body.contact,
                active: req.body.active,
                modifiedBy: moduser
              }
          }, 
          { new: true }, 
   function (err, custom) {                                                              
        if (err) {         
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de clientes.');    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao atualizar:"+ err);  
                 break;
          }   
          res.render("customers/edit", {user: req.user,clients: req.body});
        }else{
          req.flash('alert-info', 'Dados salvos com sucesso!');         
          res.redirect("/customers/show/"+custom._id);
        }
      })
  }  

 customerController.save  =   function(req, res){
 
    var payload = req.body;    
    if(req.user) {                 
      payload.modifiedBy = req.user.username;
    }  
    
    var clients = new Customer(payload);     
    clients.save(function(err) {
      if(err) {            
        switch (err.code)
        {
           case 11000: 
               req.flash('alert-danger', 'Estes dados já existem no registro de clientes.')    
               break;        
           default: 
               req.flash('alert-danger', "Erro ao salvar:"+ err)  
               break;
        }        
      } else {          
        req.flash('alert-info', 'Dados salvos com sucesso!')  
        res.redirect('/customers/show/'+clients._id)
      }
    });
  };

 customerController.delete = function(req, res){        
    Customer.remove({_id: req.params.id}, function(err) {
        if(err) {
          switch (err.code)
          {
            case 11000: 
                req.flash('alert-danger', 'Estes dados já existem no registro de clientes.')    
                break;        
            default: 
                req.flash('alert-danger', "Erro ao deletar:"+ err)  
                break;
          }  
        } else {    
          req.flash('alert-info', 'Dados removidos com sucesso!')        
          res.redirect("/customers");
        }
      });
  };

 customerController.export2excel = function(req, res) {   
   
    Customer
        .find()       
        .exec(function(err, customers){     
            Customer.count().exec(function(err, count){                    
                if(count)    {
                    res.writeHead(200, {
                        'Content-Disposition': 'attachment; filename="clientes.xlsx"',
                        'Transfer-Encoding': 'chunked',
                        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                      });
                    var workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res });
                    var worksheet = workbook.addWorksheet('lista');
                    worksheet.columns = [
                        { header: 'Código', key: 'id', width: 10 },
                        { header: 'Cliente', key: 'name', width: 32 },
                        { header: 'País', key: 'country', width: 15 },
                        { header: 'Estado', key: 'state', width: 15 },
                        { header: 'Cidate', key: 'city', width: 15 },
                        { header: 'Contato', key: 'contact', width: 22},
                        { header: 'Ativo', key: 'activeflag', width: 10}
                    ];                                        
                    for(i=0;i < count; i++){
                        var codfor = customers[i].customer;
                        var desfor = customers[i].description;
                        var cdpais = customers[i].country;
                        var cdestado = customers[i].state;
                        var cdcidade = customers[i].city;
                        var contac = customers[i].contact;
                        var ativo = customers[i].active==true?'Sim':'Não';
                        
                        worksheet.addRow([codfor, desfor,cdpais,cdestado,cdcidade,contac,ativo]).commit();
                    }                    
                    worksheet.commit();
                    workbook.commit();
                 } else {
                    req.flash('alert-danger', "Sem dados para exportar ao Excel."); 
                    res.redirect("/customers");
                 };  
                }); 
            });               
  }  

module.exports = customerController;