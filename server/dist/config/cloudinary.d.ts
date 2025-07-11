import { v2 as cloudinaryV2, UploadApiResponse, DeleteApiResponse } from "cloudinary";
export declare const uploadToCloudinary: (filePath: string, folder: string, publicId?: string) => Promise<UploadApiResponse>;
export declare const deleteFromCloudinary: (publicId: string) => Promise<DeleteApiResponse>;
export { cloudinaryV2 as cloudinary };
//# sourceMappingURL=cloudinary.d.ts.map