import cloudinary from "../config/cloudinary.js";
import ApiError from "./ApiError.js";

/**
 * Streams a Multer file (in-memory Buffer) to Cloudinary and returns the
 * secure URL + public_id. Used for single image, multiple images and resume.
 *
 * @param {object} file - Express/Multer file object (memory storage)
 * @param {string} folder - Cloudinary folder to group assets
 * @param {string} [resourceType="image"] - "image" | "raw" (for PDF/DOC)
 */
// export const uploadToCloudinary = async (file, folder, resourceType = "image") => {
//   if (!file || !file.buffer) {
//     throw new ApiError(400, "No file provided to upload");
//   }

//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder: `infrastructure_api/${folder}`,
//         resource_type: resourceType,
//       },
//       (err, result) => {
//         if (err) {
//           return reject(new ApiError(500, `Cloudinary upload failed: ${err.message}`));
//         }
//         if (!result || !("public_id" in result) || !result.secure_url) {
//           return reject(new ApiError(500, "Cloudinary upload returned no result"));
//         }
//         resolve({
//           url: result.secure_url,
//           public_id: result.public_id,
//         });
//       }
//     );
//     uploadStream.end(file.buffer);
//   });
// };


// export const uploadToCloudinary = async (file, folder, resourceType = "image") => {
//   if (!file || !file.buffer) {
//     throw new ApiError(400, "No file provided to upload");
//   }

//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder: `infrastructure_api/${folder}`,
//         resource_type: resourceType,

//         // add these
//         use_filename: true,
//         unique_filename: false,
//         public_id: file.originalname.replace(/\.[^/.]+$/, ""),
//       },
//       (err, result) => {
//         if (err) {
//           return reject(
//             new ApiError(500, `Cloudinary upload failed: ${err.message}`)
//           );
//         }

//         if (!result || !result.public_id || !result.secure_url) {
//           return reject(
//             new ApiError(500, "Cloudinary upload returned no result")
//           );
//         }

//         resolve({
//           url: result.secure_url,
//           public_id: result.public_id,
//         });
//       }
//     );

//     uploadStream.end(file.buffer);
//   });
// };
/**
 * Uploads an array of files in parallel and returns [{url, public_id}, ...].
 */

// export const uploadToCloudinary = async (file, folder, resourceType = "image") => {
//   if (!file || !file.buffer) {
//     throw new ApiError(400, "No file provided to upload");
//   }

//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder: `infrastructure_api/${folder}`,
//         resource_type: resourceType,
//         type: "upload",
// format: file.originalname.split(".").pop(),
//         use_filename: true,
//         unique_filename: true,
//       },
//       (err, result) => {
//         if (err) {
//           return reject(
//             new ApiError(500, `Cloudinary upload failed: ${err.message}`)
//           );
//         }

//         resolve({
//           url: result.secure_url,
//           public_id: result.public_id,
//         });
//       }
//     );

//     uploadStream.end(file.buffer);
//   });
// };


// export const uploadToCloudinary = async (file, folder, resourceType = "image") => {
//   if (!file || !file.buffer) {
//     throw new ApiError(400, "No file provided to upload");
//   }

//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder: `infrastructure_api/${folder}`,
//         resource_type: resourceType,
//         use_filename: true,
//         unique_filename: true,
//           public_id: `${file.originalname.replace(/\.[^/.]+$/, "")}.pdf`,
//           use_filename: true,
//   unique_filename: true,
//       },
//       (err, result) => {
//         if (err) {
//           return reject(new ApiError(500, `Cloudinary upload failed: ${err.message}`));
//         }

//         if (!result?.secure_url || !result?.public_id) {
//           return reject(new ApiError(500, "Cloudinary upload returned no result"));
//         }

//         resolve({
//           url: result.secure_url,
//           public_id: result.public_id,
//         });
//       }
//     );

//     uploadStream.end(file.buffer);
//   });
// };

export const uploadToCloudinary = async (
  file,
  folder,
  resourceType = "image"
) => {
  if (!file || !file.buffer) {
    throw new ApiError(400, "No file provided to upload");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `infrastructure_api/${folder}`,
        resource_type: resourceType,

        type: "upload",
        access_mode: "public",

        public_id: file.originalname,
        use_filename: true,
        unique_filename: true,
      },
      (err, result) => {
        if (err) {
          return reject(
            new ApiError(500, `Cloudinary upload failed: ${err.message}`)
          );
        }

        if (!result?.secure_url || !result?.public_id) {
          return reject(
            new ApiError(500, "Cloudinary upload returned no result")
          );
        }

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    uploadStream.end(file.buffer);
  });
};

export const uploadManyToCloudinary = async (files, folder, resourceType = "image") => {
  if (!files || files.length === 0) return [];
  return Promise.all(
    files.map((f) => uploadToCloudinary(f, folder, resourceType))
  );
};

/**
 * Deletes a single Cloudinary asset by public_id. Silently succeeds if the
 * id is missing — used in update/delete flows where an old asset may not exist.
 */
export const deleteFromCloudinary = async (public_id, resourceType = "image") => {
  if (!public_id) return null;
  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: resourceType,
    });
    return result;
  } catch (err) {
    // Never let a cleanup failure break a primary request — just log it.
    console.warn(`Cloudinary delete warning for ${public_id}:`, err.message);
    return null;
  }
};

/**
 * Deletes many Cloudinary assets in parallel.
 */
export const deleteManyFromCloudinary = async (public_ids, resourceType = "image") => {
  if (!public_ids || public_ids.length === 0) return [];
  return Promise.all(
    public_ids.map((id) => deleteFromCloudinary(id, resourceType))
  );
};

/**
 * Extracts the Cloudinary public_id from a full secure_url. Useful when
 * models store only the URL (e.g. service image) and we need to delete it.
 * Returns null if no public_id can be derived.
 */
export const extractPublicIdFromUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/");
    const uploadIdx = parts.findIndex((p) => p === "upload");
    if (uploadIdx < 0) return null;
    const afterUpload = parts.slice(uploadIdx + 1);
    // drop version segment like "v1234567890"
    if (afterUpload[0] && /^v\d+$/.test(afterUpload[0])) afterUpload.shift();
    const publicId = afterUpload.join("/").replace(/\.[^.]+$/, "");
    return publicId || null;
  } catch {
    return null;
  }
};

export default uploadToCloudinary;
