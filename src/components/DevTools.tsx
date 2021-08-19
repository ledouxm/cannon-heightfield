import {
    Box,
    Button,
    ButtonProps,
    Center,
    chakra,
    Flex,
    Slider,
    SliderFilledTrack,
    SliderProps,
    SliderThumb,
    SliderTrack,
    Stack,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { nanoid } from "nanoid";
import {
    amplitudeAtom,
    currentMatrixAtom,
    debugAtom,
    displayColliderAtom,
    displayMeshAtom,
    maxHeightAtom,
    nbSmoothAtom,
    octaveCountAtom,
    persistanceAtom,
    randomFillPercentAtom,
    randomSeedAtom,
    wireframeAtom,
} from "./Demo";

export const DevTools = () => {
    const [displayCollider, toggleDisplayCollider] = useAtom(displayColliderAtom);
    const [displayMesh, toggleDisplayMesh] = useAtom(displayMeshAtom);
    const [wireframe, toggleWireframe] = useAtom(wireframeAtom);
    const [debug, toggleDebug] = useAtom(debugAtom);

    const [maxHeight, setMaxHeight] = useAtom(maxHeightAtom);
    const [nbSmooth, setNbSmooth] = useAtom(nbSmoothAtom);
    const [randomFillPercent, setRandomFillPercent] = useAtom(randomFillPercentAtom);
    const setRandomSeed = useUpdateAtom(randomSeedAtom);

    const [octaveCount, setOctaveCount] = useAtom(octaveCountAtom);
    const [amplitude, setAmplitude] = useAtom(amplitudeAtom);
    const [persistance, setPersistance] = useAtom(persistanceAtom);

    return (
        <>
            <Center zIndex="10" position="absolute" bottom="0" direction="row">
                <Button colorScheme="red" onClick={() => toggleDebug()}>
                    Switch
                </Button>
                <ToggleButton
                    label="wireframe"
                    colorScheme="facebook"
                    state={wireframe}
                    onClick={() => toggleWireframe()}
                />
                <ToggleButton
                    label="mesh"
                    colorScheme="facebook"
                    state={displayMesh}
                    onClick={() => toggleDisplayMesh()}
                />
                <ToggleButton
                    label="collider"
                    colorScheme="facebook"
                    state={displayCollider}
                    onClick={() => toggleDisplayCollider()}
                />
            </Center>
            <Stack zIndex="10" position="absolute" top="0" right="0">
                <AppSlider
                    label="max height"
                    min={0}
                    max={10}
                    defaultValue={maxHeight}
                    onChange={(val) => setMaxHeight(val)}
                />
                <AppSlider
                    min={0}
                    max={3}
                    defaultValue={nbSmooth}
                    onChange={(val) => setNbSmooth(val)}
                    label="nb smoothing"
                />
                <AppSlider
                    min={0}
                    max={1}
                    step={0.01}
                    defaultValue={randomFillPercent}
                    onChange={(val) => setRandomFillPercent(val)}
                    label="fill percent"
                />
                <br />

                <AppSlider
                    min={0}
                    max={10}
                    step={1}
                    defaultValue={octaveCount}
                    onChange={(val) => setOctaveCount(val)}
                    label="octave count"
                />

                <AppSlider
                    min={0}
                    max={1}
                    step={0.01}
                    defaultValue={amplitude}
                    onChange={(val) => setAmplitude(val)}
                    label="amplitude"
                />

                <AppSlider
                    min={0}
                    max={1}
                    step={0.01}
                    defaultValue={persistance}
                    onChange={(val) => setPersistance(val)}
                    label="persistance"
                />
                <Button onClick={() => setRandomSeed(nanoid(12))}>New seed</Button>
                <MatrixViewer />
            </Stack>
        </>
    );
};

const AppSlider = ({
    label,
    min,
    max,
    step,
    defaultValue,
    onChange,
}: { label: string } & Partial<SliderProps>) => (
    <Box w="100px">
        <chakra.h3>{label}</chakra.h3>
        <Slider min={min} max={max} step={step} defaultValue={defaultValue} onChange={onChange}>
            <SliderTrack>
                <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
        </Slider>
    </Box>
);
const ToggleButton = ({
    label,
    state,
    ...props
}: { label: string; state: boolean } & ButtonProps) => (
    <Button {...props}>
        {state ? "Hide " : "Show "}
        {label}
    </Button>
);

const cellSize = 2;
const MatrixViewer = () => {
    const currentMatrix = useAtomValue(currentMatrixAtom);
    const maxHeight = useAtomValue(maxHeightAtom);

    if (!currentMatrix) return null;

    const size = currentMatrix.length;

    return (
        <Flex direction="column" boxSize={cellSize * size + "px"}>
            {currentMatrix.map((row, y) => (
                <Flex height={cellSize + "px"} key={y}>
                    {row.map((cell, x) => (
                        <Box
                            key={x + " " + y}
                            boxSize={cellSize}
                            bgColor={`rgb(${(cell * 255) / maxHeight}, ${
                                (cell * 255) / maxHeight
                            }, ${(cell * 255) / maxHeight})`}
                        ></Box>
                    ))}
                </Flex>
            ))}
        </Flex>
    );
};
