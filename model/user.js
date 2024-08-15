const express=require("express");
const app=express();
const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Schema } = mongoose;
const nodemailer = require('nodemailer');


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: function () {
                return 'Invalid Email';
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 80
    },
    role: {
        type: String,
       
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        default: null
    },
    emailVerificationTokenExpiry: {
        type: Date,
        default: null
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.pre('validate', async function (next) {
    if (this.isNew) {
        try {
            const count = await this.constructor.countDocuments();
            this.role = count === 0 ? 'admin' : 'user';
        } catch (err) {
            return next(err);
        }
    }
    next();
});

userSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const salt = await bcryptjs.genSalt(10);
            this.password = await bcryptjs.hash(this.password, salt);
        } catch (err) {
            return next(err);
        }
    }
    next();
});

userSchema.statics.findByEmailAndPassword = async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) {
        throw new Error('Invalid email and password');
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email and password');
    }

    return user;
};

userSchema.methods.generateToken = async function () {
    const user = this;
    const tokenData = {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };
    const token = jwt.sign(tokenData, 'onlinebidding19');

    user.tokens = user.tokens || [];
    user.tokens.push({ token });

    await user.save();
    return token;
};

userSchema.statics.findByToken = async function (token) {
    try {
        const tokenData = jwt.verify(token, '12345678');
        const user = await this.findOne({
            _id: tokenData.userId,
            'tokens.token': token
        });
        if (!user) {
            throw new Error('Token not found');
        }
        return user;
    } catch (err) {
        throw err;
    }
};

const User = mongoose.model('User', userSchema);

async function createUser(email, password) {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = Date.now() + 3600000; // 1 hour

    const user = new User({
        email,
        password: hashedPassword,
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpiry: verificationTokenExpiry
    });

    await user.save();

    app.post('/register', async (req, res) => {
        const { email, password } = req.body;
        try {
            await createUser(email, password);
            res.status(201).send('Registration successful. Please check your email for verification.');
        } catch (err) {
            res.status(500).send('Error registering user');
        }
    });

    //  verification email
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'sembunsibani@gmail.com',
            pass: 'SSSibani@23'
        }
    });

    const mailOptions = {
        to: email,
        from: 'sembunsibani@gmail.com',
        subject: 'Email Verification',
        text: `Please verify your email by clicking the following link: \n\n 
               http://localhost:3001/verify-email?token=${verificationToken}`
    };

    await transporter.sendMail(mailOptions);
}

app.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).send('Invalid or expired verification token.');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpiry = null;

    await user.save();

    res.send('Email verified successfully!');
});

app.get('/protected', (req, res) => {
    const user = req.user; 

    if (!user.isEmailVerified) {
        return res.status(403).send('Email not verified.');
    }

    res.send('Welcome to the protected route!');
});

module.exports = {
    User,
    createUser
};
