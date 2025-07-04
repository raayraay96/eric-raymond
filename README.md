# 🤖 Eric Raymond – AI/ML Developer Portfolio

Welcome! This is my **developer portfolio site** featuring an **interactive 3D robotic arm** that showcases my expertise in robotics, ROS, and human-robot interaction systems.

> **🎯 Live Demo:** [View the interactive 3D robotic arm in action!](https://raayraay96.github.io/eric-raymond/)

---

## ✨ Key Features

### 🦾 **Interactive 3D Robotic Arm**
- **Real-time cursor tracking** with smooth inverse kinematics
- **6-DOF articulated arm** with realistic joint movements  
- **Professional lighting & shadows** using Three.js
- **Responsive design** that works on all devices
- **Demonstrates real-world robotics concepts** from my research

### 💼 **Professional Portfolio**
- Clean, modern React + TypeScript architecture
- Responsive design with Tailwind CSS
- Automated GitHub Pages deployment
- Performance-optimized 3D rendering

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** for robust component architecture
- **Vite** for lightning-fast development and building
- **Three.js + React Three Fiber** for 3D graphics and robotics simulation
- **Tailwind CSS** for responsive, atomic styling
- **Framer Motion** for smooth animations and transitions

### 3D Graphics & Robotics
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers and abstractions
- **Custom inverse kinematics** implementation
- **Real-time mouse tracking** and coordinate transformation
- **Smooth interpolated joint movements** with realistic physics

### Deployment & DevOps
- **GitHub Actions** for automated CI/CD
- **GitHub Pages** for free, fast hosting
- **ESLint + Prettier** for code quality
- **TypeScript** for type safety across the stack

---

## 🎯 Robotics Showcase

This portfolio demonstrates practical skills from my research:

### 🎓 **University of Wyoming REU** 
- Developed ML control algorithms for real-time robotic imitation
- Enhanced system responsiveness by 40%
- Integrated MonoDepth2 for depth perception

### 🔬 **Technical Implementations**
- **Inverse Kinematics**: 6-DOF arm with realistic joint constraints
- **Real-time Control**: Smooth cursor-to-3D coordinate transformation
- **Performance Optimization**: 60fps 3D rendering with efficient algorithms
- **Responsive Design**: Works seamlessly across desktop and mobile

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/raayraay96/eric-raymond.git
cd eric-raymond

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

### Development
```bash
# Frontend development (with hot reload)
cd frontend
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🎨 3D Robotic Arm Features

### Real-time Inverse Kinematics
- **Base Joint**: Rotates to follow horizontal mouse movement
- **Shoulder Joint**: Primary vertical articulation
- **Elbow Joint**: Secondary positioning with realistic constraints  
- **Wrist Joint**: Fine positioning and end-effector orientation
- **End Effector**: Targeting system with visual laser guide

### Visual Elements
- **Professional Materials**: Metallic finishes with proper PBR shading
- **Dynamic Lighting**: Directional and ambient lighting for depth
- **Contact Shadows**: Ground plane shadows for spatial awareness
- **Color-coded Joints**: Each joint has distinct colors for clarity
- **Smooth Animations**: Linear interpolation for realistic movement

---

## 📈 Performance Optimizations

- **Efficient Rendering**: Optimized Three.js scene with 60fps target
- **Smart Updates**: Only recalculates IK when mouse moves
- **Responsive Loading**: Progressive enhancement for mobile devices
- **Memory Management**: Proper cleanup and resource disposal
- **Code Splitting**: Lazy loading for optimal bundle sizes

---

## 🏗️ Architecture

```
frontend/
├── src/
│   ├── components/
│   │   ├── RoboticArmScene.tsx    # 3D arm implementation
│   │   └── Navbar.tsx
│   ├── hooks/
│   │   └── useMousePosition.tsx    # Mouse tracking logic
│   ├── pages/
│   │   ├── Home.tsx               # Main page with 3D showcase
│   │   ├── About.tsx
│   │   └── Portfolio.tsx
│   └── styles/
│       └── Home.css               # Enhanced 3D styling
├── package.json                   # Dependencies including Three.js
└── vite.config.ts
```

---

## 🌟 Deployment

This site automatically deploys to GitHub Pages via GitHub Actions:

1. **Push to main** triggers the deployment workflow
2. **Build process** compiles TypeScript and optimizes assets  
3. **Deploy** to GitHub Pages with custom domain support
4. **Live in seconds** with global CDN distribution

---

## 🎯 Professional Impact

This portfolio showcases:

- **Technical Excellence**: Complex 3D programming with performance optimization
- **User Experience**: Intuitive, engaging interface design
- **Engineering Practices**: Clean architecture, type safety, automated deployment
- **Domain Expertise**: Real robotics knowledge applied to web development
- **Innovation**: Creative use of web technologies to demonstrate technical skills

---

## 📞 Contact

**Eric Raymond**  
📧 erraymon@iu.edu  
📱 (317) 835-5211  
🌐 [Portfolio Site](https://raayraay96.github.io/eric-raymond/)  
💼 [LinkedIn](https://linkedin.com/in/eric–raymond)

---

## 📄 License

MIT © 2025 Eric Raymond

---

**⚡ Ready to see robotics in action? [Visit the live site!](https://raayraay96.github.io/eric-raymond/)**