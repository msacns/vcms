module.exports = {
    development: {
        url: 'http://localhost:4359/',
        ip: "0.0.0.0",
        port: 4359,
        db_type: 'mongoDB', 
        db: 'mongodb://localhost:27017/vcms_development', 
        app: {
            name: 'VCMS',
            contactEmail: '',
            collectionsPrefix: 'nd_',
            customCollectionsPrefix: 'wst_'
        },
        crypto: {
            enabled: true,
            secret: 'SecretPassphrase'
        },
        mailer: {
            service: 'SMTP', //SMTP, sendgrid, mandrill, etc... list of services nodemailer-wellknown
            host: 'smtp.yourserver.com', // hostname
            secureConnection: false, // use SSL
            port: 25, // port for secure SMTP
            auth: {
                user: 'no_reply@yourserver.com',
                pass: 'yourpassword'
            },
            from: 'no_reply@yourserver.com'
        },
        google: {
            clientID: "your client id",
            clientSecret: "your client secret",
            callbackURL: "http://127.0.0.1:8080/auth/google/callback"
        },
        pagination: {
            itemsPerPage: 10
        },
        query: {
            defaultRecordsPerPage: 500
        }
    },
    production: {
        url: 'http://localhost',
        ip: "0.0.0.0",
        port: 80,
        db_type: 'mongoDB', // tingoDB or mongoDB
        db: 'mongodb://ctmadmin:ctm2018!@ds131698.mlab.com:31698/vcms',
        app: {
            name: 'VCMS',
            contactEmail: '',
            collectionsPrefix: 'nd_',
            customCollectionsPrefix: 'wst_'
        },
        crypto: {
            enabled: true,
            secret: 'SecretPassphrase'
        },
        mailer: {
            service: 'SMTP', //SMTP, sendgrid, mandrill, etc... list of services nodemailer-wellknown
            host: 'smtp.yourserver.com', // hostname
            secureConnection: false, // use SSL
            port: 25, // port for secure SMTP
            auth: {
                user: 'no_reply@yourserver.com',
                pass: 'yourpassword'
            },
            from: 'no_reply@yourserver.com'
        },
        google: {
            clientID: "your client id",
            clientSecret: "your client secret",
            callbackURL: "http://127.0.0.1:8080/auth/google/callback"
        },
        pagination: {
            itemsPerPage: 10
        },
        query: {
            defaultRecordsPerPage: 500
        }
    },
    local: {
        url: 'http://localhost:8081/',
        ip:  "127.0.0.1",
        port: 8081,
        db_type: 'mongoDB', //  mongoDB
        db: 'localhost:27017/vcms_local',
        app: {
            name: 'VCMS',
            contactEmail: '',
            collectionsPrefix: 'nd_',
            customCollectionsPrefix: 'wst_'
        },
        crypto: {
            enabled: true,
            secret: 'SecretPassphrase'
        },
        mailer: {
            service: 'SMTP', //SMTP, sendgrid, mandrill, etc... list of services nodemailer-wellknown
            host: 'smtp.yourserver.com', // hostname
            secureConnection: false, // use SSL
            port: 25, // port for secure SMTP
            auth: {
                user: 'no_reply@yourserver.com',
                pass: 'yourpassword'
            },
            from: 'no_reply@yourserver.com'
        },
        google: {
            clientID: "PLACE_YOUR_CLIENT_ID_HERE",
            clientSecret: "PLACE_YOUR_CLIENT_SECRET_HERE",
            callbackURL: "http://PLACE_URL_HERE/auth/google/callback"
        },
        pagination: {
            itemsPerPage: 10
        },
        query: {
            defaultRecordsPerPage: 500
        }
    }
}
