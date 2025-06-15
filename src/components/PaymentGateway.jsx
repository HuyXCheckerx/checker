import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Copy, Clock, AlertTriangle, ExternalLink, Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const PaymentGateway = ({ isOpen, onClose, totalUSD, cartItems, onPaymentComplete }) => {
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [userInfo, setUserInfo] = useState({ telegram: '', email: '' });
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [copiedStates, setCopiedStates] = useState({});

  const cryptoOptions = [
    { name: 'Bitcoin', symbol: 'BTC', address: 'bc1qyourbitcoinaddress', icon: 'btc.png', rate: 0.000015, network: 'Bitcoin Network', qrCode: 'qr-btc.png' },
    { name: 'Ethereum', symbol: 'ETH', address: '0xYourEthereumAddress', icon: 'eth.png', rate: 0.00025, network: 'ERC-20 Network', qrCode: 'qr-eth.png' },
    { name: 'Litecoin', symbol: 'LTC', address: 'ltc1qyourlitecoinaddress', icon: 'ltc.png', rate: 0.005, network: 'Litecoin Network', qrCode: 'qr-ltc.png' },
    { name: 'Monero', symbol: 'XMR', address: '4YourMoneroAddress', icon: 'xmr.png', rate: 0.004, network: 'Monero Network (Privacy)', qrCode: 'qr-xmr.png' },
    { name: 'Solana', symbol: 'SOL', address: 'YourSolanaAddressSoL', icon: 'sol.png', rate: 0.03, network: 'Solana Network', qrCode: 'qr-sol.png' },
  ];
  
  const solanaItemsValue = cartItems
    .filter(item => item.priceUnit === 'SOL')
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const usdItemsValue = cartItems
    .filter(item => !item.priceUnit || item.priceUnit !== 'SOL')
    .reduce((sum, item) => sum + item.price * item.quantity, 0);


  useEffect(() => {
    let timer;
    if (showPaymentDetails && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && showPaymentDetails) {
      toast({
        title: "Payment Timer Expired",
        description: "Please restart the payment process if you still wish to proceed.",
        variant: "destructive",
        duration: 7000
      });
      setShowPaymentDetails(false); 
      setSelectedCrypto(null);
    }
    return () => clearInterval(timer);
  }, [showPaymentDetails, timeLeft]);

  useEffect(() => {
    if (!isOpen) {
      setShowPaymentDetails(false);
      setSelectedCrypto(null);
      setUserInfo({ telegram: '', email: '' });
      setCopiedStates({});
    }
  }, [isOpen]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCryptoSelect = (crypto) => {
    setSelectedCrypto(crypto);
  };

  const handleProceedToPayment = () => {
    if (!userInfo.telegram.trim()) {
      toast({
        title: "Telegram Required",
        description: "Please enter your Telegram username to proceed.",
        variant: "destructive"
      });
      return;
    }
    if (!selectedCrypto && usdItemsValue > 0) {
        toast({
            title: "Crypto Not Selected",
            description: "Please select a cryptocurrency for USD payment.",
            variant: "destructive"
        });
        return;
    }
    setShowPaymentDetails(true);
    setTimeLeft(600); 
  };

  const copyToClipboard = (text, type = "Address", id) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} Copied!`,
      description: `${type} copied to clipboard successfully.`,
      duration: 2000
    });
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [id]: false })), 2000);
  };
  
  const cryptoAmountForUSD = selectedCrypto ? (usdItemsValue * selectedCrypto.rate).toFixed(8) : 0;
  const solanaPaymentAddress = cryptoOptions.find(c => c.symbol === 'SOL')?.address;
  const solanaQrCode = cryptoOptions.find(c => c.symbol === 'SOL')?.qrCode;


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl glassmorphism border-primary/30 text-foreground shadow-2xl shadow-primary/20 rounded-xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-3xl font-bold text-primary text-glow-primary flex items-center">
            <ExternalLink className="w-7 h-7 mr-3"/> Secure Checkout
          </DialogTitle>
          {!showPaymentDetails && <DialogDescription className="text-muted-foreground">Complete your purchase using cryptocurrency.</DialogDescription>}
        </DialogHeader>

        {!showPaymentDetails ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="text-center my-4">
              <p className="text-muted-foreground text-lg">Total Due:</p>
              {usdItemsValue > 0 && <span className="text-4xl font-extrabold text-primary">${usdItemsValue.toFixed(2)}</span>}
              {usdItemsValue > 0 && solanaItemsValue > 0 && <span className="text-3xl font-bold text-muted-foreground mx-2">+</span>}
              {solanaItemsValue > 0 && <span className="text-4xl font-extrabold text-secondary">{solanaItemsValue.toFixed(2)} SOL</span>}
            </div>
            
            {usdItemsValue > 0 && (
                <>
                    <h3 className="text-lg font-semibold text-foreground mb-3 border-b border-border pb-2">Pay USD Amount With:</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {cryptoOptions.filter(c => c.symbol !== 'SOL').map((crypto) => (
                        <motion.div
                        key={crypto.symbol}
                        whileHover={{ y: -3, boxShadow: `0 4px 15px hsl(var(--primary)/0.2)` }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleCryptoSelect(crypto)}
                        className={cn(
                            'p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ease-in-out flex flex-col items-center justify-center text-center h-32',
                            selectedCrypto?.symbol === crypto.symbol
                            ? 'border-primary bg-primary/20 shadow-md shadow-primary/30'
                            : 'border-border bg-card/60 hover:border-primary/50'
                        )}
                        >
                        <img-replace src={`/icons/${crypto.icon}`} alt={crypto.name} className="w-8 h-8 mb-1.5 filter_brightness-50_contrast-200" />
                        <h4 className="text-foreground font-medium text-sm">{crypto.name}</h4>
                        <p className="text-primary text-xs">({crypto.symbol})</p>
                        </motion.div>
                    ))}
                    </div>
                </>
            )}


            <div className="space-y-4 pt-4 border-t border-border">
              <div>
                <label htmlFor="telegramUser" className="block text-muted-foreground text-sm font-medium mb-1.5">
                  Telegram Username *
                </label>
                <Input
                  id="telegramUser"
                  placeholder="@your_telegram_handle"
                  value={userInfo.telegram}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, telegram: e.target.value }))}
                  className="bg-input border-border text-foreground focus:border-primary focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="emailUser" className="block text-muted-foreground text-sm font-medium mb-1.5">
                  Email (Optional for backup)
                </label>
                <Input
                  id="emailUser"
                  type="email"
                  placeholder="your_email@example.com"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-input border-border text-foreground focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                onClick={handleProceedToPayment}
                disabled={(!selectedCrypto && usdItemsValue > 0) || !userInfo.telegram.trim()}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 transition-all duration-300 transform hover:scale-105 shadow-glow-primary"
              >
                Proceed to Payment
              </Button>
            </DialogFooter>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 py-4">
            <div className="text-center bg-card/70 p-4 rounded-lg shadow-md border border-border">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <Clock className="w-6 h-6 text-destructive animate-pulse" />
                <span className="text-2xl font-bold text-destructive tabular-nums">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">Payment window closes soon. Please complete your transaction.</p>
            </div>
            
            {usdItemsValue > 0 && selectedCrypto && (
                 <div className="bg-card/70 rounded-lg p-5 space-y-3 shadow-lg border border-primary/30">
                    <h3 className="text-lg font-semibold text-primary flex items-center">
                        <img-replace src={`/icons/${selectedCrypto.icon}`} alt={selectedCrypto.name} className="w-6 h-6 mr-2 filter_brightness-50_contrast-200" />
                        Pay ${usdItemsValue.toFixed(2)} in {selectedCrypto.name} ({selectedCrypto.symbol})
                    </h3>
                    <p className="text-muted-foreground text-xs">Network: <span className="font-medium text-foreground">{selectedCrypto.network}</span></p>
                    <div className="flex items-center justify-between bg-input p-3 rounded-md">
                        <span className="text-primary font-mono text-lg break-all">
                        {cryptoAmountForUSD} <span className="text-sm text-muted-foreground">{selectedCrypto.symbol}</span>
                        </span>
                        <Button
                        size="icon" variant="ghost"
                        onClick={() => copyToClipboard(cryptoAmountForUSD, `${selectedCrypto.symbol} Amount`, `${selectedCrypto.symbol}-amount`)}
                        className="text-primary hover:text-primary/80 w-8 h-8"
                        >
                        {copiedStates[`${selectedCrypto.symbol}-amount`] ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                    <div className="flex items-center justify-between bg-input p-3 rounded-md">
                        <span className="text-foreground font-mono text-sm break-all">
                        {selectedCrypto.address}
                        </span>
                        <Button
                        size="icon" variant="ghost"
                        onClick={() => copyToClipboard(selectedCrypto.address, `${selectedCrypto.name} Address`, `${selectedCrypto.symbol}-address`)}
                        className="text-primary hover:text-primary/80 w-8 h-8"
                        >
                        {copiedStates[`${selectedCrypto.symbol}-address`] ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                    <div className="text-center mt-3">
                         <img-replace className="mx-auto w-36 h-36 bg-white p-1 rounded-md shadow-inner" src={`/qr/${selectedCrypto.qrCode}`} alt={`QR code for ${selectedCrypto.name} payment`} />
                    </div>
                </div>
            )}

            {solanaItemsValue > 0 && (
                 <div className="bg-card/70 rounded-lg p-5 space-y-3 shadow-lg border border-secondary/30 mt-4">
                    <h3 className="text-lg font-semibold text-secondary flex items-center">
                        <img-replace src="/icons/sol.png" alt="Solana" className="w-6 h-6 mr-2 filter_brightness-50_contrast-200" />
                        Pay {solanaItemsValue.toFixed(2)} SOL
                    </h3>
                    <p className="text-muted-foreground text-xs">Network: <span className="font-medium text-foreground">Solana Network</span></p>
                    <div className="flex items-center justify-between bg-input p-3 rounded-md">
                        <span className="text-secondary font-mono text-lg break-all">
                        {solanaItemsValue.toFixed(8)} <span className="text-sm text-muted-foreground">SOL</span>
                        </span>
                        <Button
                        size="icon" variant="ghost"
                        onClick={() => copyToClipboard(solanaItemsValue.toFixed(8), `SOL Amount`, 'sol-amount')}
                        className="text-secondary hover:text-secondary/80 w-8 h-8"
                        >
                        {copiedStates['sol-amount'] ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                    <div className="flex items-center justify-between bg-input p-3 rounded-md">
                        <span className="text-foreground font-mono text-sm break-all">
                        {solanaPaymentAddress}
                        </span>
                        <Button
                        size="icon" variant="ghost"
                        onClick={() => copyToClipboard(solanaPaymentAddress, "Solana Address", 'sol-address')}
                        className="text-secondary hover:text-secondary/80 w-8 h-8"
                        >
                        {copiedStates['sol-address'] ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                     <div className="text-center mt-3">
                         <img-replace className="mx-auto w-36 h-36 bg-white p-1 rounded-md shadow-inner" src={`/qr/${solanaQrCode}`} alt="QR code for Solana payment" />
                    </div>
                </div>
            )}


            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive-foreground/80 text-sm flex items-start">
              <AlertTriangle className="w-8 h-8 mr-3 mt-0.5 text-destructive flex-shrink-0" />
              <div>
                <strong className="font-semibold text-destructive-foreground">Important:</strong> Only send the exact amount to the specified address. Ensure you are on the correct network. Incorrect transactions may result in loss of funds.
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground mt-4">
              <p>After sending payment(s), your order will be processed.</p>
              <p>Access details will be sent to Telegram: <strong className="text-primary">@{userInfo.telegram}</strong></p>
              {userInfo.email && <p>And optionally to email: <strong className="text-primary">{userInfo.email}</strong></p>}
            </div>
            
            <DialogFooter className="mt-8">
              <Button onClick={onPaymentComplete} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg shadow-lg hover:shadow-green-500/50 transition-all">
                I've Sent The Payment(s)
              </Button>
            </DialogFooter>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentGateway;