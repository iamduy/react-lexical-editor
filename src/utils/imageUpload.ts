/**
 * Utility to handle image upload or fallback to base64 if no upload handler is provided.
 * Returns a promise that resolves to the image URL or base64 string.
 */
export async function getImageUrlOrBase64(
  file: File,
  onUpload?: (file: File) => Promise<string | undefined>
): Promise<string> {
  if (onUpload) {
    return onUpload(file).then((url) => {
      if (url) return url;
      // fallback to base64 if upload returns undefined
      return fileToBase64(file);
    });
  } else {
    return fileToBase64(file);
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = (e) => {
      reject(e);
    };
    reader.readAsDataURL(file);
  });
}
