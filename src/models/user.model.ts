import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

import { IUser, Roles } from '../types/types.ts';

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, "Username is a required field"],
    max: [20, 'Username must be less than 20 characters'],
    unique: [true, 'Username must be unique'],
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    match: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
    required: [ true, 'Email is required'],
    maxlength: [50, 'Email must be less than 50 characters'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    maxlength: [20, 'Password must be less than 20 characters'],
    minlength: [8, 'Password must be more than 8 characters'],
    select: false // Exclude password from query results by default; must use .select('+password') to explicitly include it 
  },
  firstname: {
    type: String,
    required: [true, 'First name is required'],
    maxlength: [20, 'Firstname must be less than 20 characters'],
    minlength: [2, 'Firstname must be more than 2 characters'],
  },
  lastname: {
    type: String,
    required: [ true, 'Lastname is required'],
    maxlength: [20, 'Lastname must be less than 20 characters'],
    minlength: [2, 'Lastname must be more than 2 characters'],
  },
  phoneNumber: {
    type: String,
    match: [/^69\d{8}$/, 'Phone number must be a valid Greek mobile phone number'],
    required: [ true, 'Phone number is required'],
    unique: true,
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: Object.values(Roles),   // ['admin', 'user'] values dynamically extracted from Roles Object
      message: '{VALUE} is not a valid role'
    },
    default: Roles.User,       
  },
  },
  {
    collection: 'users',
    timestamps: true,
  },
);

/**
 * Hashes password using bcrypt before it gets saved into the db
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {  // this.isModified('password') === true -> when creating a user (or changing password) the password is considered as 'modified'. 
    next();                           // So if none of these two happens, skip, cause the password has already been hashed the first time it got saved. We don't want to hash it again. (in case of update)
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});



// Check if User already exists in mongoose.models cached models. If it does use this, else create a new one.
// this prevents OverwriteModelError on subsequent reloads on dev enviroments when having hot reloading servers
const User = mongoose.models.User || model<IUser>('User', userSchema);

export default User;