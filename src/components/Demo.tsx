import { Center } from "@chakra-ui/react";
import { atomWithToggle, chunk } from "@pastable/core";
import { Debug, Physics, Triplet, useHeightfield } from "@react-three/cannon";
import { Canvas } from "@react-three/fiber";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { DataTexture, RGBFormat } from "three";
import { CameraControls } from "./CameraControls";
import { DevTools } from "./DevTools";
import { Plane } from "@react-three/drei";
import { rotateMatrix } from "./matrixUtils";
import { makeRandomMap, makeTextureMap, smoothMap } from "./mapUtils";
import { atom } from "jotai";
import { useMemo } from "react";
import { nanoid } from "nanoid";

import { generatePerlinNoise } from "perlin-noise";
export const displayMeshAtom = atomWithToggle(true);
export const displayColliderAtom = atomWithToggle(false);
export const wireframeAtom = atomWithToggle(false);
export const debugAtom = atomWithToggle(false);

// matrix initialization
const size = 20;

// const matrix = [
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
// ];
// const heightTexture = makeTextureMap(matrix);

const heightScale = 2;

export const Demo = () => {
    return (
        <Center h="100%">
            <DevTools />
            <Canvas camera={{ position: [0, 5, 6.2] }} shadows>
                <pointLight intensity={0.5} position={[0, 0.5, 0]} castShadow />
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
                <TerrainWithRotation />
            </Debug>
        </Physics>
    );
};

const position: Triplet = [-size / 2, 0, -size / 2];
const rotation: Triplet = [Math.PI / 2, 0, 0];

export const makeSeed = () => nanoid(12);

export const currentMatrixAtom = atom(null as number[][]);
export const nbSmoothAtom = atom(0);
export const maxHeightAtom = atom(2);
export const randomSeedAtom = atom(makeSeed());
export const randomFillPercentAtom = atom(0.5);

export const octaveCountAtom = atom(4);
export const amplitudeAtom = atom(0.1);
export const persistanceAtom = atom(0.2);

// scene with resolved issue
export const TerrainWithRotation = () => {
    const wireframe = useAtomValue(wireframeAtom);
    const displayMesh = useAtomValue(displayMeshAtom);

    const nbSmooth = useAtomValue(nbSmoothAtom);
    const maxHeight = useAtomValue(maxHeightAtom);
    const setCurrentMatrix = useUpdateAtom(currentMatrixAtom);
    const randomSeed = useAtomValue(randomSeedAtom);
    const randomFillPercent = useAtomValue(randomFillPercentAtom);

    const octaveCount = useAtomValue(octaveCountAtom);
    const amplitude = useAtomValue(amplitudeAtom);
    const persistance = useAtomValue(persistanceAtom);

    const perlin = useMemo(() => {
        return chunk(
            generatePerlinNoise(size, size, { octaveCount, amplitude, persistance }),
            size
        );
    }, [, octaveCount, amplitude, persistance]);

    const randomMap = useMemo(() => {
        return makeRandomMap(perlin, size, size, randomFillPercent, maxHeight);
    }, [randomSeed, maxHeight, randomFillPercentAtom, perlin]);

    const { matrix, displacementTexture } = useMemo(() => {
        if (!randomMap) return;

        let smooth = randomMap;
        for (let i = 0; i < nbSmooth; i++) {
            smooth = smoothMap(randomMap, maxHeight);
        }

        const displacementTexture = makeTextureMap(smooth, maxHeight);

        setCurrentMatrix(smooth);

        return { matrix: rotateMatrix(smooth), displacementTexture };
    }, [nbSmooth, randomMap, maxHeight]);

    // we use the rotated matrix
    const [ref] = useHeightfield(() => ({
        args: [matrix, { elementSize: 1 }],
        rotation,
        position,
    }));

    return (
        <>
            <group
                // we rotate the mesh so it matches the collider rotation
                rotation={[Math.PI, 0, 0]}
                position={[position[0] + size - 0.5, position[1], position[2] - 0.5]}
            >
                <Plane
                    ref={ref}
                    args={[size - 1, size - 1, size - 1, size - 1]}
                    receiveShadow
                    castShadow
                >
                    <meshStandardMaterial
                        visible={displayMesh}
                        // we use the texture created by the non rotated matrix
                        displacementMap={displacementTexture}
                        displacementScale={-maxHeight}
                        wireframe={wireframe}
                    />
                </Plane>
            </group>
        </>
    );
};
