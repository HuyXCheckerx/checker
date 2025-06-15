import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Play, Pause, Settings, UploadCloud, ListChecks, XCircle, AlertTriangle, Lock, ShieldQuestion, Server, FileText, Infinity as InfinityIcon, MailPlus, Clock, Users, Info, Settings2, Trash2, EyeOff, Save, Bell, CheckCircle2, ServerCog } from 'lucide-react';
import { cn } from '@/lib/utils';

const StatItem = ({ icon: Icon, label, value, color = "text-muted-foreground" }) => (
  <div className="flex justify-between items-center py-1.5 px-1 text-sm">
    <div className="flex items-center">
      <Icon className={`w-4 h-4 mr-2 ${color}`} />
      <span className={color}>{label}</span>
    </div>
    <span className={`font-semibold ${color === "text-muted-foreground" ? "text-foreground" : color}`}>{value}</span>
  </div>
);

const SmtpCheckerPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [combolist, setCombolist] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [threads, setThreads] = useState(50);
  const [timeout, setTimeoutVal] = useState(50);
  const [checkOnWeb, setCheckOnWeb] = useState(true);
  const [useProxies, setUseProxies] = useState(true);
  const [proxyOrder, setProxyOrder] = useState("random");
  const [additionalSettings, setAdditionalSettings] = useState({
    rebruteBlocked: false,
    saveRest: false,
    saveRestMinutes: 5,
    startOnBaseLoaded: false,
    ignoreDomains: false,
    processMultipassword: true,
    notifyWhenCompleted: true,
  });

  const [stats, setStats] = useState({
    totalLines: 0,
    checked: 0,
    proxy: 0,
    threads: 0,
    good: 0,
    found: 0,
    bad: 0,
    blocked: 0,
    captcha: 0,
    errors: 0,
    hostNotFound: 0,
    multipassword: 0,
  });

  const fileInputRef = useRef(null);
  const intervalRef = useRef(null);

  const generateRandomString = (length) => Math.random().toString(36).substring(2, length + 2);
  const generateRandomIp = () => Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const lines = e.target.result.split('\n').filter(line => line.trim() !== '');
        setCombolist(lines);
        setStats(prev => ({ ...prev, totalLines: lines.length, checked: 0, good: 0, found: 0, bad: 0, blocked: 0, captcha: 0, errors: 0, hostNotFound: 0, multipassword: 0 }));
        setProcessedData([]);
        setFileName(file.name);
        toast({ title: "Combolist Loaded", description: `${lines.length} SMTP credentials loaded from ${file.name}.` });
        if (additionalSettings.startOnBaseLoaded) {
          handleStartStop();
        }
      };
      reader.readAsText(file);
    } else {
      toast({ title: "Invalid File", description: "Please upload a .txt file.", variant: "destructive" });
    }
    event.target.value = null;
  };

  useEffect(() => {
    if (isRunning) {
      setStats(prev => ({ ...prev, threads: threads }));
      intervalRef.current = setInterval(() => {
        setStats(prev => {
          if (prev.checked >= prev.totalLines) {
            setIsRunning(false);
            if (additionalSettings.notifyWhenCompleted) {
              toast({ title: "SMTP Check Complete", description: "All credentials processed." });
            }
            return { ...prev, threads: 0 };
          }

          const batchSize = Math.min(threads, prev.totalLines - prev.checked, Math.floor(Math.random() * 5) + 1);
          let newGood = prev.good;
          let newFound = prev.found;
          let newBad = prev.bad;
          let newBlocked = prev.blocked;
          let newCaptcha = prev.captcha;
          let newErrors = prev.errors;
          let newHostNotFound = prev.hostNotFound;
          let newMultipassword = prev.multipassword;
          let newProcessedBatch = [];

          for (let i = 0; i < batchSize; i++) {
            const comboIndex = prev.checked + i;
            const [address, password] = (combolist[comboIndex] || "").split(/[:;|,]/);
            let status = "Bad";
            const rand = Math.random();

            if (rand < 0.15) { status = "Good"; newGood++; }
            else if (rand < 0.20) { status = "Found"; newFound++; }
            else if (rand < 0.23) { status = "Blocked"; newBlocked++; }
            else if (rand < 0.25) { status = "Captcha"; newCaptcha++; }
            else if (rand < 0.28) { status = "Error"; newErrors++; }
            else if (rand < 0.30) { status = "HostNotFound"; newHostNotFound++; }
            else if (rand < 0.32 && additionalSettings.processMultipassword) { status = "Multipassword"; newMultipassword++; }
            else { newBad++; }
            
            newProcessedBatch.push({ address: address || "N/A", password: password ? password.substring(0,2) + '***' : "N/A", status });
          }
          
          setProcessedData(prevData => [...newProcessedBatch, ...prevData].slice(0, 100));

          return {
            ...prev,
            checked: prev.checked + batchSize,
            good: newGood,
            found: newFound,
            bad: newBad,
            blocked: newBlocked,
            captcha: newCaptcha,
            errors: newErrors,
            hostNotFound: newHostNotFound,
            multipassword: newMultipassword,
            proxy: useProxies ? Math.floor(Math.random() * 1000) + 500 : 0,
          };
        });
      }, 1000 / (threads / 10)); // Simulate thread speed
    } else {
      clearInterval(intervalRef.current);
      setStats(prev => ({ ...prev, threads: 0 }));
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, threads, combolist, useProxies, additionalSettings.notifyWhenCompleted, additionalSettings.processMultipassword]);

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
      toast({ title: "SMTP Check Paused" });
    } else {
      if (stats.totalLines === 0) {
        toast({ title: "No Combolist", description: "Please load a combolist first.", variant: "destructive" });
        return;
      }
      setIsRunning(true);
      toast({ title: "SMTP Check Started" });
    }
  };

  const handleCheckboxChange = (setting) => {
    setAdditionalSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const itemVariants = { hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <motion.div 
      variants={containerVariants} initial="hidden" animate="visible" 
      className="h-full flex flex-col bg-slate-800 text-slate-300 rounded-lg shadow-2xl font-['Inter',_sans-serif] text-sm"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between p-3 bg-slate-900 rounded-t-md border-b border-slate-700">
        <h1 className="text-lg font-semibold text-primary">HMC 2.2.4 - SMTP Checker</h1>
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-slate-400 hover:text-primary cursor-pointer" onClick={() => toast({title: "Global Settings", description: "Feature not implemented yet."})}/>
          <MailPlus className="w-5 h-5 text-slate-400 hover:text-primary cursor-pointer" onClick={() => toast({title: "Mail Client", description: "Feature not implemented yet."})}/>
          <Users className="w-5 h-5 text-slate-400 hover:text-primary cursor-pointer" onClick={() => toast({title: "User Accounts", description: "Feature not implemented yet."})}/>
          <Info className="w-5 h-5 text-slate-400 hover:text-primary cursor-pointer" onClick={() => toast({title: "About", description: "SMTP Checker module."})}/>
        </div>
      </motion.div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-[280px_1fr_320px] gap-3 p-3 overflow-hidden">
        {/* Left Column */}
        <motion.div variants={itemVariants} className="flex flex-col space-y-3 bg-slate-850 p-3 rounded-md border border-slate-700">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 mx-auto border-4 border-primary rounded-full flex items-center justify-center mb-3">
              <InfinityIcon className={`w-16 h-16 text-primary ${isRunning ? 'animate-spin-slow' : ''}`} />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleStartStop} className={cn("w-full", isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600")}>
                {isRunning ? <Pause className="w-4 h-4 mr-1.5"/> : <Play className="w-4 h-4 mr-1.5"/>}
                {isRunning ? "Stop" : "Start"}
              </Button>
            </div>
             <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full mt-2 border-primary/50 text-primary hover:bg-primary/10">
                <UploadCloud className="w-4 h-4 mr-1.5"/> Load Combolist
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt" className="hidden" />
            {fileName && <p className="text-xs text-muted-foreground mt-1 truncate text-center" title={fileName}>Loaded: {fileName}</p>}
          </div>

          <Tabs defaultValue="base" className="flex-grow flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
              <TabsTrigger value="base" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Base</TabsTrigger>
              <TabsTrigger value="proxy" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Proxy</TabsTrigger>
            </TabsList>
            <TabsContent value="base" className="flex-grow overflow-y-auto custom-scrollbar-thin p-1 mt-2">
              <StatItem icon={ListChecks} label="Total lines" value={stats.totalLines} />
              <StatItem icon={FileText} label="Checked" value={stats.checked} />
              <StatItem icon={Server} label="Proxy" value={stats.proxy} />
              <StatItem icon={Users} label="Threads" value={stats.threads} />
            </TabsContent>
            <TabsContent value="proxy" className="flex-grow overflow-y-auto custom-scrollbar-thin p-1 mt-2">
              <StatItem icon={Server} label="Total Proxies" value={useProxies ? Math.floor(stats.proxy * 1.5) : 0} />
              <StatItem icon={CheckCircle2} label="Alive" value={useProxies ? stats.proxy : 0} color="text-green-400" />
              <StatItem icon={AlertTriangle} label="Banned" value={useProxies ? Math.floor(stats.proxy * 0.2) : 0} color="text-orange-400" />
              <StatItem icon={XCircle} label="Bad" value={useProxies ? Math.floor(stats.proxy * 0.3) : 0} color="text-red-400" />
            </TabsContent>
          </Tabs>
          
          <div className="flex-grow overflow-y-auto custom-scrollbar-thin border-t border-slate-700 pt-2">
            <StatItem icon={CheckCircle2} label="Good" value={stats.good} color="text-green-400" />
            <StatItem icon={FileText} label="Found" value={stats.found} color="text-sky-400" />
            <StatItem icon={XCircle} label="Bad" value={stats.bad} color="text-red-400" />
            <StatItem icon={Lock} label="Blocked" value={stats.blocked} color="text-orange-400" />
            <StatItem icon={ShieldQuestion} label="Captcha" value={stats.captcha} color="text-yellow-400" />
            <StatItem icon={AlertTriangle} label="Errors" value={stats.errors} color="text-red-500" />
            <StatItem icon={ServerCog} label="Host not found" value={stats.hostNotFound} />
            <StatItem icon={ListChecks} label="Multipassword" value={stats.multipassword} />
          </div>
        </motion.div>

        {/* Center Column */}
        <motion.div variants={itemVariants} className="flex flex-col bg-slate-850 p-3 rounded-md border border-slate-700 overflow-hidden">
          <Input type="search" placeholder="Enter search query..." className="mb-2 bg-slate-700/50 border-slate-600 focus:bg-slate-700" />
          <div className="grid grid-cols-[1fr_1fr_100px] text-slate-400 border-b border-slate-600 px-2 py-1 text-xs font-semibold">
            <span>Address</span>
            <span>Password</span>
            <span>Status</span>
          </div>
          <div className="flex-grow overflow-y-auto custom-scrollbar-thin">
            {processedData.map((item, idx) => (
              <div key={idx} className={`grid grid-cols-[1fr_1fr_100px] px-2 py-1 text-xs ${idx % 2 === 0 ? "bg-slate-800/40" : ""}`}>
                <span className="truncate" title={item.address}>{item.address}</span>
                <span className="truncate" title={item.password}>{item.password}</span>
                <Badge variant={
                  item.status === "Good" ? "success" :
                  item.status === "Found" ? "info" :
                  item.status === "Blocked" ? "warning" :
                  item.status === "Captcha" ? "warning" :
                  item.status === "Error" ? "destructive" :
                  item.status === "HostNotFound" ? "destructive" :
                  item.status === "Multipassword" ? "secondary" :
                  "outline"
                } className="text-xs justify-center">{item.status}</Badge>
              </div>
            ))}
            {processedData.length === 0 && <p className="text-center text-muted-foreground p-4">No data processed yet. Load a combolist and start.</p>}
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div variants={itemVariants} className="flex flex-col space-y-3 bg-slate-850 p-3 rounded-md border border-slate-700 overflow-y-auto custom-scrollbar-thin">
          <h3 className="text-md font-semibold text-primary border-b border-primary/30 pb-1.5">Global settings</h3>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Threads number</label>
            <Input type="number" value={threads} onChange={(e) => setThreads(parseInt(e.target.value) || 1)} className="bg-slate-700/50 border-slate-600 focus:bg-slate-700 h-8 text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Timeout (s)</label>
            <Input type="number" value={timeout} onChange={(e) => setTimeoutVal(parseInt(e.target.value) || 1)} className="bg-slate-700/50 border-slate-600 focus:bg-slate-700 h-8 text-sm" />
          </div>
          <div className="flex items-center space-x-2 pt-1">
            <Checkbox id="checkOnWeb" checked={checkOnWeb} onCheckedChange={setCheckOnWeb} />
            <label htmlFor="checkOnWeb" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Check on Web</label>
            <Button variant="ghost" size="sm" className="text-primary h-auto p-1 text-xs hover:bg-primary/10" onClick={() => toast({title: "Configure Web Check", description:"Not implemented"})}>Configure</Button>
          </div>

          <h3 className="text-md font-semibold text-primary border-b border-primary/30 pb-1.5 pt-2">Proxies</h3>
          <div className="flex items-center space-x-2">
            <Checkbox id="useProxies" checked={useProxies} onCheckedChange={setUseProxies} />
            <label htmlFor="useProxies" className="text-sm font-medium leading-none">Use proxies</label>
            <Info className="w-4 h-4 text-slate-500 cursor-pointer" onClick={() => toast({title: "Proxy Info", description: "Enable to use proxies for checking."})} />
          </div>
          <Select value={proxyOrder} onValueChange={setProxyOrder} disabled={!useProxies}>
            <SelectTrigger className="w-full bg-slate-700/50 border-slate-600 focus:bg-slate-700 h-9 text-sm">
              <SelectValue placeholder="Take proxies in order" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="order">Take proxies in order</SelectItem>
              <SelectItem value="random">Take proxies randomly</SelectItem>
            </SelectContent>
          </Select>
          
          <h3 className="text-md font-semibold text-primary border-b border-primary/30 pb-1.5 pt-2">Additional settings</h3>
          <div className="space-y-2 text-sm">
            {[
              {id: "rebruteBlocked", label: "Rebrute blocked"},
              {id: "saveRest", label: "Save rest (m)", hasInput: true, value: additionalSettings.saveRestMinutes, onChange: (val) => setAdditionalSettings(p => ({...p, saveRestMinutes: parseInt(val) || 0}))},
              {id: "startOnBaseLoaded", label: "Start on base loaded"},
              {id: "ignoreDomains", label: "Ignore domains", hasIcon: true, icon: Settings2, onIconClick: () => toast({title: "Ignore Domains Config", description:"Not implemented"})},
              {id: "processMultipassword", label: "Process multipassword"},
              {id: "notifyWhenCompleted", label: "Notify when completed"},
            ].map(setting => (
              <div key={setting.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id={setting.id} checked={additionalSettings[setting.id]} onCheckedChange={() => handleCheckboxChange(setting.id)} />
                  <label htmlFor={setting.id} className="font-medium leading-none">{setting.label}</label>
                </div>
                {setting.hasInput && additionalSettings[setting.id] && <Input type="number" value={setting.value} onChange={(e) => setting.onChange(e.target.value)} className="w-16 h-7 text-xs bg-slate-700/50 border-slate-600 focus:bg-slate-700" />}
                {setting.hasIcon && <setting.icon className="w-4 h-4 text-slate-400 hover:text-primary cursor-pointer" onClick={setting.onIconClick} />}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="flex justify-between items-center p-2 bg-slate-900 rounded-b-md text-xs text-slate-500 border-t border-slate-700">
        <div className="flex items-center space-x-2">
          <MailPlus className="w-4 h-4 text-primary" />
          <span>Client</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-primary" />
          <span>Scheduler</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SmtpCheckerPage;