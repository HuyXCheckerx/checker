import React from 'react';
import CheckerInterface from '@/components/CheckerInterface';
import { Inbox, UserCheck, MailWarning, ShieldOff } from 'lucide-react';

const HotmailCheckerPage = () => {
  const additionalFeatures = [
    { label: "Inbox Cleaner", icon: Inbox },
    { label: "Verify Security Info", icon: UserCheck },
    { label: "Detect Forwarding", icon: MailWarning },
    { label: "Check Recovery Options", icon: ShieldOff },
  ];

  const hotmailAscii = `
   __  __         _ _             _ _ 
  |  \\/  |  ___  | | |  ___    __| (_)
  | |\\/| | / _ \\ | | | / _ \\  / _\` | |
  | |  | || (_) || | || (_) || (_| | |
  |_|  |_| \\___/ |_|_| \\___/  \\__,_|_|                                
  `;


  return <CheckerInterface checkerType="Hotmail Account Checker" additionalFeatures={additionalFeatures} asciiArt={hotmailAscii} />;
};

export default HotmailCheckerPage;