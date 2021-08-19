import { Button, Center } from "@chakra-ui/react";
import { useUpdateAtom } from "jotai/utils";
import { debugAtom, wireframeAtom, cptAtom } from "./Demo";

export const DevTools = () => {
    const toggleDebug = useUpdateAtom(debugAtom);
    const toggleWireframe = useUpdateAtom(wireframeAtom);
    const setCpt = useUpdateAtom(cptAtom);

    return (
        <Center zIndex="10" position="absolute" bottom="0" direction="row">
            <Button colorScheme="linkedin" onClick={() => toggleDebug()}>
                Toggle debug
            </Button>
            <Button colorScheme="messenger" onClick={() => toggleWireframe()}>
                Toggle wireframe
            </Button>
            <Button colorScheme="facebook" onClick={() => setCpt((cpt) => cpt + 1)}>
                Replay
            </Button>
        </Center>
    );
};
