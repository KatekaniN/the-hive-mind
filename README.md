# The Hive Mind 

An experimental, non-linear developer portfolio for **Katekani Nyamandi**.

Instead of a traditional static list of projects, this site visualizes my skills, projects, and engineering philosophy as a **living, force-directed graph**. It represents how I think: connecting concepts, building systems, and constantly evolving.

![Hive Mind Preview](/hive-mind-logo.png)

## The Concept

The "Hive Mind" is built on the idea that knowledge is interconnected.

- **Nodes** represent Projects, Philosophies, and Goals.
- **Bees** (autonomous agents) represent the different "workers" in my brain (Frontend, Backend, Logic, Debugging) constantly tending to these ideas.
- **Physics** drive the layout—nodes repel and attract based on relationships, creating a unique layout every time.

## Features

- **Custom Physics Engine**: A lightweight force-directed graph implementation using `requestAnimationFrame` (no heavy graph libraries).
- **Autonomous Agents**: "Worker Bees" that navigate the graph independently using vector math.
- **Performance Optimized**: Uses `Framer Motion`'s `MotionValue` and `useRef` to bypass React's render cycle for 60fps physics simulations.
- **Interactive UI**: Drag nodes, filter by category, and explore deep-dives into specific projects.
- **Responsive Design**: Collapsible "Mind Activity" sidebar and mobile-friendly interactions.

## Tech Stack

- **Core**: React 18, TypeScript, Vite
- **Animation & Physics**: Framer Motion
- **Styling**: Tailwind CSS
- **Icons**: Lucide React & Lucide Lab

## Running Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/katekaniN/the-hive-mind.git
   cd the-hive-mind
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

- `App.tsx`: Main entry point containing the physics engine loop and rendering logic.
- `constants.tsx`: Configuration for Nodes (Projects/Data) and Bees (Agents).
- `types.ts`: TypeScript definitions for the system.

## Author

**Katekani Nyamandi**  
_Aspiring Software Engineer | South Africa_
