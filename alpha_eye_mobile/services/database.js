import { supabase } from '../lib/supabase';

// Fetch all screenings (no auth filter for now)
export const fetchScreenings = async () => {
  const { data, error } = await supabase
    .from('screenings')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching screenings:', error.message || error);
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
    console.error('Error adding screening:', error.message || error);
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
    console.error('Error fetching facilities:', error.message || error);
    return [];
  }
  return data || [];
};
