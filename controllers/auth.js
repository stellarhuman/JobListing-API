const User = require('../models/User');
const { StatusCodes } = require('http-status-codes')
const { BadRequestError , UnauthenticatedError } = require('../errors/index')

const register = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    // if (!name || !email || !password || !confirmPassword) {
    //     throw new BadRequestError('Please provide all the details')
    // }
    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
    const {email,password} = req.body
    if(!email || !password){
        throw new BadRequestError('Please provide all the details')

    }
    const user = await User.findOne({ email })
    if(!user){
        throw new UnauthenticatedError('Please provide valid email')
    }

    const isValidPassword = await user.comparePasswords(password)
    if(!isValidPassword){
        throw new UnauthenticatedError('Wrong password')
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user:{name:user.name},token})
}

module.exports = {
    register,
    login,
}