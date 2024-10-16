// src/utils/firebaseHelpers.js
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

export const fetchBackgroundImage = async (imageName) => {
  const storage = getStorage();
  const backgroundImageRef = ref(storage, `gs://x-saas-4550f.appspot.com/${imageName}`);
  return await getDownloadURL(backgroundImageRef);
};