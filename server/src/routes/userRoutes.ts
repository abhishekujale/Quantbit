import { prisma } from "../config/dbconfig";
import { Response, Request } from "express";
import bcrypt from "bcrypt";
const router = require('express').Router();

router.post("/register", async (req: Request, res: Response) => {
    try {
        const { error } = registerValidate(req.body);

        if (error) {
            const errors: Record<string, string> = {};
            error.forEach((err: { path: string[], message: string }) => {
                errors[err.path[0]] = err.message;
            });
            return res.status(400).send({ errors, success: false });
        }

        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ name: req.body.name }, { email: req.body.email }] }
        });

        if (existingUser) {
            if (existingUser.name === req.body.name) {
                return res.status(409).send({ errors: { name: 'User with given name already exists' }, success: false });
            }
            if (existingUser.email === req.body.email) {
                return res.status(409).send({ errors: { email: 'User with given email already exists' }, success: false });
            }
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = await prisma.user.create({
            data: { ...req.body, password: hashPassword }
        });

        const token = generateAuthToken(newUser.id);

        return res.status(201).send({ authToken: token, message: "Signed in successfully", success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error", success: false });
    }
})

router.post("/login", async (req: Request, res: Response) => {

})
export { router };