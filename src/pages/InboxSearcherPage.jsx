
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { UploadCloud, Search, Mail, FileText, Filter, TrendingUp, ListChecks, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import CheckerGraph from '@/components/CheckerGraph';

const StatCard = ({ title, value, icon: Icon, color = "text-primary" }) => (
  <div className="glassmorphism-light rounded-lg p-3 text-center">
    <Icon className={`w-6 h-6 mx-auto mb-1.5 ${color}`} />
    <p className="text-xs text-muted-foreground">{title}</p>
    <p className={`text-xl font-bold ${color}`}>{value}</p>
  </div>
);

const InboxSearcherPage = () => {
  const [combolist, setCombolist] = useState([]);
  const [initialCombolistSize, setInitialCombolistSize] = useState(0);
  const [fileName, setFileName] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState('');
  const [searchTerm, setSearchTerm] = useState('minecraft@mojang.com');
  const [activeModules, setActiveModules] = useState({
    subject: true,
    body: true,
    attachments: false,
  });
  const [scanProgressHistory, setScanProgressHistory] = useState([]);
  const [totalFound, setTotalFound] = useState(0);
  const [cpm, setCpm] = useState(0);

  const fileInputRef = useRef(null);
  const scanIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const lines = content.split('\n').filter(line => line.trim() !== '');
        setCombolist(lines);
        setInitialCombolistSize(lines.length);
        setFileName(file.name);
        setScanProgressHistory([]);
        setTotalFound(0);
        setCpm(0);
        toast({ title: "File Loaded", description: `${lines.length} accounts loaded from ${file.name}.` });
      };
      reader.readAsText(file);
      event.target.value = null; 
    } else {
      toast({ title: "Invalid File", description: "Please upload a .txt file.", variant: "destructive" });
    }
  };

  const handleScan = () => {
    if (combolist.length === 0) {
      toast({ title: "No Combolist", description: "Please load a combolist first.", variant: "destructive" });
      return;
    }
    if (!searchTerm.trim()) {
      toast({ title: "No Search Term", description: "Please enter a search term.", variant: "destructive" });
      return;
    }

    setIsScanning(true);
    setResults('');
    setScanProgressHistory([0]);
    setTotalFound(0);
    setCpm(0);
    toast({ title: "Scan Initiated", description: `Scanning ${combolist.length} accounts...` });

    let localCombolist = [...combolist];
    let currentFound = 0;
    let itemsProcessedInTick = 0;
    
    scanIntervalRef.current = setInterval(() => {
      itemsProcessedInTick = 0;
      const batchSize = Math.floor(Math.random() * 10) + 5; 

      for(let i = 0; i < batchSize; i++) {
        if (localCombolist.length === 0) break;
        
        const account = localCombolist.shift();
        itemsProcessedInTick++;
        
        const shouldFind = Math.random() > 0.7;
        if (shouldFind) {
          const amount = Math.floor(Math.random() * 5) + 1;
          currentFound += amount;
          setTotalFound(prev => prev + amount);
          const censoredAccount = account.split(':')[0].replace(/^(...)(.*)(@.*)$/, '$1***$3');
          const newResult = `${censoredAccount} || inboxed: ${amount}\n`;
          setResults(prev => prev + newResult);
        }
      }
      
      setCombolist([...localCombolist]); 
      setScanProgressHistory(prev => [...prev, currentFound]);
      setCpm(Math.floor(Math.random() * 700) + 1200); 

      if (localCombolist.length === 0) {
        clearInterval(scanIntervalRef.current);
        setIsScanning(false);
        setCpm(0);
        toast({ title: "Scan Complete", description: "All accounts have been processed." });
        return;
      }
    }, 500);
  };

  const toggleModule = (module) => {
    setActiveModules(prev => ({ ...prev, [module]: !prev[module] }));
  };

  const accountsProcessed = initialCombolistSize - combolist.length;
  const estCpmDisplayValue = isScanning ? cpm : '0';
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">Inbox Searcher</h1>
        <p className="text-muted-foreground">Scan hit combolists for specific keywords in emails.</p>
      </motion.div>
      
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glassmorphism-deep rounded-xl p-6 space-y-6 shadow-xl">
            <h3 className="text-xl font-semibold text-primary">Configuration</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="Keywords, e.g., 'minecraft@mojang.com'"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow bg-input/70 border-border/70 text-lg py-6"
              />
              <Button onClick={() => fileInputRef.current.click()} size="lg" variant="outline" className="text-base py-6 px-8">
                <UploadCloud className="w-5 h-5 mr-2.5" /> Import Combolist
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".txt" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Active Modules</label>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => toggleModule('subject')}
                  className={cn('transition-all', activeModules.subject && 'bg-primary/20 border-primary text-primary shadow-glow-primary-sm')}
                >
                  <FileText className="w-4 h-4 mr-2"/> Subject
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleModule('body')}
                  className={cn('transition-all', activeModules.body && 'bg-primary/20 border-primary text-primary shadow-glow-primary-sm')}
                >
                  <Mail className="w-4 h-4 mr-2"/> Body
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleModule('attachments')}
                  className={cn('transition-all', activeModules.attachments && 'bg-primary/20 border-primary text-primary shadow-glow-primary-sm')}
                >
                  <Filter className="w-4 h-4 mr-2"/> Attachments
                </Button>
              </div>
            </div>
          </div>

          <motion.div variants={itemVariants} className="h-[300px] md:h-[350px]">
             <CheckerGraph hitsHistory={scanProgressHistory} isRunning={isScanning} />
          </motion.div>
          
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Total Accounts" value={initialCombolistSize} icon={ListChecks} />
            <StatCard title="Accounts Processed" value={accountsProcessed} icon={TrendingUp} />
            <StatCard title="Keywords Found" value={totalFound} icon={Search} color="text-green-400"/>
            <StatCard title="Est. CPM" value={estCpmDisplayValue} icon={Clock} color="text-accent"/>
          </motion.div>

        </div>
        
        <div className="space-y-8">
          <div className="glassmorphism-deep rounded-xl p-6 shadow-xl text-center space-y-4">
            <h3 className="text-xl font-semibold text-secondary">Status</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-4xl font-bold tracking-tighter text-glow-secondary">{combolist.length}</p>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                </div>
                <div>
                    <p className="text-4xl font-bold tracking-tighter text-glow-primary">{totalFound}</p>
                    <p className="text-xs text-muted-foreground">Found</p>
                </div>
            </div>
            <p className="text-sm text-muted-foreground truncate pt-2">{fileName || 'No file loaded'}</p>
            <Button onClick={handleScan} size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-glow-secondary-md text-lg py-6" disabled={isScanning}>
              <Search className="w-6 h-6 mr-3" /> {isScanning ? 'Scanning...' : 'Start Scan'}
            </Button>
          </div>
          <div className="glassmorphism-deep rounded-xl p-6 flex flex-col shadow-xl min-h-[250px] lg:min-h-[300px]">
            <h3 className="text-xl font-semibold text-primary mb-4">Scan Results</h3>
            <Textarea 
              readOnly 
              value={isScanning && !results ? "Scanning..." : (results || "Results will appear here...")} 
              className="flex-grow bg-input/50 border-border/50 text-muted-foreground text-sm custom-scrollbar resize-none min-h-[150px]"
              placeholder="Scan results..."
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InboxSearcherPage;
