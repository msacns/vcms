var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose')
var mongooseLogs = require('mongoose-activitylogs')
var AutoIncrement = require('mongoose-sequence')(mongoose);

var StatusSchema = new Schema({    
    status: {
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

StatusSchema.plugin(AutoIncrement, {inc_field: 'status'});

StatusSchema.plugin(mongooseLogs, {
    schemaName: "Status",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
});

var Statuss = mongoose.model('nd_statuses', StatusSchema);

module.exports = Statuss;