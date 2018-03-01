var mongoose        = require("mongoose");
var User            = require("../models/Account");
var Operation       = require("../models/Operations");
var moment          = require("moment");
var unid            = require("uuid/v4");
var Customer        = require("../models/Customers");
var masterController = {};

masterController.list = function(req, res){
   
    User    
      .findOne({email:req.user.email})
      .populate({
        path:'accountType', 
        select:'accountType',
        options: { sort: { $natural: -1 }}
      })
      .exec(function(err, user_info){        
            // console.log('user_info=>'+ JSON.stringify(user_info));                    
                          res.render('index',
                          { title: 'CTM [1.0.0]',
                              user: user_info
                             });
                           
                  });  
 }

 
masterController.showtimeline = function(req, res){
    Operation
        .find()
        .populate({
            path:'customer', 
            select:'description',
            match:{ active: true },
            options: { sort: { $natural: -1 }}
          })
        .sort({$natural:-1})
        .exec(function(err,cntrs){
            if(err){
                console.log('Error on load timeline:' + err);
            }else{
                // console.log('cntrs>'+JSON.stringify(cntrs));
                var retmsg =[];
                for(var i=0;i < cntrs.length;i++){
                    
                    var Cntr = cntrs[i].cntr;
                    var Invoice = cntrs[i].invoice;
                    var dtinvoice = cntrs[i].dtinvoice;
                    var dtdeparture = cntrs[i].dtdeparture;
                    var dtarrival = cntrs[i].dtarrival;
                    var dtdemurrage = cntrs[i].dtdemurrage;
                    var grp = cntrs[i].customer._id;                       
                    var iid =  unid();
                    if (dtinvoice){
                        // dtinvoice                        
                        var retorno = {  
                            "id": iid,
                            "title": "Data da Invoice",                     
                            "content": Cntr +  
                                ' <span style="color:#4682B4;">(Invoice)</span>',
                            "start": moment(dtinvoice,"DD/MM/YYYY").format("YYYY-MM-DD"),
                            "type": "box",
                            "group":grp
                        };   
                        retmsg.push(retorno);    
                    }
                    
                    if(dtdeparture){
                         // dtdeparture
                        iid =  unid();
                        var retorno = {  
                            "id": iid,
                            "title": "Data de Saida",                     
                            "content": Cntr +  
                                ' <span style="color:#006400;">(Saída)</span>',
                            "start": moment(dtdeparture,"DD/MM/YYYY").format("YYYY-MM-DD"),
                            "type": "box",
                            "group":grp
                        };   
                        retmsg.push(retorno);   
                    }
                    
                    if (dtarrival){
                        // dtarrival
                        iid =  unid();
                        var retorno = {  
                            "id": iid,
                            "title": "Data de Chegada",                     
                            "content": Cntr +  
                                ' <span style="color:#58BEEA;">(Chegada)</span>',
                            "start": moment(dtarrival,"DD/MM/YYYY").format("YYYY-MM-DD"),
                            "type": "box",
                            "group":grp
                        };   
                        retmsg.push(retorno);    
                    }

                    if (dtdemurrage){
                        // dtdemurrage
                        iid =  unid();
                        var retorno = {  
                            "id": iid,
                            "title": "Data de Demurrage",                     
                            "content": Cntr +  
                                ' <span style="color:#F6210C;">(Demurrage)</span>',
                            "start": moment(dtdemurrage,"DD/MM/YYYY").format("YYYY-MM-DD"),
                            "type": "box",
                            "group":grp
                        };   
                        retmsg.push(retorno);    
                    }                   
                }
                res.json(retmsg);
            }
        });
 }


 masterController.showtimelinegroups = function(req, res){
    Customer
        .find({}, function(err,clients){
            if(err){
                console.log('Error when load distinct container:'+ err);
            }else{  
                var retmsg =[];                
                for(var i=0;i < clients.length;i++){
                    var custome = clients[i].description;
                    var uid = clients[i]._id;
                    var retorno = {  
                        "id": uid,
                        "group": custome
                    };   
                    // console.log('retorno:'+ JSON.stringify(retorno));
                    
                    retmsg.push(retorno);
                }
                res.json(retmsg);
                // res.json(containers);
            }
        });      
        
 } 
module.exports = masterController; 