import React from 'react';
import CheckerInterface from '@/components/CheckerInterface';
import { DollarSign, ShieldAlert, CreditCard, UserX } from 'lucide-react';

const PaypalCheckerPage = () => {
  const additionalFeatures = [
    { label: "Balance Checker", icon: DollarSign },
    { label: "Transaction History", icon: ShieldAlert },
    { label: "Card/Bank Info", icon: CreditCard },
    { label: "Account Limitations", icon: UserX },
  ];

  const paypalAscii = `
    ____        _      _       _   _   _   _   
   |  _ \\ __ _ | | __ | |__   | | | | | |_| | __
   | |_) / _\` || |/ / | '_ \\  | | | | | __| |/ /
   |  __/ (_| ||   <  | | | | | |_| | | |_|   < 
   |_|   \\__,_||_|\\_\\ |_| |_|  \\___/   \\__|_|\\_\\
  `;

  return <CheckerInterface checkerType="PayPal Account Checker" additionalFeatures={additionalFeatures} asciiArt={paypalAscii} />;
};

export default PaypalCheckerPage;