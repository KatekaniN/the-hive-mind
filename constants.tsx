
import React from 'react';
import { Bee, NodeItem } from './types';
import { 
  Palette, 
  Terminal, 
  Shapes, 
  Layers, 
  Sprout, 
  Users,
  Compass,
  Bug,
  Icon
} from 'lucide-react';
import { bee } from '@lucide/lab';

export const BEES: Bee[] = [
  {
    id: 'b1',
    type: 'frontend',
    label: 'The Interface Weaver',
    description: 'Crafting the visual logic that connects users to data.',
    personality: 'Obsessed with the tactile feel of digital interactions.'
  },
  {
    id: 'b2',
    type: 'backend',
    label: 'The Logic Loom',
    description: 'Constructing robust, invisible architectures.',
    personality: 'Patiently debugging the deep layers.'
  },
  {
    id: 'b3',
    type: 'logic',
    label: 'The Pattern Finder',
    description: 'Breaking down complex systems into modular units.',
    personality: 'Strategic, methodical, and efficient.'
  },
  {
    id: 'b4',
    type: 'debug',
    label: 'The Resilience Engine',
    description: 'Turning system failures into learning milestones.',
    personality: 'Persistent and unfazed by a 500 error.'
  },
  {
    id: 'b5',
    type: 'growth',
    label: 'The Forever Student',
    description: 'Bridging practical experiments with computer science theory.',
    personality: 'Driven by the "why" as much as the "how".'
  }
];

export const NODES: NodeItem[] = [
  {
    id: 'n0',
    title: 'The Core Mind',
    subtitle: 'About Katekani',
    content: `I’m Katekani, a self-taught software developer with a background in creative problem-solving and a growing love for engineering fundamentals.

I don’t know everything yet. What I do have is curiosity, persistence, and a deep respect for how software systems work beneath the surface.

This portfolio is a living map of how I think, what I’m learning, and the kinds of problems I enjoy solving. Some nodes represent things I’ve built. Others represent ideas I’m still growing into.`,
    tags: ['Self-taught', 'Curious', 'Builder', 'Learning in public'],
    x: 50,
    y: 50,
    color: '#FAF9F6',
    type: 'philosophy'
  },
  {
    id: 'n1',
    title: 'How My Mind Works',
    subtitle: 'Systems over shortcuts',
    content: `I like understanding how small pieces interact to create larger behavior. When I learn something new, I break it apart, rebuild it, and test what happens when it fails. That process matters more to me than quick wins.

I’m especially drawn to backend systems, state management, and interfaces that feel alive but remain predictable. Although I am still discovering my niche in software engineering, I know I want to build technology that lasts.`,
    tags: ['Systems', 'Backend', 'Architecture'],
    x: 30,
    y: 30,
    color: '#F3E8FF',
    type: 'philosophy'
  },
  {
    id: 'n2',
    title: 'Why Computer Science',
    subtitle: 'From self-teaching to solid foundations',
    content: `Teaching myself to code showed me how powerful software can be. It also showed me the gaps in my understanding. I can build interfaces, wire APIs, and ship features, but I want to understand why systems behave the way they do.

I want formal computer science education so I can reason about performance, correctness, data structures, and trade-offs with confidence. Not just make things work, but make them work well.
 I want to grow into an engineer who contributes thoughtfully to real-world systems.`,
    tags: ['Education', 'Motivation', 'Fundamentals'],
    x: 70,
    y: 30,
    color: '#E0E7FF',
    type: 'goal'
  },
  {
    id: 'n3',
    title: 'The Growth Pipeline',
    subtitle: 'What I’m learning now',
    content: `I’m actively strengthening my foundations.

Right now I’m focused on:
• Data structures and algorithms
• JavaScript internals
• State management patterns
• Reading other people’s code`,
    tags: ['DSA', 'Fundamentals', 'Consistency'],
    x: 80,
    y: 60,
    color: '#FFEDD5',
    type: 'goal'
  },
  {
    id: 'n4',
    title: 'Experiments & Curiosity',
    subtitle: 'Learning by building',
    content: `Some projects start with a goal. Others start with a question.
I use experiments to understand concepts like layout systems, state flow, animations, and API design. Not all of them are polished, but all of them taught me something.`,
    tags: ['Experiments', 'Curiosity', 'Learning'],
    x: 20,
    y: 60,
    color: '#DCFCE7',
    type: 'experiment'
  },
  {
    id: 'n5',
    title: 'System Ethics',
    subtitle: 'Responsibility in software',
    content: `Software decisions affect real people. I care about accessibility, clarity, and building systems that don’t exclude users by default. This mindset influences how I design interfaces and think about technology long-term.`,
    tags: ['A11y', 'Ethics', 'Responsibility'],
    x: 40,
    y: 80,
    color: '#FCE7F3',
    type: 'philosophy'
  },
  {
    id: 'n6',
    title: 'Project: GitHub API Consumer',
    subtitle: 'Systems & APIs',
    content: `This project helped me understand asynchronous programming, error handling, and performance trade-offs.

I built caching into the system after noticing repeated API calls slowed the experience. Load times improved significantly, and I learned how small architectural decisions compound over time.

What I learned:
• Async JavaScript patterns
• API rate limits
• Writing maintainable logic
• Testing with Jasmine`,
    tags: ['Async', 'API', 'Performance'],
    x: 60,
    y: 80,
    color: '#E0E7FF',
    type: 'project',
    projectLink: 'https://consume-frontend.onrender.com/',
    githubLink: 'https://github.com/KatekaniN/consume-backend'
  },
  {
    id: 'n7',
    title: 'Project: Cadbury Globe',
    subtitle: 'Creative AI Experiments',
    content: `I wanted to explore how AI could be playful and human rather than purely technical.

This project combines computer vision with user experience design to make mood detection feel friendly instead of invasive.

What I learned:
• Integrating external AI APIs
• Designing for user trust
• Balancing novelty with usefulness`,
    tags: ['AI', 'UX', 'Computer Vision'],
    x: 85,
    y: 80,
    color: '#F3E8FF',
    type: 'project',
    projectLink: 'https://cadbury-globe-frontend.onrender.com/',
  },
  {
    id: 'n8',
    title: 'Project: Plantly - Plant Care Assistant',
    subtitle: 'Learning in Public',
    content: `This project pushed me outside my comfort zone. I learned React Native while building it, which meant learning and failing at the same time.
Seeing someone actually use it successfully reminded me why I want to build technology that helps people in small, practical ways.`,
    tags: ['React Native', 'Mobile', 'Product'],
    x: 15,
    y: 45,
    color: '#DCFCE7',
    type: 'project',
    projectLink: 'https://katekanin.github.io/plantly-website/',
    githubLink: 'https://github.com/KatekaniN/plantly'
  },
  {
    id: 'n9',
    title: 'What I’m Working Toward',
    subtitle: 'Long-term direction',
    content: `I want to become an engineer who understands systems deeply, communicates clearly, and builds technology responsibly.
I’m early in my journey, but I’m serious about learning and contributing.`,
    tags: ['Vision', 'Engineering', 'Future'],
    x: 50,
    y: 20,
    color: '#FFEDD5',
    type: 'goal'
  }
];

export const getBeeIcon = (type: string) => {
  return <Icon iconNode={bee} className="w-6 h-6 text-stone-900 fill-white" />;
};
