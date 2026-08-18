import { supabase } from './supabaseClient';

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
