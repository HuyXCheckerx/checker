import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export const TosDialog = ({ isOpen, onClose, terms }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-3xl glassmorphism border-primary/30 text-foreground shadow-2xl shadow-primary/20 rounded-xl">
      <DialogHeader className="text-left">
        <DialogTitle className="text-3xl font-bold text-primary text-glow-primary mb-2 flex items-center">
          <FileText className="w-7 h-7 mr-3"/> {terms.title}
        </DialogTitle>
        <DialogDescription className="text-muted-foreground text-sm">
          Last Updated: {terms.lastUpdated}
        </DialogDescription>
      </DialogHeader>
      <div className="mt-6 max-h-[60vh] overflow-y-auto pr-4 space-y-6 custom-scrollbar">
        {terms.sections.map((section, idx) => (
          <div key={idx}>
            <h4 className="text-xl font-semibold text-primary mb-2">{section.heading}</h4>
            <ul className="list-disc list-inside space-y-1.5 text-foreground/90 pl-2">
              {section.points.map((point, pIdx) => (
                <li key={pIdx}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <DialogFooter className="mt-8">
        <Button onClick={onClose} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-primary">
          Understood & Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);