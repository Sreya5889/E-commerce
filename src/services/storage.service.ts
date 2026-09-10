import { supabase } from '../lib/supabase';

export const storageService = {
  async uploadAvatar(userId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  },

  async uploadCourseImage(courseId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const filePath = `${courseId}/thumbnail-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('course-images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('course-images').getPublicUrl(filePath);
    return data.publicUrl;
  },

  async getSignedUrl(bucket: string, path: string, expiresInSeconds = 3600) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresInSeconds);

    if (error) throw error;
    return data.signedUrl;
  }
};
