import userModel from "../../models/users/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const avatarName = [
    'Salem',
    'Molly',
    'Spooky',
    'Gizmo',
    'Annie',
    'Lucy',
    'Kiki',
    'Chloe',
    'Harley',
    'Coco',
    'George',
    'Pepper',
    'Maggie',
    'Dusty',
    'Sheba',
    'Lily',
    'Gracie',
    'Smokey',
    'Mimi'
]

const avatarStyle = [
    'adventurer',
    'adventurer-neutral',
    'avataaars-neutral',
    'croodles',
    'lorelei'
]

export const userSignupController =  async (request, response) => {
    const saltRounds = 10;
    const username = request.body.username;
    const userEmail = request.body.email;
    const userPassword = request.body.password;
    const profile = `https://api.dicebear.com/9.x/${avatarStyle[Math.floor(Math.random() * avatarStyle.length)]}/svg?seed=${avatarName[Math.floor(Math.random() * avatarName.length)]}?scale=200`;

    const document = await userModel.findOne({ username: username });
    if (document) {
        if (userEmail == document.email) {
            response
                .status(409)
                .send({ message: "Username and Email already exist!" });
        } else {
            return response.status(409).send({
                message: "Username already exist",
            });
        }
    } else {
        const docEmail = await userModel.findOne({ email: userEmail });
        if (docEmail) {
            return response.status(409).send({
                message: "Email already exist",
            });
        } else {
            bcrypt
                .hash(userPassword, saltRounds)
                .then((hashedPassword) => {
                    var user = new userModel({
                        username: username,
                        email: userEmail,
                        password: hashedPassword,
                        profilePic: profile
                    });
                    user.save()
                        .then((result) => {
                            response.status(201).send({
                                message: "User has been created successfully!",
                                result,
                            });
                        })
                        .catch((error) => {
                            response.status(500).send({
                                message: "Something went wrong! User could not be created!",
                                error,
                            });
                        });
                })
                .catch((e) => {
                    response.status(500).send({
                        message:
                        "Something went wrong! Password could not be hashed successfully!",
                        e,
                    });
                });
        }
    }
}

export const userLoginController = async (request, response) => {
    const {username} = request.body;
    const {password} = request.body;

    userModel
        .findOne({ username: username })
        .then((user) => {
            bcrypt
                .compare(password, user.password)
                .then((passwordCheck) => {
                    if (!passwordCheck) {
                        console.log("wrong password");
                        return response.status(400).send({
                            message: "Wrong password",
                        });
                    }
                    const accessToken = jwt.sign({
                        userId: user._id,
                        userEmail: user.email
                    },
                        process.env.ACCESS_TOKEN_SECRET
                    )
                    response.cookie('token', accessToken, {
                        httpOnly: false,
                        secure: false,
                        sameSite: 'Lax',
                        maxAge: 24 * 60 * 60 * 1000 // 1 day 
                    })
                    response.status(200).send({
                        message: "Login successful",
                        userId: user._id,
                        profilePic: user.profilePic,
                    });
                })
                .catch((error) => {
                    console.log("wrong password");
                    response.status(400).send({
                        message: "Wrong password!!",
                        error,
                    });
                });
        })
        .catch((error) => {
            console.log("user not found.")
            response.status(404).send({
                message: "User not found!",
                error,
            });
        });
};

export const userLogoutController = (req, res) => {
    res.send({token: ""});
}
