"use client";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const ParticlesComponent = () => {
  const particlesInit = useCallback(async (engine) => {
    try {
      await loadSlim(engine);
    } catch (error) {
      console.error("Error loading particles.js:", error);
    }
  }, []);

  return (
    <Particles
      id="tsparticles"
      className="absolute inset-0"
      init={particlesInit}
      options={{
        background: { color: "#E7E7E3" },
        particles: {
          number: { value: 180, density: { enable: true, value_area: 950 } },
          color: { value: ["#4ca6ff", "#00cc99", "#66d9ff"] },
          shape: { type: "circle" },
          opacity: { value: 0.6, random: true },
          size: { value: 4, random: true },
          move: { enable: true, speed: 0.4, outModes: "out" },
          links: {
            enable: true,
            distance: 180,
            color: "#4ca6ff",
            opacity: 0.4,
            width: 1,
          },
        },
        interactivity: {
          events: { onHover: { enable: true, mode: "grab" } },
          modes: { repulse: { distance: 150, duration: 0.4 } },
        },
      }}
    />
  );
};

export default ParticlesComponent;
