import { useEffect, useRef, useState } from "react";
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  CanvasTexture,
  Color,
  ConeGeometry,
  DoubleSide,
  Fog,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  SpotLight,
  SRGBColorSpace,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Lightbulb, Rotate3D } from "lucide-react";
import "../DiscoBall.css";

const initialColors = ["#ff1688", "#ffb5d2", "#32d5f5"];

function createMirrorTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  const tileSize = 16;
  const palette = ["#c6c4cc", "#77747f", "#edeaf0", "#484550"];

  context.fillStyle = "#17131b";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let rowIndex = 0; rowIndex < canvas.height / tileSize; rowIndex += 1) {
    for (
      let columnIndex = 0;
      columnIndex < canvas.width / tileSize;
      columnIndex += 1
    ) {
      const stagger = rowIndex % 2 === 0 ? 0 : tileSize / 2;
      const x = columnIndex * tileSize + stagger;
      const y = rowIndex * tileSize;
      const paletteIndex = (rowIndex * 3 + columnIndex * 5) % palette.length;
      context.fillStyle = palette[paletteIndex];
      context.fillRect(x + 1, y + 1, tileSize - 2, tileSize - 2);
      context.fillStyle = "rgba(255,255,255,0.48)";
      context.fillRect(x + 2, y + 2, tileSize - 5, 1);
      context.fillStyle = "rgba(10,7,13,0.48)";
      context.fillRect(x + 2, y + tileSize - 3, tileSize - 4, 1);
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function paintGlowTiles(canvas, colors, beatPhase, isOn) {
  const context = canvas.getContext("2d");
  const tileSize = 16;
  const rows = canvas.height / tileSize;
  const columns = canvas.width / tileSize;

  context.fillStyle = "#09070b";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < columns; columnIndex += 1) {
      const x = columnIndex * tileSize;
      const y = rowIndex * tileSize;
      const wave =
        (Math.sin(beatPhase * 2.6 + rowIndex * 0.9 + columnIndex * 1.2) + 1) /
        2;
      const flicker = Math.sin(
        beatPhase * 5 + rowIndex * 1.7 + columnIndex * 0.8,
      );
      const rowColor = colors[(rowIndex + columnIndex) % colors.length];
      const isLit = isOn && (wave > 0.38 || flicker > 0.75);
      context.fillStyle = isLit ? rowColor : "#171119";
      context.globalAlpha = isLit ? 0.9 : 0.26;
      context.fillRect(x + 1, y + 1, tileSize - 2, tileSize - 2);
    }
  }

  context.globalAlpha = 1;
}

