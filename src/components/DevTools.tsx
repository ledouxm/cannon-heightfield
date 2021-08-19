import { Box, Button, ButtonProps, Center } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { debugAtom, displayColliderAtom, displayMeshAtom, wireframeAtom } from "./Demo";

export const DevTools = () => {
    const [displayCollider, toggleDisplayCollider] = useAtom(displayColliderAtom);
    const [displayMesh, toggleDisplayMesh] = useAtom(displayMeshAtom);
    const [wireframe, toggleWireframe] = useAtom(wireframeAtom);
    const [debug, toggleDebug] = useAtom(debugAtom);

    return (
        <>
            <Center zIndex="10" position="absolute" bottom="0" direction="row">
                <ToggleButton
                    label="result without matrix rotation"
                    colorScheme="red"
                    state={debug}
                    onClick={() => toggleDebug()}
                />
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
            <Center position="absolute" top="0" right="0">
                <Box w="600px" fontSize="24px">
                    {debug
                        ? "Collider and mesh don't overlap because inner vertices of the collider and the mesh have different rotation"
                        : "Collider and mesh overlap since we rotated the collider matrix by PI / 2 and the mesh accordingly"}
                </Box>
            </Center>
        </>
    );
};

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
