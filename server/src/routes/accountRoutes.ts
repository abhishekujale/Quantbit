import {Request,Response} from "express"; 
import {prisma} from "prisma";

router.get('/', async (req: Request, res: Response) => {
    try {
        const accounts = await prisma.account.findMany({ 
            where: { userId: Number(req.headers.id) },
            select: { id: true, name: true }
        });

        return res.status(200).send({
            success: true,
            data: accounts
        });
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: "Error getting accounts", error });
    }
});