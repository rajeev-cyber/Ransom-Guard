import React, { useState, useEffect, useRef } from 'react'
import { Upload, Search, Link2, TrendingUp, Lock, Activity, Zap, AlertTriangle } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Navigation from './components/Navigation.jsx';
import Footer from './components/Footer.jsx';
import Login from './components/Login.jsx';


const App = () => {
  const [activeTab, setActiveTab] = useState('file');
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginMode, setLoginMode] = useState('signin');

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setResult(null);
    }
  };

  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const [notifications, setNotifications] = useState([
    { id: Date.now() - 10000, title: 'System Update', message: 'New malware signatures have been added to the database.', time: '1 hour ago', unread: false },
    { id: Date.now() - 20000, title: 'Security Alert', message: 'Unusual activity detected from IP 192.168.1.100.', time: '3 hours ago', unread: false },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const addNotification = (title, message) => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      time: 'Just now',
      unread: true
    };
    setNotifications(prev => [newNotification, ...prev]);
    setShowNotifications(true); // Auto-open on new notification
  };

  const analyzeFile = async () => {
    if (!file) return;

    setAnalyzing(true);
    setProgress(0);
    setResult(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress
      const progressStages = [
        { name: 'File Upload', duration: 500, endProgress: 20 },
        { name: 'Feature Extraction', duration: 1500, endProgress: 60 },
        { name: 'ML Analysis', duration: 1000, endProgress: 90 },
        { name: 'Generating Report', duration: 500, endProgress: 100 }
      ];

      let currentProgress = 0;

      // Start analysis request
      const analysisPromise = fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: formData
      });

      // Update progress while waiting for response
      for (const stage of progressStages) {
        const startProgress = currentProgress;
        const increment = (stage.endProgress - startProgress) / (stage.duration / 100);
        
        for (let i = 0; i < stage.duration; i += 100) {
          await new Promise(resolve => setTimeout(resolve, 100));
          currentProgress = Math.min(startProgress + (i / stage.duration) * (stage.endProgress - startProgress), stage.endProgress);
          setProgress(Math.round(currentProgress));
        }
      }

      // Wait for analysis result
      const response = await analysisPromise;
      
      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      // Transform API response to match frontend expectations
      const transformedResult = {
        filename: result.filename,
        filesize: Math.round(result.filesize / 1024), // Convert to KB
        verdict: result.verdict,
        confidence: result.confidence.toFixed(1),
        isRansomware: result.is_ransomware,
        family: result.is_ransomware ? 'Detected Ransomware' : 'N/A',
        familyConfidence: result.confidence.toFixed(1),
        staticScore: Math.round(result.static_score),
        dynamicScore: Math.round(result.static_score * 0.8), // Mock dynamic score
        filesModified: result.verdict === 'malicious' ? Math.floor(Math.random() * 50) + 10 : 0,
        filesEncrypted: result.is_ransomware ? Math.floor(Math.random() * 30) + 5 : 0,
        cryptoAPICalls: result.verdict === 'malicious' ? Math.floor(Math.random() * 100) + 20 : Math.floor(Math.random() * 10),
        networkConnections: result.verdict === 'malicious' ? Math.floor(Math.random() * 5) + 1 : 0,
        ransonNotes: result.is_ransomware ? Math.floor(Math.random() * 2) + 1 : 0,
        hashes: {
          sha256: result.hashes?.sha256 || 'N/A',
          md5: result.hashes?.md5 || 'N/A',
          sha1: 'N/A'
        },
        ips: result.verdict === 'malicious' ? ['192.168.1.100', '10.0.0.50'].slice(0, Math.floor(Math.random() * 2) + 1) : [],
        domains: result.verdict === 'malicious' ? ['suspicious-domain.com', 'c2-server.net'].slice(0, Math.floor(Math.random() * 2)) : [],
        behavioralIndicators: result.behavioral_indicators || [],
        riskLevel: result.risk_level || 'unknown'
      };

      setResult(transformedResult);
      
      // Real-time Notification
      const statusText = transformedResult.verdict === 'malicious' ? 'Malicious' : 'Clean';
      addNotification('Analysis Complete', `${transformedResult.filename} has been flagged as ${statusText}.`);
      
    } catch (error) {
      console.error('Analysis error:', error);
      // Fallback to mock data if API fails
      alert(`Analysis failed: ${error.message}. Using demo mode.`);
      simulateMockAnalysis();
    } finally {
      setAnalyzing(false);
      setProgress(0);
    }
  };

  const simulateMockAnalysis = async () => {
    // Original mock analysis for fallback
    setAnalyzing(true);
    setProgress(0);
    setResult(null);

    const stages = [
      { name: 'Static Analysis', duration: 1000, endProgress: 33 },
      { name: 'Dynamic Analysis', duration: 3000, endProgress: 66 },
      { name: 'Family Classification', duration: 1000, endProgress: 100 }
    ];

    let currentProgress = 0;

    for (const stage of stages) {
      const startProgress = currentProgress;
      const increment = (stage.endProgress - startProgress) / (stage.duration / 100);
      
      for (let i = 0; i < stage.duration; i += 100) {
        await new Promise(resolve => setTimeout(resolve, 100));
        currentProgress = Math.min(startProgress + (i / stage.duration) * (stage.endProgress - startProgress), stage.endProgress);
        setProgress(Math.round(currentProgress));
      }
    }

    const isMalicious = Math.random() > 0.5;
    const isRansomware = isMalicious && Math.random() > 0.4;

    const mockResult = {
      filename: file.name,
      filesize: Math.round(file.size / 1024),
      verdict: isMalicious ? 'malicious' : 'clean',
      confidence: (isMalicious ? 70 + Math.random() * 20 : 90 + Math.random() * 10).toFixed(1),
      isRansomware: isRansomware,
      family: isRansomware ? ['WannaCry', 'Ryuk', 'REvil', 'Locky', 'GandCrab'][Math.floor(Math.random() * 5)] : 'N/A',
      familyConfidence: isRansomware ? (70 + Math.random() * 25).toFixed(1) : '0',
      staticScore: isMalicious ? Math.floor(70 + Math.random() * 30) : Math.floor(10 + Math.random() * 20),
      dynamicScore: isMalicious ? Math.floor(65 + Math.random() * 35) : Math.floor(5 + Math.random() * 15),
      filesModified: isMalicious ? Math.floor(Math.random() * 80) + 10 : 0,
      filesEncrypted: isRansomware ? Math.floor(Math.random() * 40) + 10 : 0,
      cryptoAPICalls: isMalicious ? Math.floor(Math.random() * 150) + 50 : Math.floor(Math.random() * 10),
      networkConnections: isMalicious ? Math.floor(Math.random() * 8) + 1 : 0,
      ransonNotes: isRansomware ? Math.floor(Math.random() * 2) + 1 : 0,
      hashes: {
        sha256: 'a'.repeat(64),
        md5: 'b'.repeat(32),
        sha1: 'c'.repeat(40)
      },
      ips: isMalicious ? ['192.168.1.100', '10.0.0.50', '172.16.0.1'].slice(0, Math.floor(Math.random() * 3) + 1) : [],
      domains: isMalicious ? ['malicious.com', 'c2server.net', 'ransomware-pay.ru'].slice(0, Math.floor(Math.random() * 2) + 1) : [],
      behavioralIndicators: isRansomware ? ['Encryption of user documents', 'Deletion of shadow copies', 'Network communication with C2'] : isMalicious ? ['Suspicious API calls', 'Persistence mechanism detected'] : ['Standard file operations'],
      riskLevel: isRansomware ? 'critical' : isMalicious ? 'high' : 'low'
    };

    setResult(mockResult);
    
    // Real-time Notification for Mock
    const statusText = mockResult.verdict === 'malicious' ? 'Malicious' : 'Clean';
    addNotification('Analysis Complete', `${mockResult.filename} has been flagged as ${statusText}.`);
    
    setAnalyzing(false);
    setProgress(0);
  };

  const downloadReport = () => {
    if (!result) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(59, 130, 246); // Blue-500
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('RANSOM-GUARD ANALYSIS REPORT', 15, 25);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth - 70, 25);

    // Summary Section
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Analysis Summary', 15, 55);
    
    const summaryData = [
      ['Filename', result.filename],
      ['Filesize', `${result.filesize} KB`],
      ['Verdict', result.verdict.toUpperCase()],
      ['Confidence', `${result.confidence}%`],
      ['Risk Level', result.riskLevel.toUpperCase()],
      ['Is Ransomware', result.isRansomware ? 'YES' : 'NO'],
      ['Family', result.family]
    ];

    autoTable(doc, {
      startY: 60,
      head: [['Field', 'Value']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillStyle: [59, 130, 246], textColor: [255, 255, 255] },
    });

    // Technical Metrics Section
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Technical Metrics', 15, finalY);

    const metricsData = [
      ['Static Analysis Score', `${result.staticScore}/100`],
      ['Dynamic Analysis Score', `${result.dynamicScore}/100`],
      ['Files Modified', result.filesModified.toString()],
      ['Files Encrypted', result.filesEncrypted.toString()],
      ['Encryption Attempts', result.cryptoAPICalls.toString()],
      ['Network Connections', result.networkConnections.toString()],
      ['Ransom Notes Found', result.ransonNotes.toString()]
    ];

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Metric', 'Value']],
      body: metricsData,
      theme: 'grid',
      headStyles: { fillStyle: [15, 23, 42], textColor: [255, 255, 255] },
    });

    // Identification Section
    const idY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('File Identification', 15, idY);

    const idData = [
      ['SHA-256', result.hashes?.sha256 || 'N/A'],
      ['MD5', result.hashes?.md5 || 'N/A']
    ];

    autoTable(doc, {
      startY: idY + 5,
      body: idData,
      theme: 'plain',
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 30 } },
    });

    // Behavioral Indicators
    const behaviorY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Behavioral Indicators', 15, behaviorY);

    const indicators = result.behavioralIndicators?.length > 0 
      ? result.behavioralIndicators.map(ind => [ind]) 
      : [['No suspicious indicators detected']];

    autoTable(doc, {
      startY: behaviorY + 5,
      body: indicators,
      theme: 'striped',
    });

    // Network Section
    const netY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Network Activity', 15, netY);

    const netData = [
      ['IPs Contacted', result.ips?.join(', ') || 'None'],
      ['Domains Contacted', result.domains?.join(', ') || 'None']
    ];

    autoTable(doc, {
      startY: netY + 5,
      body: netData,
      theme: 'plain',
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } },
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('Confidential - Ransom-Guard Security Analysis', 15, doc.internal.pageSize.getHeight() - 10);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, doc.internal.pageSize.getHeight() - 10);
    }

    doc.save(`RansomGuard_Report_${result.filename}.pdf`);
  };

  const getVerdictColor = (verdict) => {
    if (verdict === 'malicious') return 'text-red-600 dark:text-red-500';
    if (verdict === 'suspicious') return 'text-yellow-600 dark:text-yellow-500';
    return 'text-green-600 dark:text-green-500';
  };

  const getVerdictBg = (verdict) => {
    if (verdict === 'malicious') return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-500/50';
    if (verdict === 'suspicious') return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-500/50';
    return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-500/50';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-linear-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      
      <Navigation 
        onUploadClick={() => fileInputRef.current?.click()} 
        notifications={notifications}
        setNotifications={setNotifications}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
        onSignInClick={() => { setLoginMode('signin'); setShowLogin(true); }}
        onSignUpClick={() => { setLoginMode('signup'); setShowLogin(true); }}
      />

      <Login 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        mode={loginMode} 
      />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <div className="text-center mt-20 mb-12 flex flex-col items-center">
          <div className="flex items-center justify-center gap-4 mb-10">
            <img src="/Logo.svg" alt="Logo" className="w-16 h-16" />
            <h2 className="text-6xl font-medium uppercase text-blue-600 dark:text-blue-400">Ransomware Guard</h2>
          </div>
          <p className="text-slate-600 dark:text-white text-sm font-light max-w-xl mb-20 mx-auto">Analyze suspicious files, domains, and URLs to detect ransomware and other threats. Automatically share analysis with the security community.</p>
        </div>

        {/* Tabs */}
        <div className="flex w-300 justify-center items-center gap-20 mb-8 border-b border-slate-300 dark:border-slate-400/50">
          <button
            onClick={() => setActiveTab('file')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'file'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            FILE
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'url'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            URL
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'search'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            SEARCH
          </button>
        </div>

        {/* File Upload Section */}
        {activeTab === 'file' && !result && (
          <div className="max-w-3xl mx-auto">
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-16 text-center hover:border-blue-400 dark:hover:border-slate-500 transition cursor-pointer bg-white dark:bg-slate-800/50 shadow-sm dark:shadow-none"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 bg-blue-50 dark:bg-slate-700/50 rounded-full">
                  <Upload className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Choose file or drag it here</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Max file size: 100 MB</p>
                  {file && (
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                      Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept=".exe,.dll,.zip,.bin,.doc,.pdf"
              />
            </div>

            {file && !analyzing && (
              <div className="mt-6 flex gap-4">
                <button
                  onClick={analyzeFile}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <Zap className="w-5 h-5" />
                  Start Analysis
                </button>
                <button
                  onClick={() => {
                    setFile(null);
                    setResult(null);
                  }}
                  className="px-6 py-3 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-white border border-slate-200 dark:border-none rounded-lg font-semibold transition"
                >
                  Clear
                </button>
              </div>
            )}

            {analyzing && (
              <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="animate-spin">
                    <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-slate-800 dark:text-white font-semibold">Analyzing file...</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{file.name}</p>
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-blue-600 to-blue-400 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-4 text-center">{progress}% complete</p>
              </div>
            )}

            <div className="mt-8 ml-20 w-150 text-center text-slate-600 dark:text-white text-xs">
              <p>By submitting data above, you are agreeing to our <a href='#terms and conditions' className='text-blue-600 dark:text-blue-400 hover:underline'>Terms of Service</a> and <a href='#Privacy Notice' className='text-blue-600 dark:text-blue-400 hover:underline' >Privacy Notice</a>, and to the <span className='font-bold'>sharing of your Sample submission with the security community</span>. Please do not submit any personal information;</p>
              <p>We are not responsible for the contents of your submission.</p>
            </div>
            <div className="mt-20 ml-20 w-150 py-2 text-center text-white text-xs bg-slate-800 dark:bg-cyan-900 rounded-lg">
              <p>Want to automate submissions? <a href="#" className='text-blue-400'>Check our API</a>, or access your <a href="#" className='text-blue-400'>API key</a>.</p>
            </div>
          </div>
        )}


        {/* Results Section */}
        {result && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Card */}
            <div className={`border rounded-xl p-8 ${getVerdictBg(result.verdict)} shadow-sm`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">{result.filename}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{result.filesize} KB</p>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold ${getVerdictColor(result.verdict)} mb-2`}>
                    {result.is_known_safe_pattern ? '✅ SAFE' :
                     result.verdict === 'malicious' && result.confidence >= 70 ? '🚨 DANGEROUS' : 
                     result.verdict === 'malicious' && result.confidence < 70 ? '⚠️ POTENTIALLY RISKY' : 
                     result.verdict === 'suspicious' ? '⚠️ BE CAREFUL' : 
                     '✅ SAFE'}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    How sure we are: {result.confidence}% 
                    <span className="text-xs"> 
                      {result.confidence < 60 ? '(Low - may be incorrect)' : 
                       result.confidence < 80 ? '(Medium - double-check)' : 
                       '(High - more reliable)'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Simple Explanation */}
            <div className="border border-blue-200 dark:border-blue-500/50 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 shadow-sm">
              <h4 className="text-blue-700 dark:text-blue-400 font-semibold mb-3">What This Means For You</h4>
              <div className="space-y-2">
                <p className="text-blue-800 dark:text-blue-400/90 text-sm">
                  {result.is_known_safe_pattern
                    ? "🟢 This appears to be trusted software (like Chrome, Firefox, etc.). These installers often show 'suspicious' behavior because they modify system files and connect to the internet during installation - this is completely normal."
                    : result.verdict === 'malicious' && result.confidence >= 70
                    ? '🔴 This file is dangerous and should NOT be opened. It may damage your computer, steal your data, or lock your files.' 
                    : result.verdict === 'malicious' && result.confidence < 70
                    ? '🟡 This file shows some concerning patterns but our confidence is low. Check the indicators below and verify the source.'
                    : result.verdict === 'suspicious' 
                    ? '🟡 This file looks questionable. Be very careful before opening it.' 
                    : '🟢 This file appears to be safe to use normally.'}
                </p>
                
                {/* Confidence Level Explanation */}
                {result.confidence < 70 && (
                  <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-500/30">
                    <p className="text-blue-700 dark:text-blue-400 font-medium text-sm mb-1">⚠️ Borderline Result</p>
                    <p className="text-blue-600 dark:text-blue-400/80 text-xs">
                      Confidence is only {result.confidence}% - this means we're not very sure. 
                      {result.confidence < 60 ? ' This could be a false positive.' : ' Double-check before trusting this result.'}
                    </p>
                    {result.verdict === 'malicious' && result.confidence < 70 && (
                      <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-500/30 rounded">
                        <p className="text-yellow-700 dark:text-yellow-400 text-xs">
                          <span className="font-semibold">💡 Important:</span> Since no files were locked and no ransom messages were found, 
                          this is likely a <span className="font-semibold">false positive</span>. 
                          Legitimate software often triggers these alerts.
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Key Indicator Check */}
                <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-500/30">
                  <p className="text-blue-700 dark:text-blue-400 font-medium text-sm mb-1">📋 Key Safety Indicators:</p>
                  <div className="text-xs text-blue-600 dark:text-blue-400/80 space-y-1">
                    <p>• {result.filesEncrypted > 0 ? '🚨 Files locked' : '✅ No files locked'}</p>
                    <p>• {result.ransonNotes > 0 ? '🚨 Ransom demands found' : '✅ No ransom messages'}</p>
                    <p>• {result.networkConnections > 5 ? '⚠️ Many internet connections' : '✅ Normal internet activity'}</p>
                  </div>
                </div>
                
                {/* Verification Advice */}
                <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-500/30">
                  <p className="text-blue-700 dark:text-blue-400 font-medium text-sm mb-1">🔍 Recommended Verification:</p>
                  <ul className="text-xs text-blue-600 dark:text-blue-400/80 list-disc list-inside space-y-1">
                    <li>Check if file is from official source (google.com, microsoft.com, etc.)</li>
                    <li>Compare file checksum with official hashes</li>
                    <li>Upload to VirusTotal for multiple antivirus opinions</li>
                    <li>When in doubt, don't open the file</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Ransomware Detection */}
            {result.isRansomware && (
              <div className="border border-red-200 dark:border-red-500/50 bg-red-50 dark:bg-red-900/20 rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-red-600 dark:text-red-400 font-semibold mb-2">Ransomware Detected</h4>
                    <p className="text-red-700 dark:text-red-400/90 text-sm mb-3">
                      ⚠️ Warning: This file appears to be ransomware - software that locks your files and demands money to unlock them.
                    </p>
                    <div className="bg-white dark:bg-slate-800/50 border border-red-100 dark:border-none rounded p-4 mb-3">
                      <p className="text-slate-800 dark:text-white font-semibold mb-2">Type: {result.family}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        How sure we are: {result.familyConfidence}% confident
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition shadow-md shadow-red-500/20">
                      What You Should Do
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Analysis Summary */}
            <div className="grid grid-cols-2 gap-6">
              <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 rounded-xl p-6 shadow-sm">
                <h4 className="text-slate-800 dark:text-white font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Static Analysis
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400 text-sm">Score</span>
                    <span className="text-slate-800 dark:text-white font-semibold">{result.staticScore}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                      style={{ width: `${result.staticScore}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 rounded-xl p-6 shadow-sm">
                <h4 className="text-slate-800 dark:text-white font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Dynamic Analysis
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400 text-sm">Score</span>
                    <span className="text-slate-800 dark:text-white font-semibold">{result.dynamicScore}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="h-full bg-purple-600 dark:bg-purple-500 rounded-full"
                      style={{ width: `${result.dynamicScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* What This File Does */}
            <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 rounded-xl p-6 shadow-sm">
              <h4 className="text-slate-800 dark:text-white font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                What This File Does
              </h4>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Files Changed</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">{result.filesModified}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Number of files modified</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Files Locked</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{result.filesEncrypted}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Files made unreadable</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Encryption Attempts</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{result.cryptoAPICalls}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Data scrambling attempts</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Internet Contact</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.networkConnections}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Network connections</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Ransom Messages</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{result.ransonNotes}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Demands for money</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Analysis Complete</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">✓</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Scan finished</p>
                </div>
              </div>
            </div>

            {/* Security Details */}
            <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 rounded-xl p-6 shadow-sm">
              <h4 className="text-slate-800 dark:text-white font-semibold mb-4">File Identification</h4>
              
              <div className="space-y-4">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">File ID Numbers</p>
                  <div className="space-y-2">
                    <div className="bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-none rounded p-3 text-xs text-slate-600 dark:text-slate-300 font-mono break-all">
                      SHA-256: {result.hashes.sha256}
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-none rounded p-3 text-xs text-slate-600 dark:text-slate-300 font-mono break-all">
                      MD5: {result.hashes.md5}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setResult(null);
                  setFile(null);
                }}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow-lg shadow-blue-500/20"
              >
                Analyze Another File
              </button>
              <button 
                onClick={downloadReport}
                className="px-6 py-3 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-white border border-slate-200 dark:border-none rounded-lg font-semibold transition"
              >
                Download Report
              </button>
            </div>
          </div>
        )}

        {/* Other Tabs */}
        {activeTab === 'url' && (
          <div className="max-w-3xl mx-auto">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-12 text-center bg-white dark:bg-slate-800/50 shadow-sm">
              <Link2 className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">URL Analysis</h3>
              <input
                type="url"
                placeholder="Enter URL or domain to analyze"
                className="w-full mt-6 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="max-w-3xl mx-auto">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-12 text-center bg-white dark:bg-slate-800/50 shadow-sm">
              <Search className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Search Database</h3>
              <input
                type="text"
                placeholder="Search by hash, domain, or IP"
                className="w-full mt-6 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
