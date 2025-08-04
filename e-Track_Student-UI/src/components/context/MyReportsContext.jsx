import React, { createContext, useContext, useState, useCallback } from 'react';

const ReportsContext = createContext(undefined);

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};

export const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState([]);

  const addReport = useCallback((productData, reportedStatus, issueDescription) => {
    const newReport = {
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productData,
      reportedStatus,
      issueDescription,
      reportedAt: new Date().toISOString(),
      reportStatus: 'pending'
    };

    setReports(prev => [newReport, ...prev]);
  }, []);

  const updateReportStatus = useCallback((reportId, status) => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, reportStatus: status } : report
    ));
  }, []);

  return (
    <ReportsContext.Provider value={{
      reports,
      addReport,
      updateReportStatus
    }}>
      {children}
    </ReportsContext.Provider>
  );
};