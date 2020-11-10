import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
    process.exit(-1);
});

exports.connect = (envConfig, env) => {
    if (env === 'development') {
        mongoose.set('debug', true);
    }
    mongoose.connect(envConfig.mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
    return mongoose.connection;
};