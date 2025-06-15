import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import CheckerGraph from '@/components/CheckerGraph';
import ProxyGraph from '@/components/ProxyGraph';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, Play, Pause, RotateCcw, FileText, ListChecks, AlertTriangle, Lock, Trash2, ShieldQuestion, Server, Activity } from 'lucide-react';

const censorCredential = (cred) => {
    const parts = cred.split(/[:;|,]/);
    if (parts.length > 1) {
        const username = parts[0];
        const password = parts[1];
        const censoredPassword = password.length > 2 ? password.substring(0, 2) + '*'.repeat(password.length - 2) : '**';
        return `${username}:${censoredPassword}`;
    }
    return cred.length > 3 ? cred.substring(0, 3) + '*'.repeat(cred.length - 3) : '***';
};

const CheckerInterface = ({ checkerType, additionalFeatures = [], asciiArt }) => {
  const [comboList, setComboList] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hitsList, setHitsList] = useState([]);
  const [hitsHistory, setHitsHistory] = useState([0]);
  const [proxyData, setProxyData] = useState([]);
  const [stats, setStats] = useState({ 
    hits: 0, 
    fails: 0, 
    customs: 0, 
    cpm: 0, 
    total: 0, 
    checked: 0,
    trash: 0,
    locked: 0,
    twoFA: 0,
  });
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const lines = e.target.result.split('\n').filter(line => line.trim() !== '');
        setComboList(lines);
        setStats(prev => ({ ...prev, total: lines.length, checked: 0, hits: 0, fails: 0, customs: 0, cpm: 0, trash: 0, locked: 0, twoFA: 0 }));
        setHitsList([]);
        setHitsHistory([0]);
        setProgress(0);
        toast({ title: "Combolist Loaded", description: `${lines.length} accounts ready to check.` });
      };
      reader.readAsText(file);
    } else {
      toast({ title: "Invalid File", description: "Please upload a .txt file.", variant: "destructive" });
    }
    event.target.value = null; 
  };

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
      toast({ title: `${checkerType} Paused`, description: "Checker process has been paused." });
    } else {
      if (stats.total === 0) {
        toast({ title: "No Combolist", description: "Please load a combolist first.", variant: "destructive" });
        return;
      }
      setIsRunning(true);
      toast({ title: `${checkerType} Started`, description: "Checker process initiated." });
    }
  };

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setComboList([]);
    setProgress(0);
    setHitsList([]);
    setHitsHistory([0]);
    setStats({ hits: 0, fails: 0, customs: 0, cpm: 0, total: 0, checked: 0, trash: 0, locked: 0, twoFA: 0 });
    toast({ title: "Checker Reset", description: "All data has been cleared." });
  }, []);
  
  useEffect(() => {
    let interval;
    if (isRunning && stats.checked < stats.total) {
      interval = setInterval(() => {
        setStats(prev => {
          const batchSize = Math.floor(Math.random() * 20) + 10;
          const newChecked = Math.min(prev.total, prev.checked + batchSize);
          
          let newHits = prev.hits;
          let newFails = prev.fails;
          let newCustoms = prev.customs;
          let newTrash = prev.trash;
          let newLocked = prev.locked;
          let newTwoFA = prev.twoFA;
          let newHitsForBatch = [];

          for (let i = prev.checked; i < newChecked; i++) {
            const rand = Math.random();
            if (rand < 0.05) {
              newHits++;
              newHitsForBatch.push(comboList[i]);
            }
            else if (rand < 0.1) newCustoms++;
            else if (rand < 0.13) newTrash++;
            else if (rand < 0.16) newLocked++;
            else if (rand < 0.19) newTwoFA++;
            else newFails++;
          }
          
          if (newHitsForBatch.length > 0) {
            setHitsList(currentHits => [...currentHits, ...newHitsForBatch]);
          }

          setHitsHistory(currentHistory => [...currentHistory.slice(-50), newHits]);
          setProxyData(currentProxyData => [...currentProxyData.slice(-50), { usage: Math.random() * 100, speed: Math.random() * 500 + 50 }]);


          const newCpm = Math.floor(Math.random() * 1500) + 5000; 

          const currentProgress = Math.min(100, (newChecked / prev.total) * 100);
          setProgress(currentProgress);
          
          if (newChecked >= prev.total) {
            setIsRunning(false);
            toast({ title: `${checkerType} Complete`, description: "All accounts have been checked." });
            return { ...prev, checked: prev.total, cpm: 0, hits: newHits, fails: newFails, customs: newCustoms, trash: newTrash, locked: newLocked, twoFA: newTwoFA };
          }
          return { ...prev, checked: newChecked, hits: newHits, fails: newFails, customs: newCustoms, trash: newTrash, locked: newLocked, twoFA: newTwoFA, cpm: newCpm };
        });
      }, 300); 
    } else if (stats.checked >= stats.total && stats.total > 0) {
        setIsRunning(false);
        setStats(prev => ({...prev, cpm: 0}));
    }
    return () => clearInterval(interval);
  }, [isRunning, stats.checked, stats.total, checkerType, comboList]);


  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };
  const checkedPercent = stats.total > 0 ? ((stats.checked / stats.total) * 100).toFixed(2) : "0.00";

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="text-center">
        {asciiArt && ( <pre className="text-xs sm:text-sm md:text-base font-mono text-primary whitespace-pre-wrap leading-tight mb-4 animate-pulse-subtle"> {asciiArt} </pre> )}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary mb-1">{checkerType}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Upload your combolist and initiate the check sequence.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="glassmorphism-deep rounded-xl p-4 sm:p-6 shadow-xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 text-xs sm:text-sm text-center mb-4">
          <p><span className="font-bold text-foreground">{stats.checked}</span>/<span className="text-muted-foreground">{stats.total}</span> ({checkedPercent}%)</p>
          <p>Hits: <span className="font-bold text-primary">{stats.hits}</span></p>
          <p>Custom: <span className="font-bold text-secondary">{stats.customs}</span></p>
          <p>Trash: <span className="font-bold text-yellow-500">{stats.trash}</span></p>
          <p>Locked: <span className="font-bold text-orange-500">{stats.locked}</span></p>
          <p>2FA: <span className="font-bold text-purple-500">{stats.twoFA}</span></p>
          <p>Fails: <span className="font-bold text-destructive">{stats.fails}</span></p>
        </div>
        <div className="flex justify-end items-center text-xs sm:text-sm"> <p>CPM: <span className="font-bold text-accent text-lg sm:text-xl">{stats.cpm}</span></p> </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Button onClick={() => fileInputRef.current?.click()} size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-primary-md text-sm sm:text-base py-3 sm:py-4"> <UploadCloud className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Import .txt Combolist </Button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt" className="hidden" />
          <div className="flex space-x-2 sm:space-x-3">
            <Button onClick={handleStartStop} size="lg" className={`w-full text-sm sm:text-base py-3 sm:py-4 ${isRunning ? 'bg-amber-500 hover:bg-amber-600 text-black' : 'bg-green-600 hover:bg-green-700 text-white'}`}> {isRunning ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />} {isRunning ? 'Pause' : 'Start'} </Button>
            <Button onClick={handleReset} size="lg" variant="destructive" className="w-full text-sm sm:text-base py-3 sm:py-4"> <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Reset </Button>
          </div>
          {additionalFeatures.length > 0 && (
            <div className="glassmorphism-deep rounded-xl p-3 sm:p-4 space-y-2">
              <h3 className="text-base sm:text-lg font-semibold text-secondary">Module Options</h3>
              {additionalFeatures.map(feature => ( <Button key={feature.label} variant="outline" className="w-full justify-start text-xs sm:text-sm border-secondary/30 hover:bg-secondary/10 hover:text-secondary py-2" onClick={() => toast({title: `${feature.label} Enabled`, description: `The ${feature.label} module is now active.`, duration: 3000})}> <feature.icon className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-secondary" /> {feature.label} </Button> ))}
            </div>
          )}
          <div className="glassmorphism-deep rounded-xl p-3 sm:p-4 space-y-1.5">
            <div className="flex justify-between text-xs sm:text-sm"> <span className="text-muted-foreground">Status:</span> <span className={`font-semibold ${isRunning ? 'text-green-400 animate-pulse-subtle' : 'text-amber-400'}`}> {isRunning ? 'Running...' : (stats.checked >= stats.total && stats.total > 0 ? 'Completed' : 'Idle')} </span> </div>
            <div className="flex justify-between text-xs sm:text-sm"> <span className="text-muted-foreground">Progress:</span> <span className="font-semibold text-primary">{progress.toFixed(1)}%</span> </div>
            <Progress value={progress} className="w-full h-2.5 sm:h-3 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent" />
            <div className="flex justify-between text-xs sm:text-sm pt-1"> <span className="text-muted-foreground">Checked:</span> <span className="font-semibold text-foreground">{stats.checked} / {stats.total}</span> </div>
          </div>
        </div>
        <div className="lg:col-span-2">
            <Tabs defaultValue="hits" className="w-full h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="hits"><Activity className="w-4 h-4 mr-2"/> Hits Graph</TabsTrigger>
                <TabsTrigger value="proxy"><Server className="w-4 h-4 mr-2"/> Proxy Graph</TabsTrigger>
              </TabsList>
              <TabsContent value="hits" className="flex-grow">
                  <CheckerGraph hitsHistory={hitsHistory} isRunning={isRunning} />
              </TabsContent>
              <TabsContent value="proxy" className="flex-grow">
                  <ProxyGraph proxyData={proxyData} isRunning={isRunning} />
              </TabsContent>
            </Tabs>
        </div>
      </motion.div>
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <ResultBox title="Hits" icon={ListChecks} data={hitsList.map(censorCredential)} count={stats.hits} color="primary" />
        <ResultBox title="Custom Captures" icon={FileText} data={[]} count={stats.customs} color="secondary" />
        <ResultBox title="Fails / Errors" icon={AlertTriangle} data={[]} count={stats.fails} color="destructive" />
      </motion.div>
    </motion.div>
  );
};

const ResultBox = ({ title, icon: Icon, data, count, color }) => (
  <div className="glassmorphism-deep rounded-xl p-3 sm:p-4 flex flex-col h-[250px] sm:h-[300px] shadow-lg">
    <div className="flex justify-between items-center mb-2 sm:mb-3">
      <h3 className={`text-base sm:text-lg font-semibold text-${color} flex items-center`}> <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> {title} </h3>
      <span className={`text-xs sm:text-sm font-bold px-1.5 sm:px-2 py-0.5 rounded-md bg-${color}/20 text-${color}`}>{count}</span>
    </div>
    <Textarea readOnly value={data.length > 0 ? data.join('\n') : `No ${title.toLowerCase()} yet...`} className="flex-grow bg-input/50 border-border/50 text-muted-foreground text-xs custom-scrollbar resize-none" placeholder={`Checked ${title.toLowerCase()} will appear here...`} />
  </div>
);

export default CheckerInterface;