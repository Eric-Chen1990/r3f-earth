import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import atmosphereVertexShader from "../_shaders/atmosphere/vertex.glsl";
import atmosphereFragmentShader from "../_shaders/atmosphere/fragment.glsl";
import { ThreeElements } from "@react-three/fiber";
import React from "react";

export type AtmosphereMaterialProps = {
	ref?: React.MutableRefObject<ThreeElements["atmosphereMaterial"] | null>;
	uSunDirection?: THREE.Vector3;
	uAtmosphereDayColor?: THREE.Color;
	uAtmosphereTwilightColor?: THREE.Color;
};

export const AtmosphereMaterial = shaderMaterial(
	{
		uSunDirection: new THREE.Vector3(0, 0, 1),
		uAtmosphereDayColor: new THREE.Color(),
		uAtmosphereTwilightColor: new THREE.Color(),
		uCloudStrength: 0.5,
		transparent: true,
		opacity: 0.2,
		side: THREE.BackSide,
	},
	// vertex shader
	atmosphereVertexShader,
	// fragment shader
	atmosphereFragmentShader
);

// Add types to ThreeElements elements so primitives pick up on it
declare module "@react-three/fiber" {
	interface ThreeElements {
		atmosphereMaterial: AtmosphereMaterialProps;
	}
}
