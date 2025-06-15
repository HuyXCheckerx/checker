import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const CheckerGraph = ({ hitsHistory = [], isRunning }) => {
  const canvasRef = useRef(null);
  const [resolvedColors, setResolvedColors] = useState(null);

  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    setResolvedColors({
      primary: style.getPropertyValue('--primary').trim(),
      mutedForeground: style.getPropertyValue('--muted-foreground').trim(),
    });
  }, []);

  useEffect(() => {
    if (!resolvedColors) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const parent = canvas.parentElement;
    
    let animationFrameId;

    const drawGraph = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (hitsHistory.length < 2) {
        ctx.textAlign = 'center';
        ctx.fillStyle = `hsl(${resolvedColors.mutedForeground.replace(/ /g, ', ')})`;
        ctx.font = '16px Inter, sans-serif';
        ctx.fillText(isRunning ? "Waiting for data..." : "Start checker to see graph", canvas.width / 2, canvas.height / 2);
        return;
      }

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, `hsla(${resolvedColors.primary.replace(/ /g, ', ')}, 0.5)`);
      gradient.addColorStop(1, `hsla(${resolvedColors.primary.replace(/ /g, ', ')}, 0)`);

      const maxValue = Math.max(...hitsHistory, 1);
      const stepX = canvas.width / (hitsHistory.length - 1);
      const stepY = canvas.height / maxValue;

      ctx.beginPath();
      ctx.moveTo(0, canvas.height - hitsHistory[0] * stepY);

      for (let i = 1; i < hitsHistory.length; i++) {
        ctx.lineTo(i * stepX, canvas.height - hitsHistory[i] * stepY);
      }

      ctx.strokeStyle = `hsl(${resolvedColors.primary.replace(/ /g, ', ')})`;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = `hsla(${resolvedColors.primary.replace(/ /g, ', ')}, 0.5)`;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      
      ctx.fillStyle = gradient;
      ctx.fill();
    };
    
    const resizeCanvas = () => {
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      drawGraph();
    };

    const animate = () => {
        drawGraph();
        animationFrameId = requestAnimationFrame(animate);
    };
    
    resizeCanvas();
    if (isRunning || hitsHistory.length > 1) {
        animate();
    } else {
        drawGraph();
    }

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [hitsHistory, isRunning, resolvedColors]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glassmorphism-deep rounded-xl p-3 sm:p-4 shadow-xl h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-2 sm:mb-3">
        <h3 className="text-base sm:text-lg font-semibold text-primary">Hits Over Time</h3>
      </div>
      <div className="flex-grow relative min-h-[150px] sm:min-h-[200px]">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full"></canvas>
      </div>
    </motion.div>
  );
};

export default CheckerGraph;