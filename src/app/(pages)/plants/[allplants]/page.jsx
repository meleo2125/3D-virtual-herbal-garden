"use client";
import { useParams } from 'next/navigation';
import React, { useEffect, useState, Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Dialog } from '@headlessui/react';
import { plants } from '../../../utils/plantdata';
import ImageCarousel from '../../../component/ImageCarousel'; // Adjust based on the actual relative path
import * as THREE from 'three';

const PlantDetails = () => {
  const { allplants } = useParams();
  const [plantData, setPlantData] = useState(null);
  const [isFullView, setIsFullView] = useState(false);
  const [modelVisible, setModelVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(null); // For tracking which section to zoom

  const canvasRef = useRef();

  useEffect(() => {
    if (allplants) {
      const plant = plants[allplants.toLowerCase()];
      if (plant) {
        setPlantData(plant);
        setModelVisible(true);
      } else {
        setPlantData(null);
      }
      setLoading(false);
    }
  }, [allplants]);

  const handleCloseFullView = () => {
    setIsFullView(false);
    setModelVisible(true);
  };
  const modelUrl = useMemo(() => (plantData ? plantData.modelUrl : null), [plantData]);

  if (loading) return <LoadingAnimation />;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-green-700">
      {/* Left section: Model */}
      <div className="md:w-1/3 p-5 relative flex flex-col items-center justify-between h-[500px] border-r-4 border-green-700"> {/* Set fixed height */}
  {modelVisible && (
    <Canvas
      className="h-[60%] bg-white rounded-lg shadow-lg" // Adjust height percentage
      camera={{ position: [0, 0, 8], fov: 40 }}
      ref={canvasRef}
    >
      <ambientLight />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <Suspense fallback={null}>
        <Model url={plantData.modelUrl} scale={4} currentSection={currentSection} isFullView={isFullView} />
      </Suspense>
      <OrbitControls enableZoom={isFullView} />
    </Canvas>
  )}
  <button
    onClick={() => {
      setIsFullView(true);
      setModelVisible(false);
    }}
    className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition"
  >
    Full View
  </button>
</div>


      {/* Right section: Button Controls */}
      <div className="md:w-2/3 p-8 overflow-y-auto scrollable">
        <h1 className="text-4xl font-bold text-yellow-500">{plantData.title}</h1>
        <p className="mt-6 text-lg leading-relaxed">{plantData.description}</p>
        {/* Add separation using margins */}
        <div className="mt-8 border-t border-yellow-500 pt-4">
          <h2 className="text-2xl font-bold">Botanical Name</h2>
          <p>{plantData.botanicalName}</p>
        </div>

        <div className="mt-4 border-t border-yellow-500 pt-4">
          <h2 className="text-2xl font-bold">Common Names</h2>
          <p>{plantData.commonNames.join(', ')}</p>
        </div>

        <div className="mt-4 border-t border-yellow-500 pt-4">
          <h2 className="text-2xl font-bold">Habitat</h2>
          <p>{plantData.habitat}</p>
        </div>

        <div className="mt-4 border-t border-yellow-500 pt-4">
          <h2 className="text-2xl font-bold">Theme</h2>
          <p>{plantData.theme}</p>
        </div>

        <div className="mt-4 border-t border-yellow-500 pt-4">
          <h2 className="text-2xl font-bold">Mostly Used In</h2>
          <p>{plantData.mostlyUsedIn.join(', ')}</p>
        </div>

        <div className="mt-4 border-t border-yellow-500 pt-4">
          <h2 className="text-2xl font-bold">Medicinal Uses</h2>
          <p>{plantData.medicinalUses}</p>
        </div>

        <div className="mt-4 border-t border-yellow-500 pt-4">
          <h2 className="text-2xl font-bold">Methods of Cultivation</h2>
          <p>{plantData.methodsOfCultivation}</p>
        </div>
        
        <div className="mt-4 border-t border-yellow-500 pt-4">
          <h2 className="text-2xl font-bold mb-4">Images</h2>
          <ImageCarousel folderPath={`/assets/img/${allplants.toLowerCase()}`} />
        </div>

        <div className="mt-4 border-t border-yellow-500 pt-4">
          <h2 className="text-2xl font-bold">Leaf</h2>
          <p>{plantData.leaf.description}</p>
          <p>{plantData.leaf.benefits}</p>
        </div>
        <button
          onClick={() => setCurrentSection('leaf')}
          className="mt-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
        >
          Zoom to Leaf
        </button>

        <div className="mt-4 border-t border-yellow-500 pt-4">
          <h2 className="text-2xl font-bold">Stem</h2>
          <p>{plantData.stem.description}</p>
          <p>{plantData.stem.benefits}</p>
        </div>
        {/* Button to zoom to Stem */}
        <button
          onClick={() => setCurrentSection('stem')}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Zoom to Stem
        </button>
        <div className="mt-4 border-t border-yellow-500 pt-4">
          <h2 className="text-2xl font-bold">Flower</h2>
          <p>{plantData.flower.description}</p>
          <p>{plantData.flower.benefits}</p>
        </div>
        {/* Button to zoom to Flower */}
        <button
          onClick={() => setCurrentSection('flower')}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
        >
          Zoom to Flower
        </button>
        <div className="mt-8 border-t border-yellow-500 pt-4">
  <h2 className="text-2xl font-bold">Watch the Video</h2>
  {plantData.link ? (
    <iframe
      width="50%"
      height="315"
      src={`https://www.youtube.com/embed/${plantData.link.split('/').pop()}`}
      title="YouTube video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  ) : (
    <p>No video available</p>
  )}
</div>

  </div>

{/* Full View Modal */}
{isFullView && (
  <Dialog
    open={isFullView}
    onClose={handleCloseFullView}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div className="relative bg-white w-[90%] h-[90%] md:w-[70%] md:h-[80%] p-5 rounded-lg shadow-xl">
      <button
        onClick={handleCloseFullView}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
        aria-label="Close"
      >
        &times; {/* "X" symbol */}
      </button>
      <Canvas className="h-full w-full bg-white rounded-lg shadow-lg" camera={{ position: [0, 0, 10], fov: 20 }}>
        <ambientLight />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Suspense fallback={null}>
          <Model url={plantData.modelUrl} scale={3} isFullView={isFullView} />
        </Suspense>
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  </Dialog>
)}
</div>

  );
};

