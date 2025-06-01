import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import config from '../config';

cloudinary.config({
   cloud_name: config.cloudinary.cloud_name,
   api_key: config.cloudinary.api_key,
   api_secret: config.cloudinary.api_secret,
});

const uploadImageToCloudinary = async (
   localFilePath: string
): Promise<{ url: string; public_id: string } | null> => {
   try {
      if (!localFilePath) return null;

      const result = await cloudinary.uploader.upload(localFilePath, {
         folder: 'uploads',
         resource_type: 'auto',
      });

      if (result.public_id) {
         fs.unlinkSync(localFilePath); // Clean up local file after upload
      }
      return {
         url: result.secure_url,
         public_id: result.public_id,
      };
   } catch (error) {
      fs.unlinkSync(localFilePath); // Clean up local file if upload fails
      return null;
   }
};
const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
   try {
      if (!publicId) return;

      await cloudinary.uploader.destroy(publicId, {
         resource_type: 'auto',
         invalidate: true,
      });
   } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
   }
};
export const cloudinaryHelpers = {
   uploadImageToCloudinary,
   deleteImageFromCloudinary,
};
