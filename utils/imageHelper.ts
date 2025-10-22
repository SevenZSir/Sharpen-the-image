
interface Base64ConversionResult {
  base64: string;
  mimeType: string;
}

export const fileToBase64 = (file: File): Promise<Base64ConversionResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // The result is a data URL like "data:image/jpeg;base64,..."
      // We need to strip the prefix "data:[mimeType];base64,"
      const base64 = result.split(',')[1];
      const mimeType = file.type;
      if (base64) {
        resolve({ base64, mimeType });
      } else {
        reject(new Error("Failed to convert file to Base64."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
