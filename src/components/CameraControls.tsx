import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useThree, useFrame, extend } from "@react-three/fiber";
import { useRef } from "react";

extend({ OrbitControls });

export const CameraControls = () => {
    const {
        camera,
        gl: { domElement },
    } = useThree();

    const controls = useRef(null);
    useFrame(() => {
        controls.current.update();
    });

    return (
        //@ts-ignore
        <orbitControls
            ref={controls}
            args={[camera, domElement]}
            enableZoom={true}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
        />
    );
};
