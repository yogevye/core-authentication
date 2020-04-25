const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    method: {
      type: String,
      enum: ['local', 'google', 'facebook'],
      required: true
    },
    local: {
        email: {
            type: String,
            lowercase: true
        },
        password: {
            type: String,
            minLength: 7
        },
    },
    google: {
        id: {
            type: String,
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    facebook: {
        id: {
            type: String,
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    photo: {
        type: String,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this;
    if(user.method !== 'local'){
        next();
    }

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.local.password, 8)
    }
    next()
});

 userSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this;
    const token = jwt.sign({id: user._id, creationTime:new Date().getTime(), method: user.method, name: user.name}, process.env.JWT_KEY);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token
};

userSchema.statics.findByCredentials = async (email, password) => {
    try{
        // Search for a user by email and password.
        const user = await User.findOne({ email} );
        if (!user) {
            throw new Error('email or password are invalid')
        }
        const isPasswordMatch = await bcrypt.compare(password, user.local.password);
        if (!isPasswordMatch) {
            throw new Error('email or password are invalid')
        }
        return user
    } catch (error) {
        throw new Error(`failed to find by credentials. email: ${email}, password: ${password}. error: ${error.message}`)
    }
};

userSchema.statics.findLocalUser = async (email) =>{
    return User.findOne({"local.email": email});
};

userSchema.statics.findIfGoogleUser = async (googleId) =>{
    return User.findOne({"google.id": googleId});
};

userSchema.statics.findIfFacebookUser = async (facebookId) =>{
    return User.findOne({"facebook.id": facebookId});
};

const User = mongoose.model('User', userSchema);

module.exports = User;