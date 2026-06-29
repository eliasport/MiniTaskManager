import User from '../models/User.js';
import generateToken from '../utils/generateToken.js'; 

async function registerUser(userData){
    // console.log("entra en el registro de usuarios"); 
    return (new Promise(async (resolve, reject)=> {
        // console.log("antes del try"); 
        try {
            const existingUser = await User.findOne({ $or: [{user: userData.user}, { email: userData.email }] });
            // console.log(`Existing user: ${existingUser}`);
            if(existingUser) {
                return reject(new Error('User or email already exists'));
            }
            console.log(userData); 
            const user = new User(userData);
            await user.save();
            console.log(`User._id: ${user._id}`); 
            const token = generateToken(user._id);
            console.log(`Token: ${token}`);
            resolve({ user: { id: user._id , user: user.user, email: user.email }, token });

            /*
            {
                user: { 
                    id: user._id , 
                    user: user.user, 
                    email: user.email 
                    }, 
                token
            }
            */
        } catch (error){
            console.error('Error in register service:');
            reject(error);
        }
        console.log("despues del try");
    })); 
}

async function loginUser(userData){
    return new Promise(async (resolve, reject)=> {
        try {
            const existingUser = await User.findOne({ email: userData.email });
            if(!existingUser){
                return reject(new Error('Invalid credentials'));
            }

            const isMatch = await existingUser.comparePassword(userData.password);
            if(!isMatch){
                return reject(new Error('Invalid credentials'));
            }

            resolve({ user: { id: existingUser._id, user: existingUser.user, email: existingUser.email }, token: generateToken(existingUser._id) });
        } catch(error) {
            console.error('Error in login service:');
            reject(error);
        }
    });
}

async function getCurrentUser(userId){
    return new Promise(async (resolve, reject)=> {
        try {
            const user = await User.findById(userId).select('-password');
            if(!user){
                return reject(new Error('User not found'));
            }
            resolve({ id: user._id, user: user.user, email: user.email });
        } catch(error) {
            console.error('Error in getCurrentUser service:');
            reject(error);
        }
    });
}

async function logoutUser(userId){
    return new Promise(async (resolve, reject)=> {
        try {
            // Since JWT is stateless, logout can be handled on the client side by simply deleting the token.
            resolve({ message: "Logout successful" });
        } catch(error) {
            console.error('Error in logout service:');
            reject(error);
        }
    });
}

export { registerUser, loginUser, getCurrentUser, logoutUser };
