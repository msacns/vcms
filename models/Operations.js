var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose')
var mongooseLogs = require('mongoose-activitylogs')
var AutoIncrement = require('mongoose-sequence')(mongoose);

var OperationsSchema = new Schema({    
    operation: {
        type: Number,
    },
    description: {
        type: String,        
        lowercase: false
    },    
    invoice: {
        type: String,
        required: false
    },
    cntr: {
        type: String,
        required: false
    },
    dtinvoice: {
        type: String,
        required: false
    }, 
    dtdeparture: {
        type: String,
        required: false
    }, 
    dtarrival: {
        type: String,
        required: false
    }, 
    dtdemurrage: {
        type: String,
        required: false
    }, 
    dtsalesorder: {
        type: String,
        required: false
    }, 
    supplier:  { type: Schema.Types.ObjectId, ref: 'nd_suppliers', required: true },
    customer:  { type: Schema.Types.ObjectId, ref: 'nd_customers', required: true },
    status:  { type: Schema.Types.ObjectId, ref: 'nd_statuses', required: true },
    importdeclation:{
        type: String,
        required: false
    },
    active: {
        type: Boolean,
        required: true
    }
},
{
    timestamps:true
}
);

OperationsSchema.plugin(AutoIncrement, {inc_field: 'operation'});

OperationsSchema.plugin(mongooseLogs, {
    schemaName: "Operations",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
});

var Statuss = mongoose.model('nd_operations', OperationsSchema);

module.exports = Statuss;