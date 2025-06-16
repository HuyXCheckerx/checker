
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { UploadCloud, ScanSearch, Wallet, ShieldCheck, AlertTriangle, TrendingUp, ListChecks, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import CheckerGraph from '@/components/CheckerGraph';

const StatCard = ({ title, value, icon: Icon, color = "text-primary" }) => (
  <div className="glassmorphism-light rounded-lg p-3 text-center">
    <Icon className={`w-6 h-6 mx-auto mb-1.5 ${color}`} />
    <p className="text-xs text-muted-foreground">{title}</p>
    <p className={`text-xl font-bold ${color}`}>{value}</p>
  </div>
);

const SeedPhraseScannerPage = () => {
  const [combolist, setCombolist] = useState([]);
  const [initialCombolistSize, setInitialCombolistSize] = useState(0);
  const [fileName, setFileName] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState('');
  const [activeModules, setActiveModules] = useState({
    bip39_12: true,
    bip39_24: true,
    private_keys: false,
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

  const generateRandomWords = (count) => {
    const sampleWords = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon', 'mango', 'nectarine', 'orange', 'papaya', 'quince', 'raspberry', 'strawberry', 'tangerine', 'ugli', 'vanilla', 'watermelon', 'xigua', 'yam', 'zucchini'];
    let words = '';
    for (let i = 0; i < count; i++) {
        words += sampleWords[Math.floor(Math.random() * sampleWords.length)] + ' ';
    }
    return words.trim();
  }

  const handleScan = () => {
    if (combolist.length === 0) {
      toast({ title: "No Combolist", description: "Please load a combolist of hits first.", variant: "destructive" });
      return;
    }
    
    setIsScanning(true);
    setResults('');
    setScanProgressHistory([0]);
    setTotalFound(0);
    setCpm(0);
    toast({ title: "Scan Initiated", description: `Scanning ${combolist.length} accounts for phrases...` });

    let localCombolist = [...combolist];
    let currentFound = 0;
    let itemsProcessedInTick = 0;
    
    scanIntervalRef.current = setInterval(() => {
        itemsProcessedInTick = 0;
        const batchSize = Math.floor(Math.random() * 10) + 3; 

        for(let i = 0; i < batchSize; i++) {
            if (localCombolist.length === 0) break;

            const account = localCombolist.shift();
            itemsProcessedInTick++;

            const shouldFind = Math.random() > 0.85;
            if (shouldFind) {
                const wordCount = activeModules.bip39_24 && Math.random() > 0.5 ? 24 : 12;
                if ((wordCount === 12 && activeModules.bip39_12) || (wordCount === 24 && activeModules.bip39_24)) {
                    currentFound++;
                    setTotalFound(prev => prev + 1);
                    const phrase = generateRandomWords(wordCount);
                    const censoredAccount = account.split(':')[0].replace(/^(...)(.*)(@.*)$/, '$1***$3');
                    const newResult = `${censoredAccount} || Found ${wordCount}-word phrase: ${phrase.substring(0, 15)}...\n`;
                    setResults(prev => prev + newResult);
                }
            }
        }
        setCombolist([...localCombolist]);
        setScanProgressHistory(prev => [...prev, currentFound]);
        setCpm(Math.floor(Math.random() * 500) + 800); 

        if (localCombolist.length === 0) {
            clearInterval(scanIntervalRef.current);
            setIsScanning(false);
            setCpm(0);
            toast({ title: "Scan Complete", description: "All accounts have been processed." });
            return;
        }
    }, 600);
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
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">Seed Phrase Scanner</h1>
        <p className="text-muted-foreground">Scan hit combolists for cryptocurrency seed phrases.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="glassmorphism-deep rounded-xl p-4 sm:p-6 space-y-3 shadow-xl">
         <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive-foreground/80 text-sm flex items-start">
            <AlertTriangle className="w-10 h-10 sm:w-8 sm:h-8 mr-3 mt-0.5 text-destructive flex-shrink-0" />
            <div>
            <strong className="font-semibold text-destructive-foreground">Warning:</strong>Experimental mode, do not run with too much bots to avoid flagging IP
            </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <motion.div variants={itemVariants} className="h-[300px] md:h-[350px]">
                <CheckerGraph hitsHistory={scanProgressHistory} isRunning={isScanning} />
            </motion.div>
             <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Total Accounts" value={initialCombolistSize} icon={ListChecks} />
                <StatCard title="Accounts Processed" value={accountsProcessed} icon={TrendingUp} />
                <StatCard title="Phrases Found" value={totalFound} icon={Wallet} color="text-green-400"/>
                <StatCard title="Est. CPM" value={estCpmDisplayValue} icon={Clock} color="text-accent"/>
            </motion.div>
            <div className="glassmorphism-deep rounded-xl p-6 flex flex-col shadow-xl min-h-[250px] lg:min-h-[300px]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-primary">Scan Results</h3>
                </div>
                <Textarea 
                readOnly 
                value={isScanning && !results ? "Scanning..." : (results || "Results will appear here...")} 
                className="flex-grow bg-input/50 border-border/50 text-muted-foreground text-sm custom-scrollbar resize-none min-h-[150px]"
                placeholder="Found phrases will appear here..."
                />
            </div>
        </div>

        <div className="space-y-8">
          <div className="glassmorphism-deep rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-xl font-semibold text-secondary">Configuration & Status</h3>
             <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Active Modules</label>
              <div className="flex flex-col gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => toggleModule('bip39_12')}
                  className={cn('transition-all justify-start p-3 text-base', activeModules.bip39_12 && 'bg-secondary/20 border-secondary text-secondary shadow-glow-secondary-sm')}
                >
                  <ShieldCheck className="w-4 h-4 mr-2"/> Scan for 12 Words
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleModule('bip39_24')}
                  className={cn('transition-all justify-start p-3 text-base', activeModules.bip39_24 && 'bg-secondary/20 border-secondary text-secondary shadow-glow-secondary-sm')}
                >
                  <ShieldCheck className="w-4 h-4 mr-2"/> Scan for 24 Words
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleModule('private_keys')}
                  className={cn('transition-all justify-start p-3 text-base', activeModules.private_keys && 'bg-secondary/20 border-secondary text-secondary shadow-glow-secondary-sm')}
                >
                  <Wallet className="w-4 h-4 mr-2"/> Scan Private Keys
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                    <p className="text-3xl font-bold tracking-tighter text-glow-secondary">{combolist.length}</p>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                </div>
                <div>
                    <p className="text-3xl font-bold tracking-tighter text-glow-primary">{totalFound}</p>
                    <p className="text-xs text-muted-foreground">Found</p>
                </div>
            </div>
            <p className="text-sm text-muted-foreground truncate pt-2">{fileName || 'No file loaded'}</p>
            <Button onClick={() => fileInputRef.current.click()} variant="outline" className="w-full text-base py-5">
                <UploadCloud className="w-5 h-5 mr-2.5" /> Import Hits Combolist
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".txt" />
            <Button onClick={handleScan} size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-glow-secondary-md text-lg py-6" disabled={isScanning}>
              <ScanSearch className="w-6 h-6 mr-3" /> {isScanning ? 'Scanning...' : `Scan ${combolist.length > 0 ? combolist.length : ''} Accounts`}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SeedPhraseScannerPage;
