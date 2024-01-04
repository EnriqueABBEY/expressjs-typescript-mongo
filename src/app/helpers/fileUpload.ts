import { S3Client } from '@aws-sdk/client-s3';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import * as dotenv from 'dotenv';
dotenv.config();

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, // store it in .env file to keep it safe
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: process.env.AWS_DEFAULT_REGION // this is the region that you select in AWS account
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `public/uploads/`)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1])
    }
})

const storageS3 = function s3Connect(folder: String) {
    return multerS3({
        s3: s3, // s3 instance
        bucket: process.env.AWS_BUCKET, // change it as per your project requirement
        metadata: (req, file, cb) => {
            cb(null, { fieldname: file.fieldname })
        },
        key: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, folder + '/' + file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
        }
    })
}

const fileUpload = function upload(folder: string) {
    return multer({
        storage: storageS3(folder),
        fileFilter: (req, file, cb) => {
            if (file.originalname.match(/\.(jpg|jpeg|png|gif|mp4|avi|mkv|doc|docx|odt|csv|xlsx|xls|pdf|txt|pptx)$/)) {
                cb(null, true);
            } else {
                return cb(new Error(`Ivalid file type for ${file.originalname}`));
            }
        }
    })
};

export default fileUpload;