// 'use strict';
var mongoose        = require('mongoose');
var passport        = require('passport');
var Status        = require('../models/Status');
var Countries       = require('../models/Countries');
/*
ExcelJS
*/
var Excel           = require('exceljs');
// var workbook        = new Excel.Workbook();
/******************************************************** */


var statusController = {}

/**
 * CRUD
 */ 
statusController.list = function(req, res) {       
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };
    
    Status
        .find()       
        .limit(limit)
        .skip(limit * page)
        .exec(function(err, siti){     
            Status.count().exec(function(err, count){   
                    res.render('statuses/index',
                    { title: 'CTM [v1.0.0] - Status', 
                        list: siti,
                        user: req.user,
                        page: page + 1,
                        pages: Math.ceil(count / limit)}
                    );
                }); 
            });               
  };

statusController.create = function(req, res){   
    try {
        Countries
            .find()
            .exec(function(err, country){
                res.render('statuses/new', { title: 'CTM [v1.0.0] - Novo Status', user: req.user, countries: country });              
        }); 
        
    } catch ( err ) {                
        res.render('errors/500', {message:'Erro interno, favor informar o administrador!Detalhe do erro:'+err});    
    };

  }; 
 
statusController.show = function(req, res){ 
  if (req.params.id != null || req.params.id != undefined) {      
    Status.findOne({_id: req.params.id})  
        .exec(function (err, statuses) {            
                if (err) {
                    switch (err.code)
                    {
                        case 11000: 
                            req.flash('alert-danger', 'Estes dados já existem no registro de Status.');    
                            break;        
                        default: 
                            req.flash('alert-danger', "Erro ao exibir:"+ err);  
                            break;
                    }   
                } else {                         
                    req.flash('alert-info', 'Dados salvos com sucesso!');  
                    res.render('statuses/show', {user: req.user,stats: statuses});
                }
            });
    } else {    
        res.render('errors/500', {message:'Erro interno, favor informar o administrador!'});    
    }
  }    

statusController.edit = function(req, res){ 
  Status.findOne({_id: req.params.id}).exec(function (err, statuses) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de Status.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao editar:"+ err)  
                 break;
          };   
        } else {    
            Countries
              .find().exec(function(err, country){
                res.render('statuses/edit', {stats: statuses, user: req.user, countries: country});
              });                
        };
      });
  };

statusController.update = function(req, res){  
    
    var moduser;
    if (req.user){
        moduser = req.user.username;
    }

    Status.findByIdAndUpdate(
          req.params.id,          
          { $set: 
              { 
                status: req.body.status, 
                description: req.body.description, 
                country: req.body.country,
                contact: req.body.contact,
                active: req.body.active,
                modifiedBy: moduser
              }
          }, 
          { new: true }, 
   function (err, situat) {                                                              
        if (err) {         
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de Status.');    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao atualizar:"+ err);  
                 break;
          }   
          res.render("statuses/edit", {user: req.user,stats: req.body});
        }else{
          req.flash('alert-info', 'Dados salvos com sucesso!');         
          res.redirect("/statuses/show/"+situat._id);
        }
      })
  }  

statusController.save  =   function(req, res){    
    var payload = req.body;    
    if(req.user) {                 
      payload.modifiedBy = req.user.username;
    }  
    
    var estats = new Status(payload);     
    estats.save(function(err) {
      if(err) {            
        switch (err.code)
        {
           case 11000: 
               req.flash('alert-danger', 'Estes dados já existem no registro de Status.')    
               break;        
           default: 
               req.flash('alert-danger', "Erro ao salvar:"+ err)  
               break;
        }        
      } else {          
        req.flash('alert-info', 'Dados salvos com sucesso!')  
        res.redirect('/statuses/show/'+estats._id)
      }
    });
  };

statusController.delete = function(req, res){        
    Status.remove({_id: req.params.id}, function(err) {
        if(err) {
          switch (err.code)
          {
            case 11000: 
                req.flash('alert-danger', 'Estes dados já existem no registro de Status.')    
                break;        
            default: 
                req.flash('alert-danger', "Erro ao deletar:"+ err)  
                break;
          }  
        } else {    
          req.flash('alert-info', 'Dados removidos com sucesso!')        
          res.redirect("/statuses");
        }
      });
  };

statusController.export2excel = function(req, res) {   
        
    Status
        .find()       
        .exec(function(err, statuss){     
            Status.count().exec(function(err, count){                    
                if(count)    {
                    res.writeHead(200, {
                        'Content-Disposition': 'attachment; filename="status.xlsx"',
                        'Transfer-Encoding': 'chunked',
                        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                      });
                    var workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res });
                    var worksheet = workbook.addWorksheet('lista');
                    worksheet.columns = [
                        { header: 'Código', key: 'id', width: 10 },
                        { header: 'Status', key: 'name', width: 32 },
                        { header: 'Contato', key: 'contact', width: 22},
                        { header: 'Ativo', key: 'activeflag', width: 10}
                    ];                                        
                    for(i=0;i < count; i++){
                        var codfor = statuss[i].status;
                        var desfor = statuss[i].description;
                        var contac = statuss[i].contact;
                        var ativo = statuss[i].active==true?'Sim':'Não';
                       
                        worksheet.addRow([codfor, desfor, contac, ativo]).commit();
                    }                    
                    worksheet.commit();
                    workbook.commit();
                 } else {
                    req.flash('alert-danger', "Sem dados para exportar ao Excel."); 
                    res.redirect("/statuses");
                 };  
                }); 
            });               
  }  

module.exports = statusController;