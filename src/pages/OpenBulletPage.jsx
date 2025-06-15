
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Settings2, UploadCloud, ListFilter, Database, Users, BarChartHorizontalBig, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const StatBox = ({ title, value, color = "text-primary" }) => (
  <div className="p-2">
    <p className="text-xs text-muted-foreground">{title}</p>
    <p className={`text-lg font-bold ${color}`}>{value}</p>
  </div>
);

const OpenBulletPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [bots, setBots] = useState(200);
  const [progressVal, setProgressVal] = useState(0);
  const [log, setLog] = useState("Runner initialized successfully!\nWaiting for CFG and List selection...\n");
  const [comboData, setComboData] = useState([]);
  const [processedComboList, setProcessedComboList] = useState([]); 
  const [currentComboIndex, setCurrentComboIndex] = useState(0);
  const [captureData, setCaptureData] = useState([]);
  const [stats, setStats] = useState({
    totalData: 0,
    hits: 0,
    custom: 0,
    bad: 0,
    retries: 0,
    toCheck: 0,
    totalProxies: 0,
    aliveProxies: 0,
    bannedProxies: 0,
    badProxies: 0,
    cpm: 0,
    credit: "$0",
  });
  const [selectedConfig, setSelectedConfig] = useState("Select CFG");
  const [selectedList, setSelectedList] = useState("Select List");
  const [proxyType, setProxyType] = useState("DEF");

  const logEndRef = useRef(null);
  const intervalRef = useRef(null);
  const cfgFileInputRef = useRef(null);
  const listFileInputRef = useRef(null);

  const dummyConfigs = ["GenericSite.loli", "Netflix.loli", "Spotify.loli", "CustomConfig.anom"];
  const [availableConfigs, setAvailableConfigs] = useState(dummyConfigs);
  const [availableLists, setAvailableLists] = useState([]);


  const generateRandomString = (length) => Math.random().toString(36).substring(2, length + 2);
  const generateRandomIp = () => Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');
  const generateRandomPort = () => Math.floor(Math.random() * 64511) + 1024;

  const redactString = (str, keepStart = 1, keepEnd = 1, placeholder = '*') => {
    if (!str || str.length <= keepStart + keepEnd) return str || '';
    const start = str.substring(0, keepStart);
    const end = str.substring(str.length - keepEnd);
    const middle = placeholder.repeat(Math.max(1, str.length - keepStart - keepEnd));
    return `${start}${middle}${end}`;
  };

  const redactEmail = (email) => {
    if (!email) return "******@*****.***";
    const parts = email.split('@');
    if (parts.length !== 2) return redactString(email, 2, 1);
    const user = redactString(parts[0], Math.min(2, Math.floor(parts[0].length * 0.3)), Math.min(1, Math.floor(parts[0].length * 0.2)));
    const domainParts = parts[1].split('.');
    const domainName = redactString(domainParts[0], Math.min(1, Math.floor(domainParts[0].length * 0.3)), Math.min(1, Math.floor(domainParts[0].length * 0.2)));
    const tld = domainParts.length > 1 ? `.${domainParts.slice(1).join('.')}` : '';
    return `${user}@${domainName}${tld}`;
  };
  
  const redactPassword = (password) => {
    if (!password) return "********";
    return redactString(password, Math.min(1, Math.floor(password.length * 0.1)), Math.min(1, Math.floor(password.length * 0.1)));
  };

  const redactIpPort = (ipPort) => {
    if (!ipPort) return "***.***.***.***:****";
    const parts = ipPort.split(':');
    if (parts.length !== 2) return redactString(ipPort, 3, 3);
    const ip = parts[0];
    const port = parts[1];
    const ipParts = ip.split('.');
    if (ipParts.length !== 4) return `${redactString(ip, 1, 1)}:${redactString(port, 1, 1)}`;
    const redactedIp = `${ipParts[0]}.${redactString(ipParts[1], 0, 0, '***')}.${redactString(ipParts[2], 0, 0, '***')}.${ipParts[3]}`;
    return `${redactedIp}:${redactString(port, 1, 1)}`;
  };


  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  useEffect(() => {
    if (isRunning && currentComboIndex < processedComboList.length) {
      intervalRef.current = setInterval(() => {
        const newLogEntryTime = new Date().toLocaleTimeString();
        let newLogEntry = "";
        let newComboEntries = [];
        let newCaptureEntries = [];

        const itemsToProcessCount = Math.min(bots, processedComboList.length - currentComboIndex, Math.floor(Math.random() * bots / 10) + 5);
        
        for (let i = 0; i < itemsToProcessCount; i++) {
            const comboIndex = currentComboIndex + i;
            if (comboIndex >= processedComboList.length) break;

            const { originalData, redactedData, originalProxy, redactedProxy } = processedComboList[comboIndex];
            
            const statusRand = Math.random();
            let status = "<<< ERR";
            let capture = null;

            if (statusRand < 0.1) { 
                status = "<<< HIT";
                setStats(s => ({ ...s, hits: s.hits + 1 }));
                capture = { type: "FREE", points: Math.floor(Math.random() * 100), value: (Math.random() * 10).toFixed(2), by: `INFINITEY#${Math.floor(Math.random()*9000)+1000}` };
                newCaptureEntries.push(capture);
            } else if (statusRand < 0.2) { 
                status = "<<< CUSTOM";
                setStats(s => ({ ...s, custom: s.custom + 1 }));
            } else if (statusRand < 0.3) { 
                status = "<<< RETRY";
                setStats(s => ({ ...s, retries: s.retries + 1 }));
            } else { 
                setStats(s => ({ ...s, bad: s.bad + 1 }));
            }
            newComboEntries.push({ 
              id: comboIndex + 1, 
              data: redactedData, 
              proxy: redactedProxy, 
              status 
            });
        }
        
        setComboData(prev => [...newComboEntries, ...prev].slice(0, 100)); 
        if(newCaptureEntries.length > 0) setCaptureData(prev => [...newCaptureEntries, ...prev].slice(0,20));
        
        setCurrentComboIndex(prevIdx => prevIdx + itemsToProcessCount);

        setStats(s => {
            const newCheckedCount = s.totalData - (processedComboList.length - (currentComboIndex + itemsToProcessCount));
            const newProg = s.totalData > 0 ? (newCheckedCount / s.totalData) * 100 : 0;
            setProgressVal(newProg);
            newLogEntry = `[${newLogEntryTime}] Processed ${itemsToProcessCount} items. Current: ${currentComboIndex + itemsToProcessCount}/${processedComboList.length}. Config: ${selectedConfig}\n`;
            
            if (currentComboIndex + itemsToProcessCount >= processedComboList.length) {
                setIsRunning(false);
                newLogEntry += `[${newLogEntryTime}] Runner finished processing ${selectedList}.\n`;
                toast({title: "Runner Finished", description: `All ${processedComboList.length} items from ${selectedList} processed.`});
            }
            return {
                ...s,
                toCheck: processedComboList.length - (currentComboIndex + itemsToProcessCount),
                cpm: isRunning && (currentComboIndex + itemsToProcessCount < processedComboList.length) ? Math.floor(Math.random() * bots * 3) + (bots * 10) : 0,
                aliveProxies: Math.floor(s.totalProxies * (Math.random() * 0.3 + 0.6)), 
                badProxies: Math.floor(s.totalProxies * (Math.random() * 0.2 + 0.1)),
            };
        });
        setLog(prev => prev + newLogEntry);

      }, 300); 
    } else if (isRunning && currentComboIndex >= processedComboList.length && processedComboList.length > 0) {
        setIsRunning(false); 
        setLog(prev => prev + `[${new Date().toLocaleTimeString()}] All items processed. Runner stopped.\n`);
        setStats(s => ({...s, cpm: 0}));
    } else {
      clearInterval(intervalRef.current);
      if (isRunning) setStats(s => ({...s, cpm: 0})); 
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, currentComboIndex, processedComboList, bots, selectedConfig, selectedList]);


  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
      setLog(prev => prev + `[${new Date().toLocaleTimeString()}] Aborted Runner.\n`);
      toast({title: "Runner Paused"});
    } else {
      if (selectedConfig === "Select CFG" || selectedList === "Select List" || processedComboList.length === 0) {
        toast({title: "Error", description: "Please select a CFG and upload/select a valid Wordlist.", variant: "destructive"});
        return;
      }
      
      const totalProxies = Math.floor(Math.random() * 5000) + 1000;
      setCurrentComboIndex(0);
      setComboData([]); 
      setCaptureData([]);
      
      setStats(s => ({
        ...s,
        totalData: processedComboList.length,
        toCheck: processedComboList.length,
        hits: 0, custom: 0, bad: 0, retries: 0,
        totalProxies: totalProxies,
        aliveProxies: Math.floor(totalProxies * 0.7),
        bannedProxies: Math.floor(totalProxies * 0.1),
        badProxies: Math.floor(totalProxies * 0.2),
      }));
      setProgressVal(0);
      setIsRunning(true);
      setLog(prev => prev + `[${new Date().toLocaleTimeString()}] Started Running Config ${selectedConfig} with Wordlist ${selectedList} (${processedComboList.length} items) at ${new Date().toLocaleTimeString()}.\n`);
      toast({title: "Runner Started"});
    }
  };

  const handleActualFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      if (type === "CFG") {
        if (!availableConfigs.includes(file.name)) {
          setAvailableConfigs(prev => [file.name, ...prev]);
        }
        setSelectedConfig(file.name);
        toast({ title: `CFG File Selected`, description: `${file.name} has been selected.` });
      } else if (type === "List" && file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const lines = e.target.result.split('\n').filter(line => line.trim() !== '');
          const parsedList = lines.map(line => {
            const parts = line.split(/[:;|]/);
            const originalData = line;
            const email = parts[0];
            const password = parts[1];
            const redactedData = `${redactEmail(email)}:${redactPassword(password)}`;
            const originalProxy = `${generateRandomIp()}:${generateRandomPort()}`; 
            const redactedProxy = redactIpPort(originalProxy);
            return { originalData, redactedData, originalProxy, redactedProxy };
          });

          setProcessedComboList(parsedList);
          
          if (!availableLists.find(l => l.name === file.name)) {
            setAvailableLists(prev => [{name: file.name, count: lines.length}, ...prev]);
          }
          setSelectedList(file.name);
          setStats(s => ({...s, totalData: lines.length, toCheck: lines.length}));
          setProgressVal(0);
          setCurrentComboIndex(0);
          setComboData([]); 
          setLog(prev => prev + `[${new Date().toLocaleTimeString()}] Loaded Wordlist: ${file.name} with ${lines.length} entries.\n`);
          toast({ title: `List File Loaded`, description: `${file.name} (${lines.length} lines) processed.` });
        };
        reader.readAsText(file);
      } else if (type === "List") {
        toast({ title: "Invalid File Type", description: "Please upload a .txt file for lists.", variant: "destructive" });
      }
    }
    event.target.value = null; 
  };
  
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const itemVariants = { hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-2 sm:p-4 bg-slate-800 text-slate-300 rounded-lg shadow-2xl h-full flex flex-col font-['Consolas',_'Lucida_Console',_monospace] text-xs sm:text-sm">
      
      <motion.div variants={itemVariants} className="flex items-center justify-between p-2 bg-slate-900 rounded-t-md border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-sky-400">OpenBullet Sim</span>
          <span className="text-xs text-slate-500">[Anomaly]</span>
        </div>
        <div className="flex space-x-1 text-slate-400">
          {["Runner", "Proxies", "Wordlists", "Configs", "Hits DB", "Tools", "Settings", "About"].map(tab => (
            <Button key={tab} variant="ghost" size="sm" className={`px-2 py-1 h-auto hover:bg-slate-700 ${tab === "Runner" ? "text-sky-400 bg-slate-700/50" : "hover:text-sky-300"}`} onClick={() => toast({title: `Tab: ${tab}`, description: "This is a simulated interface."}) }>{tab}</Button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex items-center p-3 bg-slate-850 border-b border-slate-700 space-x-4">
        <Button onClick={handleStartStop} className={cn("px-4 py-1.5 h-auto text-sm", isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600")}>
          {isRunning ? <Pause className="w-4 h-4 mr-1.5"/> : <Play className="w-4 h-4 mr-1.5"/>}
          {isRunning ? "Stop" : "Start"}
        </Button>
        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Bots: {bots}</span>
          <Slider defaultValue={[bots]} max={500} step={10} onValueChange={(val) => setBots(val[0])} className="w-24 sm:w-32 [&>span:first-child]:bg-slate-600 [&>span:first-child>span]:bg-sky-400" />
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-slate-400">Prox:</span>
          {["DEF", "ON", "OFF"].map(pt => (
            <Button key={pt} variant="outline" size="sm" onClick={() => setProxyType(pt)} className={cn("px-2 py-0.5 h-auto border-slate-600 hover:bg-slate-700", proxyType === pt ? "bg-sky-500/20 text-sky-400 border-sky-500" : "text-slate-400")}>{pt}</Button>
          ))}
        </div>
        <div className="flex-grow text-right">
          <Progress value={progressVal} className="h-2 bg-slate-700 [&>div]:bg-sky-400" />
          <span className="text-xs text-slate-500 mt-0.5 block">Prog: {stats.totalData > 0 ? `${stats.totalData - stats.toCheck} / ${stats.totalData} (${progressVal.toFixed(1)}%)` : "0 / 0 (0%)"}</span>
        </div>
      </motion.div>

      <div className="flex-grow grid grid-cols-3 gap-2 p-2 overflow-hidden">
        <motion.div variants={itemVariants} className="col-span-2 flex flex-col bg-slate-900/70 rounded p-1 overflow-hidden">
          <div className="grid grid-cols-[40px_1fr_1fr_80px] text-slate-400 border-b border-slate-700 px-1 py-0.5 text-xs">
            <span>Id</span><span>Data</span><span>Proxy</span><span>Status</span>
          </div>
          <div className="flex-grow overflow-y-auto custom-scrollbar-thin pr-1">
            {comboData.map((item, idx) => (
              <div key={idx} className={`grid grid-cols-[40px_1fr_1fr_80px] px-1 py-0.5 ${idx % 2 === 0 ? "bg-slate-800/30" : ""} ${item.status === "<<< HIT" ? "text-green-400" : item.status === "<<< CUSTOM" ? "text-yellow-400" : item.status === "<<< RETRY" ? "text-orange-400" : "text-slate-300"}`}>
                <span className="truncate">{item.id}</span>
                <span className="truncate" title={item.data}>{item.data}</span>
                <span className="truncate" title={item.proxy}>{item.proxy}</span>
                <span className="truncate">{item.status}</span>
              </div>
            ))}
             {comboData.length === 0 && !isRunning && <p className="text-center text-muted-foreground p-4">Awaiting combolist upload and run...</p>}
             {comboData.length === 0 && isRunning && <p className="text-center text-muted-foreground p-4">Processing...</p>}
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="col-span-1 flex flex-col bg-slate-900/70 rounded p-1 overflow-hidden">
          <div className="grid grid-cols-[30px_1fr] text-slate-400 border-b border-slate-700 px-1 py-0.5 text-xs">
            <span>Type</span><span>Capture</span>
          </div>
          <div className="flex-grow overflow-y-auto custom-scrollbar-thin pr-1">
            {captureData.map((item, idx) => (
              <div key={idx} className={`grid grid-cols-[30px_1fr] px-1 py-0.5 ${idx % 2 === 0 ? "bg-slate-800/30" : ""} text-green-400`}>
                <span className="truncate">{item.type}</span>
                <span className="truncate text-xs" title={`Points = ${item.points} | = ${item.value}$ | By ${item.by}`}>{`Points = ${item.points} | = ${item.value}$ | By ${item.by}`}</span>
              </div>
            ))}
            {captureData.length === 0 && <p className="text-center text-muted-foreground p-4">No captures yet.</p>}
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="flex items-stretch p-2 bg-slate-850 border-y border-slate-700 space-x-2">
        <div className="flex flex-col space-y-1">
          <select value={selectedConfig} onChange={(e) => setSelectedConfig(e.target.value)} className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs w-36 focus:outline-none focus:border-sky-500">
            <option disabled value="Select CFG">Select CFG</option>
            {availableConfigs.map(cfg => <option key={cfg} value={cfg}>{cfg}</option>)}
          </select>
          <Button onClick={() => cfgFileInputRef.current?.click()} variant="outline" size="sm" className="px-2 py-1 h-auto text-xs border-slate-600 hover:bg-slate-700 text-slate-400 w-36 justify-start">
            <UploadCloud className="w-3 h-3 mr-1.5"/> Upload CFG
          </Button>
          <input type="file" ref={cfgFileInputRef} onChange={(e) => handleActualFileUpload(e, "CFG")} className="hidden" accept=".loli,.anom" />
        </div>
        <div className="flex flex-col space-y-1">
           <select 
            value={selectedList} 
            onChange={(e) => {
              const selected = availableLists.find(l => l.name === e.target.value);
              if (selected) {
                setSelectedList(selected.name);
                setLog(prev => prev + `[${new Date().toLocaleTimeString()}] INFO: Selected Wordlist from dropdown: ${selected.name}. If this is not the currently loaded list for processing, please use 'Upload List' to load its content.\n`);
                toast({title: "List Selected from Dropdown", description: `${selected.name} (${selected.count} items) selected. Upload via button to process.`});
              } else {
                setSelectedList("Select List");
              }
            }} 
            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs w-36 focus:outline-none focus:border-sky-500"
           >
            <option disabled value="Select List">Select List</option>
            {availableLists.map(lst => <option key={lst.name} value={lst.name}>{`${lst.name} (${lst.count || 'N/A'})`}</option>)}
          </select>
          <Button onClick={() => listFileInputRef.current?.click()} variant="outline" size="sm" className="px-2 py-1 h-auto text-xs border-slate-600 hover:bg-slate-700 text-slate-400 w-36 justify-start">
            <ListFilter className="w-3 h-3 mr-1.5"/> Upload List
          </Button>
          <input type="file" ref={listFileInputRef} onChange={(e) => handleActualFileUpload(e, "List")} className="hidden" accept=".txt" />
        </div>
        <Textarea ref={logEndRef} readOnly value={log} className="flex-grow bg-slate-900/80 border-slate-700 text-slate-300 text-xs rounded custom-scrollbar-thin resize-none h-20 sm:h-24 p-1.5" />
        <div className="grid grid-cols-2 gap-x-3 bg-slate-900/50 p-1.5 rounded border border-slate-700 w-48 text-xs">
          <StatBox title="Total" value={stats.totalData} color="text-slate-300" />
          <StatBox title="Hits" value={stats.hits} color="text-green-400" />
          <StatBox title="Custom" value={stats.custom} color="text-yellow-400" />
          <StatBox title="Bad" value={stats.bad} color="text-red-400" />
          <StatBox title="Retries" value={stats.retries} color="text-orange-400" />
          <StatBox title="To Check" value={stats.toCheck} color="text-sky-400" />
        </div>
         <div className="grid grid-cols-2 gap-x-3 bg-slate-900/50 p-1.5 rounded border border-slate-700 w-48 text-xs">
          <StatBox title="Total Proxies" value={stats.totalProxies} color="text-slate-300" />
          <StatBox title="Alive" value={stats.aliveProxies} color="text-green-400" />
          <StatBox title="Banned" value={stats.bannedProxies} color="text-orange-400" />
          <StatBox title="Bad Proxies" value={stats.badProxies} color="text-red-400" />
          <StatBox title="CPM" value={stats.cpm} color="text-teal-400" />
          <StatBox title="Credit" value={stats.credit} color="text-amber-400" />
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="flex justify-between items-center p-1.5 bg-slate-900 rounded-b-md text-xs text-slate-500">
        <span>Jack - {new Date().toLocaleTimeString()}</span>
        <div className="flex items-center space-x-2">
          <Clock className="w-3 h-3"/>
          <span>0 days 00:00:00 | 8 hours left (simulated)</span>
        </div>
        <span>1,005 x 780</span>
      </motion.div>
    </motion.div>
  );
};

export default OpenBulletPage;
