
import { Canvas } from '@react-three/fiber';
import { Starfield, ShootingStars } from './Starfield';
import './index.css';

function App() {
  return (
    <div className="poster-container">

      {/* Background Animation */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
          <color attach="background" args={['#020617']} /> {/* Deep space blue */}
          <Starfield />
          <ShootingStars />
        </Canvas>
      </div>

      {/* Foreground Logo */}
      <div className="logo-overlay">
        <img src="/image.png" alt="180 Math Logo" className="logo-image" />
      </div>

    </div>
  );
}

export default App;
