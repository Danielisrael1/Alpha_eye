-- Create Screenings Table
CREATE TABLE IF NOT EXISTS public.screenings (
    id VARCHAR(50) PRIMARY KEY,
    "patientId" VARCHAR(50),
    "patientName" VARCHAR(150),
    age INTEGER,
    gender VARCHAR(20),
    location VARCHAR(200),
    "vhtName" VARCHAR(150),
    date VARCHAR(50),
    "eyeSide" VARCHAR(50),
    "imageUrl" TEXT,
    "eyeImageUrl" TEXT,
    diagnosis VARCHAR(150),
    "stageKey" VARCHAR(50),
    "confidenceScore" NUMERIC(5,2),
    status VARCHAR(50),
    "doctorNotes" TEXT,
    "assignedHospital" VARCHAR(150)
);

-- Create Eye Facilities Table
CREATE TABLE IF NOT EXISTS public.eye_facilities (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150),
    category VARCHAR(100),
    location VARCHAR(200),
    distance VARCHAR(50),
    coordinates JSONB,
    phone VARCHAR(50),
    email VARCHAR(100),
    "surgicalCapacity" VARCHAR(100),
    status VARCHAR(50)
);

-- Create VHT Teams Table
CREATE TABLE IF NOT EXISTS public.vht_teams (
    name VARCHAR(150) PRIMARY KEY,
    leader VARCHAR(150),
    "activeScans" INTEGER,
    "severeCases" INTEGER
);

-- Enable RLS (Row Level Security) and configure for public access (for prototype purposes)
ALTER TABLE public.screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eye_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vht_teams ENABLE ROW LEVEL SECURITY;

-- Create Policies to allow public read/write (In production, restrict this!)
CREATE POLICY "Allow public read access" ON public.screenings FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.screenings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.screenings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.screenings FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON public.eye_facilities FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.eye_facilities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.eye_facilities FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON public.vht_teams FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.vht_teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.vht_teams FOR UPDATE USING (true);


-- INSERT MOCK DATA FOR SCREENINGS
INSERT INTO public.screenings (id, "patientId", "patientName", age, gender, location, "vhtName", date, "eyeSide", "imageUrl", "eyeImageUrl", diagnosis, "stageKey", "confidenceScore", status, "doctorNotes", "assignedHospital") VALUES
('SCR-2026-001', 'UG-KLA-8821', 'Nakitende Florence', 58, 'Female', 'Kasubi Division, Kampala', 'Kiyimba Ronald (VHT #14)', '2026-08-04 10:15', 'Right Eye', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80', 'Moderate Cataract', 'MODERATE', 94.8, 'Pending Verification', '', 'Mengo Hospital Eye Dept'),
('SCR-2026-002', 'UG-WAK-4192', 'Ssemwanga Joseph', 64, 'Male', 'Nateete, Rubaga Division', 'Nalumansi Sarah (VHT #09)', '2026-08-04 09:30', 'Left Eye', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=600&q=80', 'Severe / Mature Cataract', 'SEVERE', 97.2, 'Referred', 'Dense nuclear sclerosis present. Patient reports central visual blur. Priority surgical candidate.', 'Mengo Hospital Eye Dept'),
('SCR-2026-003', 'UG-KLA-1109', 'Achieng Grace', 49, 'Female', 'Kisenyi, Kampala Central', 'Kiyimba Ronald (VHT #14)', '2026-08-03 16:45', 'Both Eyes', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=600&q=80', 'Mild Cataract', 'MILD', 91.5, 'Verified', 'Early cortical changes. Advised sunglasses and routine follow up in 6 months.', 'Mulago National Referral Hospital'),
('SCR-2026-004', 'UG-WAK-7712', 'Mukasa David', 52, 'Male', 'Bwaise, Kawempe Division', 'Kalyango Isaac (VHT #22)', '2026-08-03 14:10', 'Right Eye', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80', 'Normal Eye', 'NORMAL', 98.4, 'Verified', 'Clear cornea and crystal lens. No sign of opacification.', 'N/A'),
('SCR-2026-005', 'UG-KLA-3391', 'Nabatanzi Mary', 71, 'Female', 'Kasubi Division, Kampala', 'Kiyimba Ronald (VHT #14)', '2026-08-02 11:20', 'Left Eye', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=600&q=80', 'Severe / Mature Cataract', 'SEVERE', 96.1, 'Referred', 'Mature white cataract. Bilateral impairment. Urgent surgical referral issued.', 'Mengo Hospital Eye Dept')
ON CONFLICT (id) DO NOTHING;

-- INSERT MOCK DATA FOR FACILITIES
INSERT INTO public.eye_facilities (id, name, category, location, distance, coordinates, phone, email, "surgicalCapacity", status) VALUES
('FAC-01', 'Mengo Hospital Eye Department', 'Referral Hospital', 'Albert Cook Road, Namirembe, Kampala', '3.2 km', '{"lat": 0.3136, "lng": 32.5583}', '+256 414 270701', 'eyecare@mengohospital.org', 'High (120 surgeries/week)', 'Open Today'),
('FAC-02', 'Mulago National Referral Hospital Eye Center', 'National Hospital', 'Mulago Hill, Kampala', '5.8 km', '{"lat": 0.3381, "lng": 32.5761}', '+256 414 554001', 'ophthalmology@mulagohospital.go.ug', 'Very High (200 surgeries/week)', 'Open 24/7'),
('FAC-03', 'City Eye Care Kampala', 'Specialized Eye Clinic', 'Kimathi Avenue, Kampala Central', '2.1 km', '{"lat": 0.3152, "lng": 32.5819}', '+256 312 260100', 'info@cityeyecare.co.ug', 'Medium (45 surgeries/week)', 'Open Today'),
('FAC-04', 'Rubaga Hospital Ophthalmic Clinic', 'Mission Hospital', 'Rubaga Road, Kampala', '4.5 km', '{"lat": 0.3015, "lng": 32.5524}', '+256 414 270203', 'eyeclinic@rubagahospital.org', 'High (80 surgeries/week)', 'Open Today')
ON CONFLICT (id) DO NOTHING;

-- INSERT MOCK DATA FOR VHT TEAMS
INSERT INTO public.vht_teams (name, leader, "activeScans", "severeCases") VALUES
('Kasubi VHT Group A', 'Kiyimba Ronald', 48, 7),
('Nateete Community Team', 'Nalumansi Sarah', 35, 6),
('Bwaise Health Volunteers', 'Kalyango Isaac', 29, 3),
('Kisenyi Outreach Unit', 'Namubiru Joan', 42, 8)
ON CONFLICT (name) DO NOTHING;
