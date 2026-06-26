"use client";

import { useControls } from "leva";
import { useToolStore } from "@/store/useToolStore";
import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from "three-mesh-bvh";

// Extend THREE.BufferGeometry with BVH methods
// @ts-expect-error extending three buffer geometry prototype with three-mesh-bvh methods
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
THREE.Mesh.prototype.raycast = acceleratedRaycast;

interface LegoLandscapeToolProps {
  baseMeshRef?: React.RefObject<THREE.Mesh | null>;
  children?: React.ReactNode;
}

export default function LegoLandscapeTool({ baseMeshRef, children }: LegoLandscapeToolProps) {
  const activeSidebarTab = useToolStore((s) => s.activeSidebarTab);
  const renderControls = activeSidebarTab === "lego-landscape";
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const [positions, setPositions] = useState<THREE.Vector3[]>([]);
  const { invalidate } = useThree();

  const { blockSize, height } = useControls(
    "Lego Landscape",
    {
      blockSize: { value: 0.2, min: 0.05, max: 1 },
      height: { value: 1, min: 0.1, max: 5 },
    },
    { render: () => renderControls }
  );

  const [childrenHash, setChildrenHash] = useState<string>("");
  const [baseRotationX, setBaseRotationX] = useState(0);
  const [baseRotationY, setBaseRotationY] = useState(0);

  // Watch for changes in the children hierarchy and rotation
  useFrame(() => {
    if (baseMeshRef?.current) {
      let hash = "";
      baseMeshRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.type === "InstancedMesh" || child.name === "outlines") return;
          hash += `${child.uuid}-${child.geometry?.uuid || ""}-`;
        }
      });
      if (hash !== childrenHash) {
        setChildrenHash(hash);
      }
      
      // Also sync rotation if the base mesh is being animated
      if (baseMeshRef.current.rotation.x !== baseRotationX || baseMeshRef.current.rotation.y !== baseRotationY) {
         setBaseRotationX(baseMeshRef.current.rotation.x);
         setBaseRotationY(baseMeshRef.current.rotation.y);
      }
    }
  });

  useEffect(() => {
    if (!baseMeshRef?.current) return;

    const baseMesh = baseMeshRef.current;
    const testMeshes: THREE.Mesh[] = [];
    const boundingBox = new THREE.Box3();
    let hasGeometry = false;

    // Traverse the base mesh group to collect all child meshes/geometries
    baseMesh.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        // Skip system/helper meshes
        if (child.type === "InstancedMesh" || child.name === "outlines") return;

        const geometry = child.geometry.clone();
        if (!geometry.attributes || !geometry.attributes.position) {
          geometry.dispose();
          return;
        }

        // Create a temporary mesh and bake world matrix transformations
        const testMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
        testMesh.applyMatrix4(child.matrixWorld);
        testMeshes.push(testMesh);

        // Compute union bounding box
        geometry.computeBoundingBox();
        if (geometry.boundingBox) {
          const tempBox = geometry.boundingBox.clone().applyMatrix4(child.matrixWorld);
          boundingBox.union(tempBox);
          hasGeometry = true;
        }
      }
    });

    if (!hasGeometry || testMeshes.length === 0) return;

    const validPositions: THREE.Vector3[] = [];
    const raycaster = new THREE.Raycaster();
    
    // A point outside the bounding box to shoot rays from
    const outPoint = new THREE.Vector3(
      boundingBox.max.x + 10,
      boundingBox.max.y + 10,
      boundingBox.max.z + 10
    );

    const dir = new THREE.Vector3();

    for (let x = boundingBox.min.x; x <= boundingBox.max.x; x += blockSize) {
      for (let y = boundingBox.min.y; y <= boundingBox.max.y; y += blockSize) {
        for (let z = boundingBox.min.z; z <= boundingBox.max.z; z += blockSize) {
          const point = new THREE.Vector3(x, y, z);
          dir.subVectors(outPoint, point).normalize();
          raycaster.set(point, dir);

          // Raycast against all compiled test meshes
          const intersects = raycaster.intersectObjects(testMeshes);

          // If the number of intersections is odd, the point is inside the collective geometry
          if (intersects.length % 2 !== 0) {
            validPositions.push(new THREE.Vector3(x, y * height, z));
          }
        }
      }
    }

    setPositions(validPositions);

    // Clean up temporary geometries
    testMeshes.forEach((m) => m.geometry.dispose());

  }, [baseMeshRef, childrenHash, blockSize, height, baseRotationX, baseRotationY]);

  // Update InstancedMesh matrices
  useEffect(() => {
    if (instancedMeshRef.current && positions.length > 0) {
      const dummy = new THREE.Object3D();
      positions.forEach((pos, i) => {
        dummy.position.copy(pos);
        dummy.updateMatrix();
        instancedMeshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
      invalidate();
    }
  }, [positions, invalidate]);

  const boxGeometry = useMemo(() => new THREE.BoxGeometry(blockSize, blockSize * height, blockSize), [blockSize, height]);
  const tempMaterial = useMemo(() => new THREE.MeshStandardMaterial(), []);

  // Clean up geometry on unmount/recreate
  useEffect(() => {
    return () => {
      boxGeometry.dispose();
    };
  }, [boxGeometry]);

  if (positions.length === 0) return null;

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[boxGeometry, tempMaterial, positions.length]}
    >
      {children}
    </instancedMesh>
  );
}