// Loading Animation Component
const LoadingAnimation = () => (
  <div className="flex items-center justify-center h-screen bg-[rgb(100, 200, 100)]">
    <div className="loader"></div>
  </div>
);

// Model component to load GLTF models and control the scale
const Model = ({ url, currentSection, isFullView }) => {
  const { scene } = useGLTF(url);
  const leafRef = useRef();
  const stemRef = useRef();
  const flowerRef = useRef();
  const [modelScale, setModelScale] = useState([1, 1, 1]);

  // Compute model's bounding box and adjust scale
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene); // Compute bounding box of the model
    const size = new THREE.Vector3();
    box.getSize(size); // Get the size of the model in each dimension

    // Compute scale based on the largest dimension and the size of the window or Canvas container
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scaleFactor = isFullView ? 1 / maxDimension * 8 : 1 / maxDimension * 4; // Adjust based on full view or normal view

    setModelScale([scaleFactor, scaleFactor, scaleFactor]); // Set uniform scale for all axes
  }, [scene, isFullView]);

  // Find specific parts of the model using object names
  useEffect(() => {
    leafRef.current = scene.getObjectByName('Leaff');
    stemRef.current = scene.getObjectByName('Stemsss');
    flowerRef.current = scene.getObjectByName('flower');
  }, [scene]);

  // Stop rotation and apply zoom for specific sections
  useFrame((state) => {
    if (!isFullView && !currentSection) {
      scene.rotation.y += 0.01; // Continue rotating if not zooming
    }

    // Zoom to Leaf
    if (currentSection === 'leaf' && leafRef.current) {
      state.camera.lookAt(leafRef.current.position);
      state.camera.position.set(
        leafRef.current.position.x,
        leafRef.current.position.y + 2,
        leafRef.current.position.z
      );
      state.camera.rotation.set(-Math.PI / 2, 0, 0);
    }

    // Zoom to Stem
    else if (currentSection === 'stem' && stemRef.current) {
      state.camera.lookAt(stemRef.current.position);
      state.camera.position.set(
        stemRef.current.position.x,
        stemRef.current.position.y + 2,
        stemRef.current.position.z
      );
      state.camera.rotation.set(-Math.PI / 2, 0, 0);
    }

    // Zoom to Flower
    else if (currentSection === 'flower' && flowerRef.current) {
      state.camera.lookAt(flowerRef.current.position);
      state.camera.position.set(
        flowerRef.current.position.x,
        flowerRef.current.position.y + 3,
        flowerRef.current.position.z
      );
      state.camera.rotation.set(-Math.PI / 2, 0, 0);
    }
  });

  return <primitive object={scene} scale={modelScale} position={[0, -1, 0]} />;
};



export default PlantDetails;
