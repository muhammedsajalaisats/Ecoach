// import { createClient } from '@supabase/supabase-js';
// const supabaseUrl = 'https://rwkleqxaxvtvozarkdls.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3a2xlcXhheHZ0dm96YXJrZGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4Mzk2MzEsImV4cCI6MjA1MjQxNTYzMX0._H3vN1xJBrOqFJIkz--XMAxAqyO8A_Ns1b01NN3h73k';

// const supabase = createClient(supabaseUrl, supabaseKey);

// export const saveFlightRecord = async (
//   flightNumber: string,
//   flightType: string,
//   flightName: string,
//   coachNumber: string
// ) => {
//   const { data, error } = await supabase
//     .from('flightRecords')
//     .insert([
//       {
//         flightNumber,
//         flightType,
//         flightName,
//         coachNumber,
//         createdAt: new Date().toISOString(),
//       },
//     ]);

//   if (error) {
//     throw new Error(error.message);
//   }

//   return data;
// };

// export const getFlightRecords = async () => {
//   const { data, error } = await supabase
//     .from('flightRecords')
//     .select('*');

//   if (error) {
//     throw new Error(error.message);
//   }

//   return data;
// };

