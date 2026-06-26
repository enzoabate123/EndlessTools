"use client";

import { Suspense, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Grid } from "@react-three/drei";
import { Leva, useControls } from "leva";
import { Settings, Layers, Download, Video, Code } from "lucide-react";
import ShareModal from "@/components/ShareModal";
import { levaStore } from "leva";
import ToolsSidebar from "@/components/ToolsSidebar";
import ToolRenderer from "@/components/ToolRenderer";
import { useToolStore } from "@/store/useToolStore";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";

export default function Home() {
  const { activeSidebarTab } = useToolStore();
  const [isRecording, setIsRecording] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [embedCode, setEmbedCode] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const generateEmbed = () => {
    const storeState = useToolStore.getState();
    const levaData = levaStore.getData();

    // Extract values from Leva store
    const levaValues: Record<string, unknown> = {};
    for (const key in levaData) {
      if (levaData[key] && 'value' in levaData[key]) {
        levaValues[key] = levaData[key].value;
      }
    }

    const stateToEncode = {
      toolStore: {
        activeGeometry: storeState.activeGeometry,
        activeMaterial: storeState.activeMaterial,
        activeFilters: storeState.activeFilters,
      },
      levaStore: levaValues
    };

    const base64State = btoa(JSON.stringify(stateToEncode));

    // Create the iframe code
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const iframeCode = `<iframe src="${origin}/embed?state=${base64State}" width="100%" height="500px" frameborder="0" style="border: 1px solid #333; border-radius: 12px; overflow: hidden;"></iframe>`;

    setEmbedCode(iframeCode);
    setIsShareModalOpen(true);
  };

  const startRecording = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const stream = canvas.captureStream(60);
    const options = { mimeType: 'video/webm; codecs=vp9' };
    let mediaRecorder: MediaRecorder;
    try {
      mediaRecorder = new MediaRecorder(stream, options);
    } catch (e) {
      mediaRecorder = new MediaRecorder(stream);
    }

    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'endless-tools-loop.webm';
      a.click();
      URL.revokeObjectURL(url);
      setIsRecording(false);
    };

    mediaRecorder.start();
    setIsRecording(true);

    setTimeout(() => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    }, 5000);
  };


  const { lightX, lightY, contrast, focalLength, aperture } = useControls('Lighting Studio', {
    lightX: { value: 10, min: -20, max: 20 },
    lightY: { value: 10, min: -20, max: 20 },
    contrast: { value: 1.5, min: 0.1, max: 5 },
    focalLength: { value: 0.02, min: 0.0, max: 0.1 },
    aperture: { value: 2.0, min: 0.0, max: 10.0 }
  });

  return (
    <main className="flex h-screen w-screen bg-[#0a0a0a] text-white">
      {/* Sidebar for Navigation / Tool Selection */}
      <ToolsSidebar />

      {/* Main Viewport */}
      <div className="flex-1 relative flex flex-col">
        {/* Top Header / Export Bar */}
        <header className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto bg-[#1a1a1a] px-4 py-2 rounded-full ring-1 ring-white/10">
            <Layers className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium capitalize">{activeSidebarTab?.replace("-", " ") || "Select a Tool"}</span>
          </div>
          
          <div className="flex items-center gap-3 pointer-events-auto">
             <button className="bg-[#1a1a1a] hover:bg-[#2a2a2a] p-2 rounded-full ring-1 ring-white/10 transition">
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={generateEmbed}
              className="bg-[#1a1a1a] hover:bg-[#2a2a2a] p-2 rounded-full font-medium text-sm flex items-center gap-2 transition ring-1 ring-white/10 text-white"
            >
              <Code className="w-4 h-4" />
              Embed
            </button>
            <button
              onClick={startRecording}
              disabled={isRecording}
              className={`px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white ring-1 ring-white/10'}`}
            >
              <Video className="w-4 h-4" />
              {isRecording ? "Recording..." : "Record Loop"}
            </button>
            <button
              onClick={() => {
                const canvas = document.querySelector('canvas');
                if (canvas) {
                  const dataURL = canvas.toDataURL("image/png");
                  const link = document.createElement('a');
                  link.download = 'endless-tools-export.png';
                  link.href = dataURL;
                  link.click();
                }
              }}
              className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </header>

        {/* 3D Canvas */}
        <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing">
          <Canvas shadows
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ preserveDrawingBuffer: true, antialias: true }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <Environment preset="city" />
              {/* SoftShadows is incompatible with Three.js v0.185.0 shader chunks */}
              {/* <SoftShadows size={25} samples={10} focus={0.5} /> */}
              <ambientLight intensity={0.5 / contrast} />
              <directionalLight
                castShadow
                position={[lightX, lightY, 5]}
                intensity={1 * contrast}
                shadow-mapSize={[2048, 2048]}
              >
                <orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5, 1, 50]} />
              </directionalLight>
              
              <ToolRenderer />
              
              <OrbitControls makeDefault />
              <Grid 
                infiniteGrid 
                fadeDistance={20} 
                sectionColor="#333" 
                cellColor="#111" 
                position={[0, -1.5, 0]} 
              />
              <EffectComposer>
                <DepthOfField focusDistance={0} focalLength={focalLength} bokehScale={aperture} height={480} />
              </EffectComposer>
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Right Sidebar for Leva Controls */}
      <div className="w-[300px] border-l border-white/10 bg-[#0f0f0f] relative z-20">
         <Leva 
            fill 
            titleBar={{ title: 'Properties' }} 
            theme={{ colors: { elevation1: 'transparent', elevation2: 'transparent' } }}
            flat
          />
      </div>
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        embedCode={embedCode}
      />
    </main>
  );
}
