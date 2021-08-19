import { Button, Center, Stack } from "@chakra-ui/react";
import { atomWithToggle } from "@pastable/core";
import { Physics, Triplet, useBox, useHeightfield } from "@react-three/cannon";
import { Plane } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { atom } from "jotai";
import { useUpdateAtom, useAtomValue } from "jotai/utils";
import { DataTexture, RGBFormat, Vector2Tuple } from "three";
import { CameraControls } from "./CameraControls";
import { DevTools } from "./DevTools";

export const debugAtom = atomWithToggle(true);
export const wireframeAtom = atomWithToggle(false);

export const cptAtom = atom(0);

const size = 10;
// 0 <= value <= 1 number[][]
const matrix = [
    [1, 1, 1, 0, 1, 1, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [0, 0, 0, 0, 1, 1, 0, 1, 0, 0],
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 0, 1, 1, 0, 1, 0],
    [0, 1, 0, 0, 1, 1, 1, 0, 1, 1],
];

// 0 <= value <= 255 number[][]
const byteMatrix = matrix.map((row) => row.map((value) => value * 255));

// 0 <= value <= 255 Uint8Array r g b
const buffer = new Uint8Array(
    byteMatrix.flatMap((row) => row.flatMap((value) => [value, value, value]))
);

// three texture
const heightTexture = new DataTexture(buffer, size, size, RGBFormat);

export const Demo = () => {
    return (
        <Center h="100%">
            <DevTools />
            <Canvas camera={{ position: [0, 7, 10] }}>
                <pointLight intensity={0.1} position={[0, -1, 0]} />
                <ambientLight intensity={0.1} />
                <Physics>
                    <Terrain />
                    <SimpleCube />
                </Physics>
                <CameraControls />
            </Canvas>
        </Center>
    );
};

const rotation: Triplet = [-Math.PI / 2, 0, 0];
const position: Triplet = [0, -2, 0];

export const Terrain = () => {
    const debug = useAtomValue(debugAtom);
    const wireframe = useAtomValue(wireframeAtom);

    const [ref] = useHeightfield(() => ({
        args: [matrix, { elementSize: 1 }],
        position,
        rotation,
    }));

    // if 1st and 2nd args are 1, the mesh seems at the same place as the collider
    // but my terrain needs to be scaled

    // if 1st and 2nd args are size (which i want them to be), the mesh is at my desired side
    // but the collider has not been scaled
    const firstArgs: Vector2Tuple = debug ? [1, 1] : [size, size];

    return (
        <Plane ref={ref} args={[...firstArgs, size, size]} position={position}>
            <meshStandardMaterial displacementMap={heightTexture} wireframe={wireframe} />
        </Plane>
    );
};

export const SimpleCube = () => {
    const debug = useAtomValue(debugAtom);
    const cpt = useAtomValue(cptAtom);

    // debug and cpt as deps for debug purpose
    const [ref] = useBox(
        () => ({
            position: [0, 5, 0],
            mass: 10,
        }),
        null,
        [debug, cpt]
    );

    return (
        <mesh ref={ref}>
            <boxGeometry />
            <meshStandardMaterial color="red" />
        </mesh>
    );
};
