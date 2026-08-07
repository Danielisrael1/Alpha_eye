/**
 * AlphaEye Initial Database & Mock Storage
 * Contains community screening data from Kampala/Wakiso VHT outreach programs
 */

export const INITIAL_SCREENINGS = [
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
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    eyeImageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
    diagnosis: 'Moderate Cataract',
    stageKey: 'MODERATE',
    confidenceScore: 94.8,
    status: 'Pending Verification',
    doctorNotes: '',
    assignedHospital: 'Mengo Hospital Eye Dept'
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
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    eyeImageUrl: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=600&q=80',
    diagnosis: 'Severe / Mature Cataract',
    stageKey: 'SEVERE',
    confidenceScore: 97.2,
    status: 'Referred',
    doctorNotes: 'Dense nuclear sclerosis present. Patient reports central visual blur. Priority surgical candidate.',
    assignedHospital: 'Mengo Hospital Eye Dept'
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
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    eyeImageUrl: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=600&q=80',
    diagnosis: 'Mild Cataract',
    stageKey: 'MILD',
    confidenceScore: 91.5,
    status: 'Verified',
    doctorNotes: 'Early cortical changes. Advised sunglasses and routine follow up in 6 months.',
    assignedHospital: 'Mulago National Referral Hospital'
  },
  {
    id: 'SCR-2026-004',
    patientId: 'UG-WAK-7712',
    patientName: 'Mukasa David',
    age: 52,
    gender: 'Male',
    location: 'Bwaise, Kawempe Division',
    vhtName: 'Kalyango Isaac (VHT #22)',
    date: '2026-08-03 14:10',
    eyeSide: 'Right Eye',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    eyeImageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
    diagnosis: 'Normal Eye',
    stageKey: 'NORMAL',
    confidenceScore: 98.4,
    status: 'Verified',
    doctorNotes: 'Clear cornea and crystal lens. No sign of opacification.',
    assignedHospital: 'N/A'
  },
  {
    id: 'SCR-2026-005',
    patientId: 'UG-KLA-3391',
    patientName: 'Nabatanzi Mary',
    age: 71,
    gender: 'Female',
    location: 'Kasubi Division, Kampala',
    vhtName: 'Kiyimba Ronald (VHT #14)',
    date: '2026-08-02 11:20',
    eyeSide: 'Left Eye',
    imageUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
    eyeImageUrl: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=600&q=80',
    diagnosis: 'Severe / Mature Cataract',
    stageKey: 'SEVERE',
    confidenceScore: 96.1,
    status: 'Referred',
    doctorNotes: 'Mature white cataract. Bilateral impairment. Urgent surgical referral issued.',
    assignedHospital: 'Mengo Hospital Eye Dept'
  }
];

export const EYE_FACILITIES = [
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
    status: 'Open Today'
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
    status: 'Open 24/7'
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
    status: 'Open Today'
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
    status: 'Open Today'
  }
];

export const VHT_OUTREACH_TEAMS = [
  { name: 'Kasubi VHT Group A', leader: 'Kiyimba Ronald', activeScans: 48, severeCases: 7 },
  { name: 'Nateete Community Team', leader: 'Nalumansi Sarah', activeScans: 35, severeCases: 6 },
  { name: 'Bwaise Health Volunteers', leader: 'Kalyango Isaac', activeScans: 29, severeCases: 3 },
  { name: 'Kisenyi Outreach Unit', leader: 'Namubiru Joan', activeScans: 42, severeCases: 8 }
];
