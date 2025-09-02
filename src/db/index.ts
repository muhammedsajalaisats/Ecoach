import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://rwkleqxaxvtvozarkdls.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3a2xlcXhheHZ0dm96YXJrZGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4Mzk2MzEsImV4cCI6MjA1MjQxNTYzMX0._H3vN1xJBrOqFJIkz--XMAxAqyO8A_Ns1b01NN3h73k';

const supabase = createClient(supabaseUrl, supabaseKey);

export const saveFlightRecord = async (
  flightNumber: string,
  flightType: string,
  flightName: string,
  coachNumber: string
) => {
  const { data, error } = await supabase
    .from('flightRecords')
    .insert([
      {
        flightNumber,
        flightType,
        flightName,
        coachNumber,
        createdAt: new Date().toISOString(),
      },
    ]);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getFlightRecords = async (offset: number = 0, limit: number = 1000) => {
  const { data, error } = await supabase
    .from('flightRecords')
    .select('*')
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message);
  return data;
};

export const saveFlightDetails = async (
  flightNumber: string,
  type: string,
  flightName: string,
  origin: string
) => {
  try {
    const { data, error } = await supabase
      .from('flight_data')
      .insert([
        { flightNumber, type, flightName, origin } // Ensure all fields are included
      ]);

    if (error) {
      console.error('Error saving flight details:', error);
      throw error;
    }

    console.log('Flight details saved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in saveFlightDetails:', error);
    throw error;
  }
};

export const checkFlightNumberExists = async (flightNumber: string) => {
  const { data, error } = await supabase
    .from('flight_data')
    .select('flightNumber')
    .eq('flightNumber', flightNumber);
     
  if (error) {
    throw error;
  }

  return data.length > 0;
};

// New function to clear all data from flightRecords table
export const clearFlightRecords = async () => {
  try {
    const { error } = await supabase
      .from('flightRecords')
      .delete()
      .neq('id', 0); // This condition will match all rows (assuming id is never 0)

    if (error) {
      console.error('Error clearing flight records:', error);
      throw error;
    }

    console.log('All flight records cleared successfully');
    return { success: true, message: 'All flight records deleted' };
  } catch (error) {
    console.error('Error in clearFlightRecords:', error);
    throw error;
  }
};