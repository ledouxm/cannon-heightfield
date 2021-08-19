import { Center } from "@chakra-ui/react";
import { atomWithToggle } from "@pastable/core";
import { Debug, Physics, Triplet, useHeightfield } from "@react-three/cannon";
import { Canvas } from "@react-three/fiber";
import { useAtomValue } from "jotai/utils";
import { DataTexture, RGBFormat } from "three";
import { CameraControls } from "./CameraControls";
import { DevTools } from "./DevTools";
import { Plane } from "@react-three/drei";
import { rotateMatrix } from "./matrixUtils";

export const displayMeshAtom = atomWithToggle(true);
export const displayColliderAtom = atomWithToggle(false);
export const wireframeAtom = atomWithToggle(true);
export const debugAtom = atomWithToggle(true);

// matrix initialization
const size = 10;

const matrix = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
];

// from 0 - 1 to 0 - 255
const byteMatrix = matrix.map((row) => row.map((value) => value * 255));
// from number[][] to rgb buffer
const buffer = new Uint8Array(
    byteMatrix.reverse().flatMap((row) => row.reverse().flatMap((value) => [value, value, value]))
);
// three texture
const heightTexture = new DataTexture(buffer, size, size, RGBFormat);

// rotated matrix (for the vertices to overlap)
const rotated = rotateMatrix(JSON.parse(JSON.stringify(matrix)));

export const Demo = () => {
    return (
        <Center h="100%">
            <DevTools />
            <Canvas camera={{ position: [0, 5, 6.2] }}>
                <pointLight intensity={0.5} position={[0, 2, 0]} />
                <ambientLight intensity={0.1} />
                <axesHelper />
                <PhysicWorld />
                <CameraControls />
            </Canvas>
        </Center>
    );
};

const PhysicWorld = () => {
    const displayCollider = useAtomValue(displayColliderAtom);
    const debug = useAtomValue(debugAtom);

    return (
        <Physics>
            <Debug scale={displayCollider ? 1 : 0} color="#C0392B">
                {debug ? <TerrainWithoutRotation /> : <TerrainWithRotation />}
            </Debug>
        </Physics>
    );
};

const position: Triplet = [-size / 2, 0, -size / 2];
const rotation: Triplet = [Math.PI / 2, 0, 0];
const heightScale = 1;

// scene with resolved issue
export const TerrainWithRotation = () => {
    const wireframe = useAtomValue(wireframeAtom);
    const displayMesh = useAtomValue(displayMeshAtom);

    // we use the rotated matrix
    const [ref] = useHeightfield(() => ({
        args: [rotated, { elementSize: 1 }],
        rotation,
        position,
    }));

    return (
        <>
            <group
                // we rotate the mesh so it matches the collider rotation
                rotation={[Math.PI, Math.PI, 0]}
                position={[position[0] - 0.5, position[1], position[2] + size - 0.5]}
            >
                <Plane ref={ref} args={[size - 1, size - 1, size - 1, size - 1]}>
                    <meshStandardMaterial
                        visible={displayMesh}
                        // we use the texture created by the non rotated matrix
                        displacementMap={heightTexture}
                        displacementScale={-heightScale}
                        wireframe={wireframe}
                    />
                </Plane>
            </group>
        </>
    );
};

export const TerrainWithoutRotation = () => {
    const wireframe = useAtomValue(wireframeAtom);
    const displayMesh = useAtomValue(displayMeshAtom);

    // we used the same matrix as the mesh
    const [ref] = useHeightfield(() => ({
        args: [matrix, { elementSize: 1 }],
        rotation,
        position,
    }));

    return (
        <>
            <group
                rotation={[Math.PI, -Math.PI / 2, 0]}
                position={[position[0] - 0.5, position[1], position[2] - 0.5]}
            >
                <Plane ref={ref} args={[size - 1, size - 1, size - 1, size - 1]}>
                    <meshStandardMaterial
                        visible={displayMesh}
                        // we use the texture created by the non rotated matrix
                        displacementMap={heightTexture}
                        displacementScale={-heightScale}
                        wireframe={wireframe}
                    />
                </Plane>
            </group>
        </>
    );
};
