const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }]
});

// Hash the password before saving it to the database
UserSchema.pre('save', function (next) {
    const user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (saltError, salt) {
            if (saltError) {
                return next(saltError);
            } else {
                bcrypt.hash(user.password, salt, function(hashError, hash) {
                    if (hashError) {
                        return next(hashError);
                    }
                    user.password = hash;
                    next();
                });
            }
        });
    } else {
        return next();
    }
});

// Method to compare password for login
UserSchema.methods.comparePassword = function (pw) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(pw, this.password, (err, isMatch) => {
            if (err) {
                reject(err);
            } else {
                console.log("Entered Password:", pw);
                console.log("Stored Password:", this.password);
                console.log("Password Match:", isMatch);
                resolve(isMatch);
            }
        });
    });
};

module.exports = mongoose.model('User', UserSchema);