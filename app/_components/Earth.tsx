import { Sphere, useTexture } from "@react-three/drei";
import * as THREE from "three";
import earthVertexShader from "../_shaders/earth/vertex.glsl";
import earthFragmentShader from "../_shaders/earth/fragment.glsl";
import atmosphereVertexShader from "../_shaders/atmosphere/vertex.glsl";
import atmosphereFragmentShader from "../_shaders/atmosphere/fragment.glsl";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const Earth = ({
	atmosphereDayColor = "#00aaff",
	atmosphereTwilightColor = "#ff6600",
	phi = 0,
	theta = 0,
	cloudStrength = 0.5,
	rotate = true,
}) => {
	const { gl: renderer } = useThree();
	const atmosphereMaterial = useRef<THREE.ShaderMaterial>(null);

	const earthRef = useRef<THREE.Group>(null);
	const [earthDayTexture, earthNightTexture, earthSpecularCloudsTexture] =
		useTexture([
			"/earth/day.jpg",
			"/earth/night.jpg",
			"/earth/specularClouds.jpg",
		]);
	earthDayTexture.colorSpace = earthNightTexture.colorSpace =
		THREE.SRGBColorSpace;
	earthDayTexture.anisotropy =
		earthNightTexture.anisotropy =
		earthSpecularCloudsTexture.anisotropy =
			renderer.capabilities.getMaxAnisotropy();

	const earthUniforms = useRef({
		uDayTexture: { value: earthDayTexture },
		uNightTexture: { value: earthNightTexture },
		uSpecularCloudsTexture: { value: earthSpecularCloudsTexture },
		uSunDirection: { value: new THREE.Vector3(0, 0, 1) },
		uAtmosphereDayColor: { value: new THREE.Color(atmosphereDayColor) },
		uAtmosphereTwilightColor: {
			value: new THREE.Color(atmosphereTwilightColor),
		},
		uCloudStrength: {
			value: parseFloat(cloudStrength.toString()),
		},
	});

	const atmosphereUniforms = useRef({
		uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
		uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(atmosphereDayColor)),
		uAtmosphereTwilightColor: new THREE.Uniform(
			new THREE.Color(atmosphereTwilightColor)
		),
	});

	useEffect(() => {
		if (atmosphereDayColor && atmosphereTwilightColor) {
			atmosphereUniforms.current.uAtmosphereDayColor.value.set(
				atmosphereDayColor
			);
			atmosphereUniforms.current.uAtmosphereTwilightColor.value.set(
				atmosphereTwilightColor
			);
		}
	}, [atmosphereDayColor, atmosphereTwilightColor]);

	useEffect(() => {
		earthUniforms.current.uSunDirection.value.set(
			Math.cos(phi) * Math.cos(theta),
			Math.sin(phi),
			Math.cos(phi) * Math.sin(theta)
		);
		atmosphereUniforms.current.uSunDirection.value.set(
			Math.cos(phi) * Math.cos(theta),
			Math.sin(phi),
			Math.cos(phi) * Math.sin(theta)
		);
	}, [phi, theta]);

	useEffect(() => {
		earthUniforms.current.uCloudStrength.value = parseFloat(
			cloudStrength.toString()
		);
	}, [cloudStrength]);

	useFrame((state, delta) => {
		const earth = earthRef.current;
		if (earth && rotate) {
			earth.rotation.y += delta / 8;
		}
	});

	return (
		<group ref={earthRef}>
			<Sphere args={[2, 64, 64]}>
				<shaderMaterial
					vertexShader={earthVertexShader}
					fragmentShader={earthFragmentShader}
					uniforms={earthUniforms.current}
				/>
			</Sphere>
			<Sphere args={[2.1, 64, 64]}>
				<shaderMaterial
					ref={atmosphereMaterial}
					vertexShader={atmosphereVertexShader}
					fragmentShader={atmosphereFragmentShader}
					transparent
					opacity={0.2}
					side={THREE.BackSide}
					uniforms={atmosphereUniforms.current}
				/>
			</Sphere>
		</group>
	);
};
			
export default Earth;
