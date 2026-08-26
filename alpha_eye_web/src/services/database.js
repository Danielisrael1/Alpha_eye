import { supabase } from './supabaseClient';

// Upload a captured/selected eye photo to Supabase Storage and return its
// public URL. Local blob:/data: URLs only work in the tab that created them,
// so they can't be stored as a shared eyeImageUrl - this persists the bytes.
export const uploadEyeImage = async (file, scanId) => {
  if (!file) return null;
  try {
    const fileName = `${scanId || Date.now()}.jpg`;
    const { error } = await supabase.storage
      .from('eye-scans')
      .upload(fileName, file, { contentType: file.type || 'image/jpeg', upsert: true });

    if (error) {
      console.error('Error uploading eye image:', error);
      return null;
    }

    const { data } = supabase.storage.from('eye-scans').getPublicUrl(fileName);
    return data?.publicUrl || null;
  } catch (err) {
    console.error('Error uploading eye image:', err);
    return null;
  }
};

// Fetch all screenings
export const fetchScreenings = async () => {
  const { data, error } = await supabase
    .from('screenings')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching screenings:', error);
    return [];
  }
  return data || [];
};

// Add a new screening
export const addScreening = async (screeningData) => {
  const { data, error } = await supabase
    .from('screenings')
    .insert([screeningData])
    .select();

  if (error) {
    console.error('Error adding screening:', error);
    throw error;
  }
  return data?.[0] || null;
};

// Update an existing screening
export const updateScreening = async (id, updateData) => {
  const { data, error } = await supabase
    .from('screenings')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating screening:', error);
    throw error;
  }
  return data?.[0] || null;
};

// Fetch all eye facilities
export const fetchFacilities = async () => {
  const { data, error } = await supabase
    .from('eye_facilities')
    .select('*');

  if (error) {
    console.error('Error fetching facilities:', error);
    return [];
  }
  return data || [];
};

// Fetch all VHT teams
export const fetchVhtTeams = async () => {
  const { data, error } = await supabase
    .from('vht_teams')
    .select('*');

  if (error) {
    console.error('Error fetching VHT teams:', error);
    return [];
  }
  return data || [];
};
