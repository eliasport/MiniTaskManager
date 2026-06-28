import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    user: { type: String, required: [true, "User is required"], unique: true }, 
    email: { type: String, required: [true, "Email is required"], unique: true }, 
    password: { type: String, required: [true, "Password is required"] },
}, { timestamps: true});

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function(){
    if(!this.isModified('password')) return ; 
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt); 
    } catch (error){
        next(error);
    }
}); 

userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password); 
}

const User = mongoose.model('User', userSchema);

export default User; 