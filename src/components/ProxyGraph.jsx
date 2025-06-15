import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const ProxyGraph = ({ proxyData = [], isRunning }) => {
  const canvasRef = useRef(null);
  const [resolvedColors, setResolvedColors] = useState(null);

  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    setResolvedColors({
      secondary: style.getPropertyValue('--secondary').trim(),
      accent: style.getPropertyValue('--accent').trim(),
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

    const drawLine = (data, max, stepX, colorValue, gradient) => {
        const stepY = canvas.height / max;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - data[0] * stepY);
        for (let i = 1; i < data.length; i++) {
            ctx.lineTo(i * stepX, canvas.height - data[i] * stepY);
        }
        ctx.strokeStyle = `hsl(${colorValue.replace(/ /g, ', ')})`;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = `hsla(${colorValue.replace(/ /g, ', ')}, 0.5)`;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    const drawGraph = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (proxyData.length < 2) {
        ctx.textAlign = 'center';
        ctx.fillStyle = `hsl(${resolvedColors.mutedForeground.replace(/ /g, ', ')})`;
        ctx.font = '16px Inter, sans-serif';
        ctx.fillText("Proxy data will appear here when running", canvas.width / 2, canvas.height / 2);
        return;
      }

      const usageGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      usageGradient.addColorStop(0, `hsla(${resolvedColors.secondary.replace(/ /g, ', ')}, 0.5)`);
      usageGradient.addColorStop(1, `hsla(${resolvedColors.secondary.replace(/ /g, ', ')}, 0)`);

      const speedGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      speedGradient.addColorStop(0, `hsla(${resolvedColors.accent.replace(/ /g, ', ')}, 0.5)`);
      speedGradient.addColorStop(1, `hsla(${resolvedColors.accent.replace(/ /g, ', ')}, 0)`);

      const usageValues = proxyData.map(p => p.usage);
      const speedValues = proxyData.map(p => p.speed);

      const maxUsage = 100;
      const maxSpeed = Math.max(...speedValues, 1);
      const stepX = canvas.width / (proxyData.length - 1);
      
      drawLine(usageValues, maxUsage, stepX, resolvedColors.secondary, usageGradient);
      drawLine(speedValues, maxSpeed, stepX, resolvedColors.accent, speedGradient);
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
    if (isRunning || proxyData.length > 1) {
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
  }, [proxyData, isRunning, resolvedColors]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glassmorphism-deep rounded-xl p-3 sm:p-4 shadow-xl h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-2 sm:mb-3">
        <h3 className="text-base sm:text-lg font-semibold text-secondary">Proxy Performance</h3>
        <div className="flex gap-4 text-xs">
            <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-secondary mr-1.5"></div>Usage %</span>
            <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-accent mr-1.5"></div>Speed ms</span>
        </div>
      </div>
      <div className="flex-grow relative min-h-[150px] sm:min-h-[200px]">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full"></canvas>
      </div>
    </motion.div>
  );
};

export default ProxyGraph;