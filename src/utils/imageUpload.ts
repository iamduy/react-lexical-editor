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

export function base64ToFile(base64: string, filename = "image.png"): File {
  const [meta, data] = base64.split(",");
  const mime = meta.match(/data:(.*?);/)?.[1] ?? "image/png";
  const binary = atob(data);
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }

  return new File([array], filename, { type: mime });
}
