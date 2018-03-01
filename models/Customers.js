var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose')
var mongooseLogs = require('mongoose-activitylogs')
var AutoIncrement = require('mongoose-sequence')(mongoose);

var CustomerSchema = new Schema({    
    customer: {
        type: Number
    },
    description: {
        type: String,        
        lowercase: false
    },
    country: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    contact: {
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

CustomerSchema.plugin(AutoIncrement, {inc_field: 'customer'});

CustomerSchema.plugin(mongooseLogs, {
    schemaName: "Customers",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
});

var Customer = mongoose.model('nd_customers', CustomerSchema);

module.exports = Customer;