import { Request } from "express";

const utils = {
    imageExtFilter(req: Request) {
        let isImage = true;
        // accept image only
        if (!req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            isImage = false;
        }
        return isImage;
    },
    fileFilter(req, file: Express.Multer.File, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp4|avi|mkv|doc|docx|odt|csv|xlsx|xls|pdf|txt|pptx)$/)) {
            cb(Error(`Ivalid file type for ${file.originalname} in the key ${file.fieldname}`));
        }
        cb(null, true);
    },
    validateArrayOfFiles(files: Array<Express.Multer.File>) {
        let errors: {
            files: Array<[any]>
        } = { files: [] }
        files.forEach((key, file) => {
            if (!this.imageExtFilter(file)) {
                errors.files.push([`Extension of file ${key}`]);
            }
        })
        return errors;
    }
}

export default utils;