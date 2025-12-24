
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useAnimationFrame, PanInfo, animate, MotionValue } from 'framer-motion';
import { NODES, BEES, getBeeIcon } from './constants';
import { NodeItem, BeeType } from './types';
import { 
  X, 
  Sparkles, 
  SquareTerminal,
  ArrowRight,
  Activity,
  Github,
  ExternalLink
} from 'lucide-react';

// --- Types & Interfaces ---

interface SimulatedNode extends NodeItem {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

// --- Components ---

const ConnectionLines: React.FC<{ nodePositions: Map<string, { x: MotionValue<number>, y: MotionValue<number> }> }> = ({ nodePositions }) => {
  const centerId = 'n0';
  const centerPos = nodePositions.get(centerId);
  
  if (!centerPos) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
      {Array.from(nodePositions.entries()).filter(([id]) => id !== centerId).map(([id, pos], i) => (
        <motion.line
          key={id}
          // @ts-ignore - Framer Motion supports MotionValues in SVG attributes
          x1={centerPos.x}
          // @ts-ignore
          y1={centerPos.y}
          // @ts-ignore
          x2={pos.x}
          // @ts-ignore
          y2={pos.y}
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="text-stone-400"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 0.3,
            strokeDashoffset: [0, -20]
          }}
          transition={{ 
            pathLength: { duration: 1.5, delay: i * 0.1 },
            opacity: { duration: 1, delay: i * 0.1 },
            strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" }
          }}
        />
      ))}
    </svg>
  );
};