function createGlowTexture(colors) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  paintGlowTiles(canvas, colors, 0, false);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export default function DiscoBallSection() {
  const stageRef = useRef(null);
  const engineRef = useRef(null);
  const settingsRef = useRef(null);
  const [isOn, setIsOn] = useState(false);
  const [bpm, setBpm] = useState(112);
  const [brightness, setBrightness] = useState(0.72);
  const [colors, setColors] = useState(initialColors);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  useEffect(() => {
    const host = stageRef.current;
    if (!host) return undefined;

    let renderer;
    let camera;
    let scene;
    let controls;
    let resizeObserver;
    let intersectionObserver;
    let animationFrame = 0;
    let lastFrameTime = 0;
    let isVisible = false;
    let isDisposed = false;
    let lightRig;
    let discoBall;
    let glowTexture;
    let glowLights = [];
    let spotlights = [];
    let beams = [];
    const disposableResources = [];

    function renderFrame() {
      if (!renderer || !scene || !camera || isDisposed) return;
      renderer.render(scene, camera);
    }

    function stopAnimation() {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }

    function updateLightLevels(time) {
      const settings = settingsRef.current;
      const beatDuration = 60000 / settings.bpm;
      const beatPhase = ((time % beatDuration) / beatDuration) * Math.PI * 2;

      const pulseBoost = settings.isOn
        ? 0.7 + Math.max(0.1, Math.cos(beatPhase)) * 0.8
        : 0;

      spotlights.forEach((spotlight, index) => {
        const phase = beatPhase - (index * Math.PI * 2) / spotlights.length;
        const pulse = 0.18 + 0.82 * Math.pow(Math.max(0, Math.cos(phase)), 8);
        const color = settings.colors[index];
        spotlight.color.set(color);
        spotlight.intensity = settings.isOn
          ? 4.8 * settings.brightness * pulse
          : 0;
        beams[index].material.color.set(color);
        beams[index].material.opacity = settings.isOn
          ? 0.1 + settings.brightness * 0.18 * pulse
          : 0;
      });

      glowLights.forEach((light, index) => {
        const color = settings.colors[index % settings.colors.length];
        light.color.set(color);
        light.intensity = settings.isOn
          ? 18 * settings.brightness * (0.5 + pulseBoost)
          : 0;
        light.distance = settings.isOn ? 5.2 + settings.brightness * 2.4 : 0;
      });

      if (discoBall) {
        const glowColor = settings.colors[0];
        discoBall.material.emissive.set(settings.isOn ? glowColor : "#12090e");
        discoBall.material.emissiveIntensity = settings.isOn
          ? 2.2 * settings.brightness + pulseBoost * 2.7
          : 0.06;
      }

      if (glowTexture) {
        paintGlowTiles(
          glowTexture.image,
          settings.colors,
          beatPhase,
          settings.isOn,
        );
        glowTexture.needsUpdate = true;
      }
    }

    function animate(time) {
      animationFrame = 0;
      const settings = settingsRef.current;
      if (isDisposed || !isVisible || !settings.isOn || !renderer) return;

      if (time - lastFrameTime >= 33) {
        const delta = lastFrameTime === 0 ? 33 : time - lastFrameTime;
        lastFrameTime = time;
        updateLightLevels(time);
        lightRig.rotation.y += delta * 0.00016;
        renderer.render(scene, camera);
      }
      animationFrame = window.requestAnimationFrame(animate);
    }

    function syncEngine() {
      if (!renderer) return;
      const settings = settingsRef.current;
      updateLightLevels(performance.now());
      renderFrame();
      if (settings.isOn && isVisible) {
        if (!animationFrame)
          animationFrame = window.requestAnimationFrame(animate);
      } else {
        stopAnimation();
        lastFrameTime = 0;
      }
    }

    function resizeRenderer() {
      if (!renderer || !camera || !host.clientWidth || !host.clientHeight)
        return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight, false);
      renderFrame();
    }

    function initializeScene() {
      if (renderer || isDisposed) return;

      try {
        scene = new Scene();
        scene.background = new Color("#0a070c");
        scene.fog = new Fog("#0a070c", 8, 18);

        camera = new PerspectiveCamera(
          42,
          host.clientWidth / host.clientHeight,
          0.1,
          50,
        );
        camera.position.set(0, 0.45, 5.6);

        renderer = new WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
          preserveDrawingBuffer: import.meta.env.DEV,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
        renderer.setSize(host.clientWidth, host.clientHeight, false);
        renderer.outputColorSpace = SRGBColorSpace;
        renderer.toneMapping = ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        renderer.domElement.className = "disco-canvas";
        renderer.domElement.setAttribute("role", "img");
        renderer.domElement.setAttribute(
          "aria-label",
          "Model bola disko 3D dengan tiga lampu warna yang dapat diputar",
        );
        host.prepend(renderer.domElement);

        scene.add(new AmbientLight("#f4e8f1", 1.05));
        const fillLight = new PointLight("#ff1688", 1.4, 10, 2);
        fillLight.position.set(0, 1.5, 3.5);
        scene.add(fillLight);

        lightRig = new Group();
        scene.add(lightRig);

        const mirrorTexture = createMirrorTexture();
        glowTexture = createGlowTexture(initialColors);
        disposableResources.push(mirrorTexture, glowTexture);
        const ballGeometry = new SphereGeometry(1.02, 48, 32);
        const ballMaterial = new MeshPhysicalMaterial({
          map: mirrorTexture,
          color: "#0d0a10",
          metalness: 0.9,
          roughness: 0.12,
          clearcoat: 1,
          clearcoatRoughness: 0.06,
          emissive: "#ffffff",
          emissiveMap: glowTexture,
          emissiveIntensity: 0.08,
          transparent: true,
          opacity: 0.96,
        });
        discoBall = new Mesh(ballGeometry, ballMaterial);
        discoBall.position.y = 0.25;
        scene.add(discoBall);
        disposableResources.push(ballGeometry, ballMaterial);

        const glowOffsets = [
          new Vector3(0.8, 0.4, 1.3),
          new Vector3(-1.0, -0.15, 1.1),
          new Vector3(0.3, 1.25, -1.2),
        ];
        glowOffsets.forEach((offset, index) => {
          const glowLight = new PointLight(initialColors[index], 0, 8, 2);
          glowLight.position.copy(offset);
          scene.add(glowLight);
          glowLights.push(glowLight);
        });

        const floorRingGeometry = new TorusGeometry(1.58, 0.012, 5, 96);
        const floorRingMaterial = new MeshBasicMaterial({
          color: "#ff1688",
          transparent: true,
          opacity: 0.62,
        });
        const floorRing = new Mesh(floorRingGeometry, floorRingMaterial);
        floorRing.rotation.x = -Math.PI / 2;
        floorRing.position.y = -1.35;
        scene.add(floorRing);
        disposableResources.push(floorRingGeometry, floorRingMaterial);

        const target = new Vector3(0, 0.25, 0);
        const lightOrigins = [
          new Vector3(-2.35, 2.35, 1.1),
          new Vector3(2.35, 2.35, 1.1),
          new Vector3(0, 2.65, -2.2),
        ];

        lightOrigins.forEach((origin, index) => {
          const spotlight = new SpotLight(
            initialColors[index],
            0,
            8,
            Math.PI / 6,
            0.72,
            1.6,
          );
          spotlight.position.copy(origin);
          spotlight.target.position.copy(target);
          lightRig.add(spotlight, spotlight.target);
          spotlights.push(spotlight);

          const beamGeometry = new ConeGeometry(0.48, 3.6, 18, 1, true);
          const beamMaterial = new MeshBasicMaterial({
            color: initialColors[index],
            transparent: true,
            opacity: 0,
            blending: AdditiveBlending,
            side: DoubleSide,
            depthWrite: false,
            toneMapped: false,
          });
          const beam = new Mesh(beamGeometry, beamMaterial);
          beam.position.copy(origin).add(target).multiplyScalar(0.5);
          beam.quaternion.setFromUnitVectors(
            new Vector3(0, 1, 0),
            origin.clone().sub(target).normalize(),
          );
          lightRig.add(beam);
          beams.push(beam);
          disposableResources.push(beamGeometry, beamMaterial);
        });

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = false;
        controls.enablePan = false;
        controls.enableZoom = true;
        controls.minDistance = 3.1;
        controls.maxDistance = 7;
        controls.minPolarAngle = 0.12;
        controls.maxPolarAngle = Math.PI - 0.12;
        controls.target.set(0, 0.15, 0);
        controls.addEventListener("change", renderFrame);
        controls.update();

        resizeRenderer();
        resizeObserver = new ResizeObserver(resizeRenderer);
        resizeObserver.observe(host);
        syncEngine();
      } catch {
        setWebglUnavailable(true);
      }
    }

    if ("IntersectionObserver" in window) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          isVisible = entries.some((entry) => entry.isIntersecting);
          if (isVisible) {
            initializeScene();
            syncEngine();
          } else {
            stopAnimation();
          }
        },
        { threshold: 0.08 },
      );
      intersectionObserver.observe(host);
    } else {
      isVisible = true;
      initializeScene();
    }

    engineRef.current = { sync: syncEngine };

    return () => {
      isDisposed = true;
      stopAnimation();
      intersectionObserver?.disconnect();
      resizeObserver?.disconnect();
      controls?.removeEventListener("change", renderFrame);
      controls?.dispose();
      disposableResources.forEach((resource) => resource.dispose());
      renderer?.dispose();
      renderer?.forceContextLoss();
      renderer?.domElement.remove();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    settingsRef.current = { isOn, bpm, brightness, colors };
    engineRef.current?.sync();
  }, [isOn, bpm, brightness, colors]);

  function updateColor(index, color) {
    setColors((current) =>
      current.map((value, currentIndex) =>
        currentIndex === index ? color : value,
      ),
    );
  }

  return (
    <section aria-labelledby="disco-title" className="section disco-section">
      <div className="section-topline">
        <span className="eyebrow">
          <span className="section-number">04</span> DISCO LIGHT LAB
        </span>
        <span className="section-note">THREE COLORS / YOUR RHYTHM</span>
      </div>
      <div className="disco-heading">
        <div>
          <h2 id="disco-title">
            DISCO <em>ORBIT</em>
          </h2>
          <p>Putar bola disko, pilih warnanya, atur beat-nya.</p>
        </div>
        <span className="disco-drag-note">
          <Rotate3D size={15} /> DRAG TO ORBIT
        </span>
      </div>
      <div className="disco-layout">
        <div className="disco-stage" ref={stageRef}>
          <span className="disco-stage-label">LIVE LIGHT MODEL / 3D</span>
          <span className={`disco-stage-status${isOn ? " is-on" : ""}`}>
            <span /> {isOn ? "LIGHTS ACTIVE" : "STANDBY"}
          </span>
          {webglUnavailable && (
            <p className="disco-fallback">
              WebGL tidak tersedia di browser ini.
            </p>
          )}
        </div>
        <div className="disco-controls">
          <button
            aria-pressed={isOn}
            className={`disco-power${isOn ? " is-on" : ""}`}
            onClick={() => setIsOn((active) => !active)}
            type="button"
          >
            <Lightbulb size={19} />
            <span>{isOn ? "MATIKAN LAMPU" : "NYALAKAN LAMPU"}</span>
            <span className="disco-switch-indicator" />
          </button>

          <label className="disco-range-label" htmlFor="disco-bpm">
            <span>BEAT / MENIT</span>
            <strong>{bpm} BPM</strong>
          </label>
          <input
            id="disco-bpm"
            className="disco-range"
            type="range"
            min="60"
            max="180"
            step="1"
            value={bpm}
            onChange={(event) => setBpm(Number(event.target.value))}
          />
          <div className="disco-range-ends">
            <span>60 BPM</span>
            <span>180 BPM</span>
          </div>

          <label className="disco-range-label" htmlFor="disco-brightness">
            <span>BRIGHTNESS</span>
            <strong>{Math.round(brightness * 100)}%</strong>
          </label>
          <input
            id="disco-brightness"
            className="disco-range"
            type="range"
            min="0.15"
            max="1"
            step="0.01"
            value={brightness}
            onChange={(event) => setBrightness(Number(event.target.value))}
          />
          <div className="disco-range-ends">
            <span>LOW</span>
            <span>MAX</span>
          </div>

          <fieldset className="disco-colors">
            <legend>
              LIGHT COLORS <span>MAX 3</span>
            </legend>
            <div className="disco-color-list">
              {colors.map((color, index) => (
                <label
                  className="disco-color"
                  htmlFor={`disco-color-${index}`}
                  key={index}
                >
                  <span>LIGHT 0{index + 1}</span>
                  <input
                    id={`disco-color-${index}`}
                    type="color"
                    value={color}
                    onChange={(event) => updateColor(index, event.target.value)}
                    aria-label={`Warna lampu ${index + 1}`}
                  />
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
    </section>
  );
}
