import { supabase } from '../lib/supabase';

// Inline SVG so the fallback never depends on a network request itself.
// (Several previously-used Unsplash photo IDs here didn't actually depict
// eyes - a portrait, a fashion photo, a pile of pills.)
const EYE_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
    '<rect width="100" height="100" fill="#e2e8f0"/>' +
    '<path d="M50 32c-16 0-28 12-33 18 5 6 17 18 33 18s28-12 33-18c-5-6-17-18-33-18z" fill="none" stroke="#94a3b8" stroke-width="4"/>' +
    '<circle cx="50" cy="50" r="10" fill="#94a3b8"/>' +
    '</svg>'
  );

// Fallback initial data for offline mode / network errors
export const MOCK_SCREENINGS = [
  {
    id: 'SCR-2026-001',
    patientId: 'UG-KLA-8821',
    patientName: 'Nakitende Florence',
    age: 58,
    gender: 'Female',
    location: 'Kasubi Division, Kampala',
    vhtName: 'Kiyimba Ronald (VHT #14)',
    date: '2026-08-04 10:15',
    eyeSide: 'Right Eye',
    eyeImageUrl: EYE_PLACEHOLDER,
    diagnosis: 'Moderate Cataract',
    stageKey: 'MODERATE',
    confidenceScore: 94.8,
    status: 'Pending Verification',
    doctorNotes: '',
    assignedHospital: 'Mengo Hospital Eye Dept',
  },
  {
    id: 'SCR-2026-002',
    patientId: 'UG-WAK-4192',
    patientName: 'Ssemwanga Joseph',
    age: 64,
    gender: 'Male',
    location: 'Nateete, Rubaga Division',
    vhtName: 'Nalumansi Sarah (VHT #09)',
    date: '2026-08-04 09:30',
    eyeSide: 'Left Eye',
    eyeImageUrl: EYE_PLACEHOLDER,
    diagnosis: 'Severe / Mature Cataract',
    stageKey: 'SEVERE',
    confidenceScore: 97.2,
    status: 'Referred',
    doctorNotes: 'Dense nuclear sclerosis present. Patient reports central visual blur. Priority surgical candidate.',
    assignedHospital: 'Mengo Hospital Eye Dept',
  },
  {
    id: 'SCR-2026-003',
    patientId: 'UG-KLA-1109',
    patientName: 'Achieng Grace',
    age: 49,
    gender: 'Female',
    location: 'Kisenyi, Kampala Central',
    vhtName: 'Kiyimba Ronald (VHT #14)',
    date: '2026-08-03 16:45',
    eyeSide: 'Both Eyes',
    eyeImageUrl: EYE_PLACEHOLDER,
    diagnosis: 'Mild Cataract',
    stageKey: 'MILD',
    confidenceScore: 91.5,
    status: 'Verified',
    doctorNotes: 'Early cortical changes. Advised sunglasses and routine follow up in 6 months.',
    assignedHospital: 'Mulago National Referral Hospital',
  },
];

export const MOCK_FACILITIES = [
  {
    id: 'FAC-01',
    name: 'Mengo Hospital Eye Department',
    category: 'Referral Hospital',
    location: 'Albert Cook Road, Namirembe, Kampala',
    distance: '3.2 km',
    coordinates: { lat: 0.3136, lng: 32.5583 },
    phone: '+256 414 270701',
    email: 'eyecare@mengohospital.org',
    surgicalCapacity: 'High (120 surgeries/week)',
    status: 'Open Today',
  },
  {
    id: 'FAC-02',
    name: 'Mulago National Referral Hospital Eye Center',
    category: 'National Hospital',
    location: 'Mulago Hill, Kampala',
    distance: '5.8 km',
    coordinates: { lat: 0.3381, lng: 32.5761 },
    phone: '+256 414 554001',
    email: 'ophthalmology@mulagohospital.go.ug',
    surgicalCapacity: 'Very High (200 surgeries/week)',
    status: 'Open 24/7',
  },
  {
    id: 'FAC-03',
    name: 'City Eye Care Kampala',
    category: 'Specialized Eye Clinic',
    location: 'Kimathi Avenue, Kampala Central',
    distance: '2.1 km',
    coordinates: { lat: 0.3152, lng: 32.5819 },
    phone: '+256 312 260100',
    email: 'info@cityeyecare.co.ug',
    surgicalCapacity: 'Medium (45 surgeries/week)',
    status: 'Open Today',
  },
  {
    id: 'FAC-04',
    name: 'Rubaga Hospital Ophthalmic Clinic',
    category: 'Mission Hospital',
    location: 'Rubaga Road, Kampala',
    distance: '4.5 km',
    coordinates: { lat: 0.3015, lng: 32.5524 },
    phone: '+256 414 270203',
    email: 'eyeclinic@rubagahospital.org',
    surgicalCapacity: 'High (80 surgeries/week)',
    status: 'Open Today',
  },
];

// Fetch all screenings
export const fetchScreenings = async () => {
  try {
    const { data, error } = await supabase
      .from('screenings')
      .select('*')
      .order('date', { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_SCREENINGS;
    }
    return data;
  } catch (_err) {
    return MOCK_SCREENINGS;
  }
};

// Upload local image URI to Supabase Storage bucket 'eye-scans'.
// Returns the public URL, or null if the upload failed - a device-local
// file: URI must never be returned, since it can't be resolved by any
// other device/browser that later reads this record.
export const uploadEyeImage = async (imageUri, scanId) => {
  try {
    if (!imageUri || !imageUri.startsWith('file:')) return imageUri;

    const response = await fetch(imageUri);
    const blob = await response.blob();
    const fileName = `${scanId || Date.now()}.jpg`;

    const { error } = await supabase.storage
      .from('eye-scans')
      .upload(fileName, blob, { contentType: 'image/jpeg', upsert: true });

    if (error) {
      console.error('Error uploading eye image:', error);
      return null;
    }

    const { data: publicData } = supabase.storage
      .from('eye-scans')
      .getPublicUrl(fileName);

    return publicData?.publicUrl || null;
  } catch (err) {
    console.error('Error uploading eye image:', err);
    return null;
  }
};

// Add a new screening
export const addScreening = async (screeningData) => {
  try {
    const recordToInsert = { ...screeningData };

    // Upload local image to Supabase Storage if needed
    if (recordToInsert.eyeImageUrl && recordToInsert.eyeImageUrl.startsWith('file:')) {
      const publicUrl = await uploadEyeImage(recordToInsert.eyeImageUrl, recordToInsert.id);
      recordToInsert.eyeImageUrl = publicUrl || EYE_PLACEHOLDER;
    }

    const { data, error } = await supabase
      .from('screenings')
      .insert([recordToInsert])
      .select();

    if (error) {
      MOCK_SCREENINGS.unshift(recordToInsert);
      return recordToInsert;
    }
    return data?.[0] || recordToInsert;
  } catch (_err) {
    MOCK_SCREENINGS.unshift(screeningData);
    return screeningData;
  }
};

// Fetch all eye facilities
export const fetchFacilities = async () => {
  try {
    const { data, error } = await supabase
      .from('eye_facilities')
      .select('*');

    if (error || !data || data.length === 0) {
      return MOCK_FACILITIES;
    }
    return data;
  } catch (_err) {
    return MOCK_FACILITIES;
  }
};