const BeeCharacter: React.FC<{ type: BeeType; nodePositions: Map<string, { x: MotionValue<number>, y: MotionValue<number> }> }> = ({ type, nodePositions }) => {
  // Find the core node and a target node based on bee type or random
  const coreId = 'n0';
  
  // Select a target node based on the bee's "interest" (tags)
  const targetId = useMemo(() => {
    const interests = {
      frontend: ['Frontend', 'React', 'CSS Engine'],
      backend: ['Architecture', 'Design Patterns'],
      logic: ['DSA', 'Learning'],
      debug: ['Engineering'],
      growth: ['Learning'],
      collab: ['Ethics']
    };
    
    const beeInterests = interests[type as keyof typeof interests] || [];
    const match = NODES.find(n => n.id !== 'n0' && n.tags.some(t => beeInterests.includes(t)));
    return match ? match.id : NODES[Math.floor(Math.random() * (NODES.length - 1)) + 1].id;
  }, [type]);

  // Animation state
  const progress = useMotionValue(0);
  const [direction, setDirection] = useState(1); // 1 = to target, -1 = to core
  
  // Config
  const beeConfig = {
    frontend: { speed: 0.002 },
    backend: { speed: 0.0015 },
    logic: { speed: 0.0025 },
    debug: { speed: 0.002 },
    growth: { speed: 0.001 },
    collab: { speed: 0.0018 }
  };
  const config = beeConfig[type] || beeConfig.frontend;

  // Loop animation
  useAnimationFrame(() => {
    const current = progress.get();
    if (current >= 1 && direction === 1) setDirection(-1);
    if (current <= 0 && direction === -1) setDirection(1);
    
    progress.set(current + (config.speed * direction));
  });

  // We need a ref to hold the current position for the render loop
  const ref = useRef<HTMLDivElement>(null);

  useAnimationFrame(() => {
    if (!ref.current) return;
    
    const corePos = nodePositions.get(coreId);
    const targetPos = nodePositions.get(targetId);

    if (!corePos || !targetPos) return;

    const p = progress.get();
    const cx = corePos.x.get();
    const cy = corePos.y.get();
    const tx = targetPos.x.get();
    const ty = targetPos.y.get();

    // Linear interpolation
    const curX = cx + (tx - cx) * p;
    const curY = cy + (ty - cy) * p;
    
    // Add some "organic" wobble
    const time = Date.now() / 1000;
    const wobbleX = Math.sin(time * 2 + p * 10) * 20 * Math.sin(p * Math.PI); 
    const wobbleY = Math.cos(time * 3 + p * 10) * 20 * Math.sin(p * Math.PI);

    ref.current.style.transform = `translate(${curX + wobbleX}px, ${curY + wobbleY}px)`;
  });

  return (
    <div
      ref={ref}
      className="absolute top-0 left-0 z-[5] pointer-events-none will-change-transform"
    >
      <motion.div 
        animate={{ 
          y: [0, -5, 0],
          rotate: [0, 10, 0, -10, 0]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="flex items-center justify-center"
      >
        {getBeeIcon(type)}
      </motion.div>
    </div>
  );
};

const NoiseOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[150] opacity-[0.04] mix-blend-overlay">
    <svg className="w-full h-full pointer-events-none">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
    </svg>
  </div>
);

const Node: React.FC<{ 
  node: NodeItem; 
  x: MotionValue<number>;
  y: MotionValue<number>;
  onSelect: (id: string) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  isActive: boolean;
  isHighlighted: boolean;
}> = ({ node, x, y, onSelect, onDragStart, onDragEnd, isActive, isHighlighted }) => {
  // Organic shape generation
  const borderRadius = useMemo(() => {
    if (node.id === 'n0') return '50%'; // Core is circular
    const seed = node.id.charCodeAt(1);
    const r1 = 40 + (seed % 20);
    const r2 = 30 + (seed % 30);
    const r3 = 50 + (seed % 10);
    const r4 = 35 + (seed % 25);
    return `${r1}px ${r2}px ${r3}px ${r4}px`;
  }, [node.id]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0, scale: 0.8 }}
      style={{ 
        x, 
        y,
        backgroundColor: node.color,
        width: node.id === 'n0' ? 280 : 220,
        height: node.id === 'n0' ? 280 : 220,
        marginLeft: node.id === 'n0' ? -140 : -110,
        marginTop: node.id === 'n0' ? -140 : -110,
        borderRadius: borderRadius,
        boxShadow: isActive 
          ? '0 20px 50px -12px rgba(0,0,0,0.25)' 
          : '0 10px 30px -10px rgba(0,0,0,0.1)'
      }}
      animate={{ 
        opacity: isHighlighted ? 1 : 0.3, 
        scale: isActive ? 1.1 : 1,
        filter: isHighlighted ? 'blur(0px) grayscale(0%)' : 'blur(2px) grayscale(100%)',
        zIndex: isActive ? 50 : 10,
        rotate: isActive ? 0 : (node.id.charCodeAt(1) % 10) - 5 // Slight random tilt
      }}
      whileHover={{ scale: 1.05, zIndex: 40, rotate: 0 }}
      onClick={() => onSelect(node.id)}
      className={`absolute top-0 left-0 cursor-grab active:cursor-grabbing p-8 shadow-xl border border-white/40 backdrop-blur-md transition-shadow duration-300 flex flex-col gap-3 items-center text-center justify-center`}
    >
      <div className="flex flex-col items-center gap-1">
        <span className="text-[9px] font-black uppercase tracking-widest text-stone-900/40">{node.type}</span>
        {node.id === 'n0' && <div className="px-3 py-1 bg-stone-900 text-white text-[8px] font-bold rounded-full mb-1">CORE</div>}
      </div>
      
      <div>
        <h3 className={`font-bold text-stone-900 leading-tight font-serif italic ${node.id === 'n0' ? 'text-3xl' : 'text-xl'}`}>
          {node.title}
        </h3>
        <p className="text-[10px] text-stone-900/60 font-bold tracking-wide uppercase mt-2">{node.subtitle}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5 pt-1">
        {node.tags.slice(0, 2).map(tag => (
          <span key={tag} className="text-[8px] px-2 py-1 bg-white/40 rounded-full border border-white/50 text-stone-800 font-bold uppercase tracking-wider">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeBeeType, setActiveBeeType] = useState<BeeType | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  
  // Physics state ref (mutable, no re-renders)
  const physicsState = useRef(NODES.map(n => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const height = typeof window !== 'undefined' ? window.innerHeight : 800;
    return {
      id: n.id,
      x: width * (n.x / 100),
      y: height * (n.y / 100),
      vx: 0,
      vy: 0
    };
  }));

  // MotionValues for view (updates DOM directly)
  const nodeMotionValues = useMemo(() => {
    const map = new Map<string, { x: MotionValue<number>, y: MotionValue<number> }>();
    NODES.forEach(n => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 1000;
      const height = typeof window !== 'undefined' ? window.innerHeight : 800;
      map.set(n.id, {
        x: new MotionValue(width * (n.x / 100)),
        y: new MotionValue(height * (n.y / 100))
      });
    });
    return map;
  }, []);

  // Physics Simulation Loop
  useAnimationFrame((time, delta) => {
    if (isDragging) return; // Pause physics while dragging

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dt = Math.min(delta, 50) / 1000; // Cap delta time

    physicsState.current.forEach((node, i) => {
        let fx = 0;
        let fy = 0;

        // 1. Anchor Force
        const targetX = width * (NODES[i].x / 100);
        const targetY = height * (NODES[i].y / 100);
        const kAnchor = 0.8;
        fx += (targetX - node.x) * kAnchor;
        fy += (targetY - node.y) * kAnchor;

        // 2. Repulsion Force
        physicsState.current.forEach((other, j) => {
          if (i === j) return;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);
          const minDist = 350;

          if (dist < minDist && dist > 0) {
            const force = (minDist - dist) * 8;
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
          }
        });

        // Integration
        const damping = 0.9;
        node.vx = (node.vx + fx * dt) * damping;
        node.vy = (node.vy + fy * dt) * damping;

        node.x += node.vx * dt;
        node.y += node.vy * dt;

        // Boundary constraints
        const padding = 100;
        if (node.x < padding) { node.x = padding; node.vx *= -0.5; }
        if (node.x > width - padding) { node.x = width - padding; node.vx *= -0.5; }
        if (node.y < padding) { node.y = padding; node.vy *= -0.5; }
        if (node.y > height - padding) { node.y = height - padding; node.vy *= -0.5; }

        // Sync to MotionValue
        const mVal = nodeMotionValues.get(node.id);
        if (mVal) {
            mVal.x.set(node.x);
            mVal.y.set(node.y);
        }
    });
  });

  // Handle Window Resize
  useEffect(() => {
    const handleResize = () => {
      // Optional: Re-awaken physics or adjust positions
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const highlightedNodes = useMemo(() => {
    if (activeCategory) {
      return NODES.filter(n => n.type === activeCategory).map(n => n.id);
    }
    if (!activeBeeType) return NODES.map(n => n.id);
    return NODES.filter(n => {
       if (activeBeeType === 'frontend') return n.tags.some(t => ['Frontend', 'React', 'CSS Engine'].includes(t));
       if (activeBeeType === 'backend') return n.tags.some(t => ['Architecture', 'Design Patterns'].includes(t));
       if (activeBeeType === 'logic') return n.tags.some(t => ['DSA', 'Learning', 'Architecture'].includes(t));
       if (activeBeeType === 'growth') return n.id === 'n4';
       return true;
    }).map(n => n.id);
  }, [activeBeeType, activeCategory]);

  const selectedNode = NODES.find(n => n.id === selectedNodeId);

  return (
    <div className="relative w-screen h-screen bg-[#FAF9F6] overflow-hidden select-none text-stone-900">
      <NoiseOverlay />
      <div className="absolute inset-0 canvas-bg opacity-30 pointer-events-none" />
      
      {/* Header */}
      <header className="fixed top-6 left-6 z-50 flex items-center gap-4 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-stone-200 shadow-lg pointer-events-auto flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center">
            <SquareTerminal className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif italic text-lg font-bold leading-none">Katekani Nyamandi</span>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-stone-400 leading-none mt-1"> Aspiring Software Engineer </span>
          </div>
        </div>
      </header>

      {/* Mind Activity Sidebar */}
      <div className="fixed top-6 right-6 z-40 hidden md:block">
        <motion.div 
          initial={false}
          animate={{ 
            width: isSidebarOpen ? 256 : 60,
            height: isSidebarOpen ? 'auto' : 60,
            borderRadius: isSidebarOpen ? '2rem' : '30px'
          }}
          onHoverStart={() => setIsSidebarOpen(true)}
          onHoverEnd={() => setIsSidebarOpen(false)}
          onClick={() => setIsSidebarOpen(true)}
          className="bg-white/50 backdrop-blur-sm border border-white/60 shadow-sm overflow-hidden"
        >
            <div className="max-h-[90vh] overflow-y-auto">
            <div className="p-6 w-64">
                <div className="flex items-center gap-3 mb-6 opacity-50">
                    <Activity className="w-4 h-4 min-w-[16px]" />
                    <motion.span 
                      animate={{ opacity: isSidebarOpen ? 1 : 0 }}
                      className="text-xs font-bold uppercase tracking-widest whitespace-nowrap"
                    >
                      Mind Activity
                    </motion.span>
                </div>
                
                <motion.div 
                  animate={{ opacity: isSidebarOpen ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {['project', 'experiment', 'philosophy', 'goal'].map(category => (
                    <div key={category}>
                       <h4 
                         className={`text-[10px] font-black uppercase tracking-widest mb-3 cursor-pointer transition-colors flex items-center gap-2 ${activeCategory === category ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
                         onClick={(e) => {
                           e.stopPropagation();
                           setActiveCategory(activeCategory === category ? null : category);
                         }}
                       >
                         {activeCategory === category && <div className="w-1.5 h-1.5 rounded-full bg-stone-900" />}
                         {category}s
                       </h4>
                       <div className="space-y-3 pl-2 border-l border-stone-200/50">
                         {NODES.filter(n => n.type === category).map(n => (
                           <div key={n.id} className="group cursor-pointer" onClick={(e) => {
                             e.stopPropagation();
                             setSelectedNodeId(n.id);
                           }}>
                             <div className={`text-sm font-serif italic transition-colors leading-tight mb-0.5 ${selectedNodeId === n.id ? 'text-stone-900 font-bold' : 'text-stone-600 group-hover:text-stone-900'}`}>
                               {n.title}
                             </div>
                             <div className="text-[9px] text-stone-400 font-medium tracking-wide uppercase">{n.subtitle}</div>
                           </div>
                         ))}
                       </div>
                    </div>
                  ))}
                </motion.div>
            </div>
            </div>
        </motion.div>
      </div>

      {/* Main Canvas */}
      <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
        <ConnectionLines nodePositions={nodeMotionValues} />
        
        {NODES.map((node) => {
            const pos = nodeMotionValues.get(node.id);
            if (!pos) return null;
            return (
                <Node 
                    key={node.id}
                    node={node} 
                    x={pos.x}
                    y={pos.y}
                    onSelect={setSelectedNodeId}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => setIsDragging(false)}
                    isActive={selectedNodeId === node.id}
                    isHighlighted={highlightedNodes.includes(node.id)}
                />
            );
        })}

        {/* Bees */}
        {BEES.map((bee) => (
          <BeeCharacter key={bee.id} type={bee.type} nodePositions={nodeMotionValues} />
        ))}
      </div>

      {/* Intro Modal */}
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            key="intro-modal"
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#FAF9F6]/90 backdrop-blur-xl"
          >
            <div className="max-w-2xl text-center space-y-8">
              <div className="w-40 h-40 bg-[#FAF9F6]/60 rounded-full mx-auto flex items-center justify-center shadow-2xl mb-8">
                <img src="hive-mind-logo.png" alt="Hive Mind Logo" className="w-40 h-40 text-stone-900" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-5xl md:text-7xl font-serif italic font-bold text-stone-900">The Hive Mind</h1>
                <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-stone-400">Katekani Nyamandi • South Africa</p>
              </div>

              <div className="space-y-6">
                <p className="text-xl md:text-2xl text-stone-800 font-light leading-relaxed">
                  Welcome to my experimental developer portfolio.
                </p>
                <p className="text-sm md:text-base text-stone-600 leading-relaxed max-w-lg mx-auto font-medium">
                  I am a self-taught woman in tech, building systems with curiosity and code. 
                  This site is a living map of my brain, visualizing the connections between my projects, 
                  my explorations, and the engineering philosophy I'm growing into.
                </p>
              </div>

              <div className="pt-6">
                <button 
                  onClick={() => setShowIntro(false)}
                  className="cursor-pointer px-10 py-4 bg-stone-900 text-white rounded-full font-bold uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-xl relative z-10"
                >
                  Enter Mind
                </button>
                <p className="text-[10px] text-stone-400 mt-6 uppercase tracking-widest opacity-60">
                  Interactive Force-Directed Graph • Drag to Explore
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail View */}
      <AnimatePresence>
        {selectedNode && (
          <div 
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-12 bg-stone-900/20 backdrop-blur-sm"
            onClick={() => setSelectedNodeId(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white w-full max-w-5xl h-full max-h-[80vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-full md:w-1/3 p-10 flex flex-col justify-between relative overflow-hidden" style={{ backgroundColor: selectedNode.color }}>
                <div className="relative z-10 space-y-6">
                   <span className="text-xs uppercase tracking-[0.3em] text-stone-900/40 font-black block">{selectedNode.type}</span>
                   <h2 className="text-4xl md:text-5xl font-bold font-serif italic leading-none">{selectedNode.title}</h2>
                   <p className="text-lg text-stone-900/60 font-medium">{selectedNode.subtitle}</p>
                </div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
              </div>
              <div className="w-full md:w-2/3 p-10 md:p-16 overflow-y-auto bg-white flex flex-col">
                 <div className="space-y-8 flex-grow">
                    <div className="text-xl leading-relaxed text-stone-700 font-light whitespace-pre-line">
                      {selectedNode.content}
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {selectedNode.tags.map(tag => (
                         <span key={tag} className="text-[10px] px-4 py-2 bg-stone-50 rounded-full text-stone-500 border border-stone-100 font-bold uppercase tracking-widest">{tag}</span>
                       ))}
                    </div>
                 </div>
                 <div className="pt-10 mt-10 border-t border-stone-100 flex justify-between items-center">
                    <button onClick={() => setSelectedNodeId(null)} className="text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">Close</button>
                    <div className="flex gap-3">
                      {selectedNode.githubLink && (
                          <a href={selectedNode.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-stone-100 text-stone-900 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-stone-200 transition-colors">
                              <Github className="w-4 h-4" /> GitHub
                          </a>
                      )}
                      {selectedNode.projectLink && (
                          <a href={selectedNode.projectLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors">
                              View Project <ArrowRight className="w-4 h-4" />
                          </a>
                      )}
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
