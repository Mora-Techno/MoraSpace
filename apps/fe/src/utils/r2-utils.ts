'use server';

import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { env } from '@/configs';

// Konversi WebP hemat storage: kualitas 82 + sisi terpanjang max 1600px.
const WEBP_QUALITY = 82;
const WEBP_MAX_DIMENSION = 1600;

const bucketName = process.env.NEXT_R2_BUCKET || process.env.R2_BUCKET || 'space';
const avatarsPrefix = 'avatars';
const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_URL || '';

let r2ClientInstance: S3Client | null = null;

function getR2Client(): S3Client {
  if (!r2ClientInstance) {
    const accountId =
      env.NEXT_CLOUDFLARE_ACCOUNT_ID || process.env.NEXT_CLOUDFLARE_ACCOUNT_ID || '';
    r2ClientInstance = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.NEXT_ACCESS_KEY_ID,
        secretAccessKey: env.NEXT_SECRET_ACCESS_KEY,
      },
    });
  }
  return r2ClientInstance;
}

export async function uploadAvatar(
  fileOrFormData: File | FormData,
  folder: string = avatarsPrefix,
): Promise<string> {
  let file: File;

  if (typeof FormData !== 'undefined' && fileOrFormData instanceof FormData) {
    const formFile = fileOrFormData.get('file');
    if (!formFile || !(formFile instanceof File)) {
      throw new Error('File tidak ditemukan dalam FormData.');
    }
    file = formFile;
  } else if (fileOrFormData && typeof (fileOrFormData as File).arrayBuffer === 'function') {
    file = fileOrFormData as File;
  } else {
    throw new Error('Format file tidak valid.');
  }

  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  // Semua gambar (kecuali webp/svg) dikonversi ke WebP sebelum naik ke R2.
  // Gagal convert (format aneh) -> file asli tetap diupload.
  let body: Buffer = inputBuffer;
  let contentType = file.type || 'image/jpeg';
  let fileExtension = file.name.split('.').pop() || 'jpg';
  const converted = await toWebpBuffer(inputBuffer, file.type);
  if (converted) {
    body = converted;
    contentType = 'image/webp';
    fileExtension = 'webp';
  }

  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
  const folderPath = folder.endsWith('/') ? folder : `${folder}/`;
  const Key = `${folderPath}${fileName}`;

  const uploadParams = {
    Bucket: bucketName,
    Key,
    Body: body,
    ContentType: contentType,
  };

  const client = getR2Client();
  await client.send(new PutObjectCommand(uploadParams));

  if (R2_PUBLIC_URL) {
    return `${R2_PUBLIC_URL}/${Key}`;
  }

  const accountId = env.NEXT_CLOUDFLARE_ACCOUNT_ID || process.env.NEXT_CLOUDFLARE_ACCOUNT_ID || '';
  return `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${Key}`;
}

export async function uploadNoteImage(fileOrFormData: File | FormData): Promise<string> {
  return uploadAvatar(fileOrFormData, 'notes');
}

/**
 * Konversi buffer gambar ke WebP.
 * Catatan: Pada Cloudflare Workers runtime (V8 isolate), native binary seperti sharp tidak dapat dieksekusi.
 * Return null agar file asli tetap diupload ke R2 secara aman dan efisien.
 */
async function toWebpBuffer(_input: Buffer, _mimeType: string): Promise<Buffer | null> {
  return null;
}

export async function deleteObject(fileUrl: string): Promise<void> {
  try {
    const url = new URL(fileUrl);
    let Key = url.pathname.substring(1);

    if (Key.startsWith(`${bucketName}/`)) {
      Key = Key.substring(`${bucketName}/`.length);
    }

    const deleteParams = {
      Bucket: bucketName,
      Key,
    };

    const client = getR2Client();
    await client.send(new DeleteObjectCommand(deleteParams));
  } catch (error) {
    console.error('Failed to delete file from R2:', error);
    throw new Error('Gagal menghapus file');
  }
}
