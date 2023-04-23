import * as path from 'path';
import * as mime from 'mime-types';

export function fileFilter(req, file, callback) {
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeType = mime.lookup(file.originalname);
    if (mimeType && mimeType.startsWith('image') && (ext === '.jpg' || ext === '.jpeg' || ext === '.png')) {
        callback(null, true);
    } else {
        callback(new Error('Only image files(with extensions .jpg, .png, .jpeg) are allowed'), false);
    }
}