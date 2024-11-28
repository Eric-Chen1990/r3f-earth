import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import earthVertexShader from "../_shaders/earth/vertex.glsl";
import earthFragmentShader from "../_shaders/earth/fragment.glsl";
import { ThreeElements } from "@react-three/fiber";
import React from "react";

export type EarthMaterialProps = {
	ref?: React.MutableRefObject<ThreeElements["earthMaterial"] | null>;
	uDayTexture: THREE.Texture;
	uNightTexture: THREE.Texture;
	uSpecularCloudsTexture: THREE.Texture;
	uSunDirection?: THREE.Vector3;
	uAtmosphereDayColor?: THREE.Color;
	uAtmosphereTwilightColor?: THREE.Color;
	uCloudStrength?: number;
};

export const EarthMaterial = shaderMaterial(
	{
		uDayTexture: null,
		uNightTexture: null,
		uSpecularCloudsTexture: null,
		uSunDirection: new THREE.Vector3(0, 0, 1),
		uAtmosphereDayColor: new THREE.Color(),
		uAtmosphereTwilightColor: new THREE.Color(),
		uCloudStrength: 0.5,
	},
	// vertex shader
	earthVertexShader,
	// fragment shader
	earthFragmentShader
);

// Add types to ThreeElements elements so primitives pick up on it
declare module "@react-three/fiber" {
	interface ThreeElements {
		earthMaterial: EarthMaterialProps;
	}
}
