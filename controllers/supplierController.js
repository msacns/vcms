// 'use strict';
var mongoose        = require('mongoose');
var passport        = require('passport');
var Supplier        = require('../models/Suppliers');
var Countries       = require('../models/Countries');
/*
ExcelJS
*/
var Excel           = require('exceljs');
// var workbook        = new Excel.Workbook();
/******************************************************** */


var supplierController = {}

/**
 * CRUD
 */ 
 supplierController.list = function(req, res) {   
    // var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };
    
    Supplier
        .find()       
        .limit(limit)
        .skip(limit * page)
        .exec(function(err, suppliers){     
            Supplier.count().exec(function(err, count){   
                    res.render('suppliers/index',
                    { title: 'CTM [v1.0.0] - Fornecedores', 
                        list: suppliers,
                        user: req.user,
                        page: page + 1,
                        pages: Math.ceil(count / limit)}
                    );
                }); 
            });               
  }

 supplierController.create = function(req, res){   
    try {
        Countries
            .find()
            .exec(function(err, country){
                res.render('suppliers/new', { title: 'CTM [v1.0.0] - Novo Fornecedor', user: req.user, countries: country });              
        }); 
        
    } catch ( err ) {
        console.log('Error on load json:'+ err);
        // req.flash('alert-danger', "Erro ao exibir:"+ err) 
        res.render('errors/500', {message:'Erro interno, favor informar o administrador!Detalhe do erro:'+err});    
    };

  }; 
 
 supplierController.show = function(req, res){ 

  if (req.params.id != null || req.params.id != undefined) {      
    Supplier.findOne({_id: req.params.id})  
        .exec(function (err, suppliers) {            
                if (err) {
                    switch (err.code)
                    {
                        case 11000: 
                            req.flash('alert-danger', 'Estes dados já existem no registro de fornecedores.')    
                            break;        
                        default: 
                            req.flash('alert-danger', "Erro ao exibir:"+ err)  
                            break;
                    }   
                } else {                         
                    req.flash('alert-info', 'Dados salvos com sucesso!')  
                    res.render('suppliers/show', {user: req.user,suppl: suppliers});
                }
            });
    } else {    
        res.render('errors/500', {message:'Erro interno, favor informar o administrador!'});    
    }
  }    

 supplierController.edit = function(req, res){ 

  Supplier.findOne({_id: req.params.id}).exec(function (err, suppl) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de fornecedores.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao editar:"+ err)  
                 break;
          }   
        } else {    
            Countries
              .find().exec(function(err, country){
                res.render('suppliers/edit', {suppliers: suppl, user: req.user, countries: country});
              });                
        };
      });
  }

 supplierController.update = function(req, res){  
    
    var moduser;
    if (req.user){
        moduser = req.user.username;
    }

    Supplier.findByIdAndUpdate(
          req.params.id,          
          { $set: 
              { 
                supplier: req.body.supplier, 
                description: req.body.description, 
                country: req.body.country,
                contact: req.body.contact,
                active: req.body.active,
                modifiedBy: moduser
              }
          }, 
          { new: true }, 
   function (err, suppl) {                                                              
        if (err) {         
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de fornecedores.');    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao atualizar:"+ err);  
                 break;
          }   
          res.render("suppliers/edit", {vehicles: req.body, user: req.user, baseuri:baseurl});
        }else{
          req.flash('alert-info', 'Dados salvos com sucesso!');         
          res.redirect("/suppliers/show/"+suppl._id);
        }
      })
  }  

 supplierController.save  =   function(req, res){
    
    var payload = req.body;    
    if(req.user) {                 
      payload.modifiedBy = req.user.username;
    }  
    
    var supplier = new Supplier(payload);     
    supplier.save(function(err) {
      if(err) {            
        switch (err.code)
        {
           case 11000: 
               req.flash('alert-danger', 'Estes dados já existem no registro de fornecedores.')    
               break;        
           default: 
               req.flash('alert-danger', "Erro ao salvar:"+ err)  
               break;
        }        
      } else {          
        req.flash('alert-info', 'Dados salvos com sucesso!')  
        res.redirect('/suppliers/show/'+supplier._id)
      }
    });
  };

 supplierController.delete = function(req, res){    
    
    Supplier.remove({_id: req.params.id}, function(err) {
        if(err) {
          switch (err.code)
          {
            case 11000: 
                req.flash('alert-danger', 'Estes dados já existem no registro de fornecedores.')    
                break;        
            default: 
                req.flash('alert-danger', "Erro ao deletar:"+ err)  
                break;
          }  
        } else {    
          req.flash('alert-info', 'Dados removidos com sucesso!')        
          res.redirect("/suppliers");
        }
      });
  };

 supplierController.export2excel = function(req, res) {   
        
    Supplier
        .find()       
        .exec(function(err, suppliers){     
            Supplier.count().exec(function(err, count){                    
                if(count)    {
                    res.writeHead(200, {
                        'Content-Disposition': 'attachment; filename="fornecedores.xlsx"',
                        'Transfer-Encoding': 'chunked',
                        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                      });
                    var workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res });
                    var worksheet = workbook.addWorksheet('lista');
                    worksheet.columns = [
                        { header: 'Código', key: 'id', width: 10 },
                        { header: 'Fornecedor', key: 'name', width: 32 },
                        { header: 'País', key: 'country', width: 10 },
                        { header: 'Contato', key: 'contact', width: 22},
                        { header: 'Ativo', key: 'activeflag', width: 10}
                    ];                                        
                    for(i=0;i < count; i++){
                        var codfor = suppliers[i].supplier;
                        var desfor = suppliers[i].description;
                        var cdpais = suppliers[i].country;
                        var contac = suppliers[i].contact;
                        var ativo = suppliers[i].active==true?'Sim':'Não';
                        
                        worksheet.addRow([codfor, desfor,cdpais,contac,ativo]).commit();
                    }                    
                    worksheet.commit();
                    workbook.commit();
                 } else {
                    req.flash('alert-danger', "Sem dados para exportar ao Excel."); 
                    res.redirect("/suppliers");
                 };  
                }); 
            });               
  }  

module.exports = supplierController;