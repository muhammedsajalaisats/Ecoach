import React, { useEffect, useState } from 'react';
import { FlightChecker } from './components/FlightChecker';
import { OtherCoachFlightChecker } from './components/OtherCoachDispatchStaff';
import { OtherCoachStatus } from './components/OtherCoachOperator';
import { OtherArrival } from './components/OtherArrivalGateStaff';
import { AdminDataManagement } from './components/AdminDataManagement';
import { QRScanner } from './components/QRScanner';
import { Login } from './components/Login';
import { Navbar } from './components/Navbar';
import { CoachStatus } from './components/CoachStatus';
import { Coachoperatorf } from './components/CoachOperator';
import { SuperDataManagement } from './components/superadmin';
import { CoachReleasePage } from './components/CoachReleasepage';
import { createClient } from '@supabase/supabase-js';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

const supabase = createClient(
  'https://rwkleqxaxvtvozarkdls.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3a2xlcXhheHZ0dm96YXJrZGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4Mzk2MzEsImV4cCI6MjA1MjQxNTYzMX0._H3vN1xJBrOqFJIkz--XMAxAqyO8A_Ns1b01NN3h73k'
);

declare module './components/QRScanner' {
  interface QRScannerProps {
    coachNo: string;
  }
}

function AppContent() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'check' | 'upload' | 'scan' | 'status' | 'super' | 'coachoperator' | 'othercoach' | 'othercoachstatus' | 'otherarrival' | 'coachrelease'>('check');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [coachNo, setCoachNo] = useState<string>('');
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're on a route that should set a specific tab
    if (location.pathname.startsWith('/other-coach-status')) {
      setActiveTab('othercoachstatus');
    } else if (location.pathname === '/coach-release') {
      setActiveTab('coachrelease');
    }
  }, [location]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const coachNoParam = queryParams.get('coach_number') || queryParams.get('CoachNo') || '';
    setCoachNo(coachNoParam);

    if (coachNoParam === 'OT-01') {
      setActiveTab('othercoach');
      setIsLoading(false);
      setInitialLoadComplete(true);
    } else if (coachNoParam) {
      checkFlightStatus(coachNoParam);
    } else {
      setIsLoading(false);
      setInitialLoadComplete(true);
    }
  }, []);

  const checkFlightStatus = async (coachNumber: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('flightRecords')
        .select('Status, created_at')
        .eq('coach_number', coachNumber)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setStatus(data[0].Status || null);
        
        if (data[0].Status === 'Open') {
          setActiveTab('status');
        } else if (data[0].Status === 'Acknowledged') {
          setActiveTab('scan');
        } else if (data[0].Status === 'Arrived') {
          setActiveTab('otherarrival');
        } else {
          setActiveTab('check');
        }
      } else {
        setStatus(null);
        setActiveTab('check');
      }
    } catch (error) {
      console.error('Error fetching flight status:', error);
      setActiveTab('check');
    } finally {
      setIsLoading(false);
      setInitialLoadComplete(true);
    }
  };

  const handleNavigateToOtherCoachStatus = () => {
    setActiveTab('othercoachstatus');
    navigate('/other-coach-status');
  };

  const handleNavigateToCoachRelease = () => {
    setActiveTab('coachrelease');
    navigate('/coach-release');
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (tab === 'othercoachstatus') {
      navigate('/other-coach-status');
    } else if (tab === 'coachrelease') {
      navigate('/coach-release');
    } else {
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-pulse text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!initialLoadComplete) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="animate-fade-in pt-8">
        {activeTab === 'check' && <FlightChecker coachNo={coachNo} />}
        {activeTab === 'scan' && <QRScanner coachNo={coachNo} />}
        {activeTab === 'upload' && (!isUserLoggedIn ? <Login onLogin={() => setIsUserLoggedIn(true)} /> : <AdminDataManagement />)}
        {activeTab === 'status' && <CoachStatus coachNo={coachNo} />}
        {activeTab === 'coachoperator' && <Coachoperatorf />}
        {activeTab === 'super' && (!isUserLoggedIn ? <Login onLogin={() => setIsUserLoggedIn(true)} /> : <SuperDataManagement />)}
        {activeTab === 'othercoach' && (
          <OtherCoachFlightChecker 
            coachNo={coachNo} 
            onNavigateToStatus={handleNavigateToOtherCoachStatus} 
          />
        )}
        {activeTab === 'othercoachstatus' && <OtherCoachStatus />}
        {activeTab === 'otherarrival' && <OtherArrival />}
        {activeTab === 'coachrelease' && <CoachReleasePage />}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/other-coach-status" element={<AppContent />} />
        <Route path="/other-coach-status/:flightNumber" element={<AppContent />} />
        <Route path="/coach-release" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;