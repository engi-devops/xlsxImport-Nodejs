import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import mongooseTimestamp from 'mongoose-timestamp';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    adminOrUser: {
        type: Number,
        enum: [0, 1], // 0-admin , 1- User
    }
}, {
    collection: 'User'
});


UserSchema.pre('save', function (next) {
    var user = this;
    if ((this.isModified('password') || this.isNew) && user.password != undefined) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, (err, hash) => {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = async function (password, cb) {
    if (bcrypt.compareSync(password, this.password)) return true;
    return false;
};

UserSchema.plugin(mongooseTimestamp);

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;