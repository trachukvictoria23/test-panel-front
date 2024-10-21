import { useToast } from "@/main"

export function uploadFile({ file, accepted, size = 5 }) {
  return new Promise((resolve, reject) => {
    const allowedFormats = accepted;
    const maxSize = size * 1024 * 1024; // 5MB

    // File existence check
    if (!file) return useToast(`Empty file passed.`, 'error')

    // File size check
    if (file.size > maxSize) return useToast(`The maximum file size should be less than ${size}MB.`, 'error')

    // File format check
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!allowedFormats.includes(fileExtension)) return useToast(`Allowed formats: ${allowedFormats?.toUpperCase()}`, 'error')

    // All conditions are met, the file can be uploaded
    const reader = new FileReader();
    reader.onload = () => {
      resolve(file);
    };
    reader.onerror = () => {
      reject("Error loading file.");
    };
    reader.readAsDataURL(file);
  });
}
