var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose')
var mongooseLogs = require('mongoose-activitylogs')
var AutoIncrement = require('mongoose-sequence')(mongoose);

var Account = new Schema({   
    userid: Number, 
    username: {
        type: String,
        unique: true,
        required: true
    },
    fullname: String,
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    gender: String,
    accountPrefix: String,
    active: Boolean,
    avatar: { data: Buffer, contentType: String },
    attempts: Number,
    lastloginAt: [{ type: Schema.Types.Date }],
    createdBy: {
        type: String
    },
    modifiedBy: {
        type: String
    }
},
{
    timestamps:true
}
);

Account.plugin(AutoIncrement, {inc_field: 'userid'});

Account.plugin(passportLocalMongoose,{
    usernameField: 'username',
    hashField:'password',
    attemptsField: 'attempts',
    lastLoginField: 'lastloginAt',
    MissingPasswordError: 'Favor, informar uma senha!',
    AttemptTooSoonError: 'Acesso do usuário bloqueado.Tente novamente mais tarde.',
    TooManyAttemptsError: 'Conta bloqueada devido ao excesso de tentativas de login.',
    IncorrectPasswordError: 'Senha incorreta!',
    IncorrectUsernameError: 'Email incorreto!',
    MissingUsernameError: 'Favor informar um email para login!',
    UserExistsError:'Estes dados já existem no registro de usuários.'  
});

Account.plugin(mongooseLogs, {
    schemaName: "Account User",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
});

var account = mongoose.model('nd_accounts', Account);

module.exports = account;