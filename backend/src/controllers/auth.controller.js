import { registerUser, loginUser, getCurrentUser, logoutUser } from '../services/auth.service.js';

async function register(req, res){
    try {
        // console.log(req.body); 
        const { user, email, password } = req.body;
        // console.log({
        //     user,
        //     email,
        //     password
        // })
        const result = await registerUser({ user, email, password });
        res.status(201).json(result);
    } catch(err){
        console.error('Error in register controller:');
        res.status(400).json({ message: err.message });
    }
}

async function login(req, res){
    try {
        const { email, password } = req.body;
        const result = await loginUser({ email, password });
        res.status(200).json(result);
    } catch(err){
        res.status(401).json({ message: err.message });
    }
}

async function currentUser(req, res){
    // try {
    //     const user = req.user;
    //     res.status(200).json({ user: { id: user._id, user: user.user, email: user.email } });
    // } catch(err){
    //     res.status(500).json({ message: err.message });
    // }
    try {
        const userId = req.user._id;
        const user = await getCurrentUser(userId);
        res.status(200).json({ user });
    } catch(err){
        res.status(500).json({ message: err.message });
    }
}

async function logout(req, res){
    // Since JWT is stateless, logout can be handled on the client side by simply deleting the token.
    // res.status(200).json({ message: "Logout successful" });
    try {
        const userId = req.user._id;
        const result = await logoutUser(userId);
        res.status(200).json(result);
    } catch(err){
        res.status(500).json({ message: err.message });
    }
}

export { register, login, currentUser, logout };
