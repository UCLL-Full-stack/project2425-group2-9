import multer from 'multer';
//accepted file types
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

//file name and file destination(where it should be stored.) =>https://www.npmjs.com/package/multer
const storage = multer.diskStorage({
    //file destination
    destination:  (req, file, cb) => {
        //validate uploaded file type => only png, jpeg and jpg are allowed.
        const isValid = FILE_TYPE_MAP[file.mimetype as keyof typeof FILE_TYPE_MAP];
        let uploadError: Error | null = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'resources/images');
    },
    //file name
    filename: (req, file, cb) =>{
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype as keyof typeof FILE_TYPE_MAP];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });
import { Request, Response, NextFunction } from 'express';

// const checkRole = (roles: string[]) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         const customerRole = req.customer?.role; // Assuming req.user contains the authenticated user's information
//         if (!customerRole) 
//             return res.status(403).json({ message: 'Access denied' });
//         if (!roles.includes(customerRole)) {
//             return res.status(403).json({ message: 'Access denied' })
//         }

//         next();
//     };
// };

// export { checkRole };
export { uploadOptions };