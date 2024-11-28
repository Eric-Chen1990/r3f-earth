"use client";
import { Sphere, useTexture } from "@react-three/drei";
import * as THREE from "three";

import { useEffect, useRef } from "react";
import { extend, ThreeElements, useFrame, useThree } from "@react-three/fiber";
import { EarthMaterial } from "./earthMaterial";
import { AtmosphereMaterial } from "./atmosphereMaterial";

// declaratively
extend({ EarthMaterial });
extend({ AtmosphereMaterial });

const Earth = ({
	atmosphereDayColor = "#00aaff",
	atmosphereTwilightColor = "#ff6600",
	phi = 0,
	theta = 0,
	cloudStrength = 0.5,
	rotate = true,
}) => {
	const initConfig = {
		uSunDirection: new THREE.Vector3(
			Math.cos(phi) * Math.cos(theta),
			Math.sin(phi),
			Math.cos(phi) * Math.sin(theta)
		),
		uAtmosphereDayColor: new THREE.Color(atmosphereDayColor),
		uAtmosphereTwilightColor: new THREE.Color(atmosphereTwilightColor),
	};

	const { gl: renderer } = useThree();

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

	useEffect(() => {
		if (atmosphereDayColor && atmosphereTwilightColor) {
			if (atmosphereMaterialRef.current) {
				atmosphereMaterialRef.current.uAtmosphereDayColor?.set(
					atmosphereDayColor
				);
				atmosphereMaterialRef.current.uAtmosphereTwilightColor?.set(
					atmosphereTwilightColor
				);
			}
			if (earthMaterialRef.current) {
				earthMaterialRef.current.uAtmosphereDayColor?.set(atmosphereDayColor);
				earthMaterialRef.current.uAtmosphereTwilightColor?.set(
					atmosphereTwilightColor
				);
			}
		}
	}, [atmosphereDayColor, atmosphereTwilightColor]);

	useEffect(() => {
		if (earthMaterialRef.current) {
			earthMaterialRef.current.uSunDirection = initConfig.uSunDirection;
		}
		if (atmosphereMaterialRef.current) {
			atmosphereMaterialRef.current.uSunDirection = initConfig.uSunDirection;
		}
	}, [initConfig.uSunDirection]);

	useEffect(() => {
		if (earthMaterialRef.current) {
			earthMaterialRef.current.uCloudStrength = parseFloat(
				cloudStrength.toString()
			);
		}
	}, [cloudStrength]);

	useFrame((state, delta) => {
		const earth = earthRef.current;
		if (earth && rotate) {
			earth.rotation.y += delta / 8;
		}
	});

	const earthMaterialRef = useRef<ThreeElements["earthMaterial"]>(null);
	const atmosphereMaterialRef =
		useRef<ThreeElements["atmosphereMaterial"]>(null);

	return (
		<group ref={earthRef}>
			<Sphere args={[2, 64, 64]}>
				<earthMaterial
					ref={earthMaterialRef}
					uDayTexture={earthDayTexture}
					uNightTexture={earthNightTexture}
					uSpecularCloudsTexture={earthSpecularCloudsTexture}
					uSunDirection={initConfig.uSunDirection}
					uAtmosphereDayColor={initConfig.uAtmosphereDayColor}
					uAtmosphereTwilightColor={initConfig.uAtmosphereTwilightColor}
					uCloudStrength={cloudStrength}
				/>
			</Sphere>
			<Sphere args={[2.1, 64, 64]}>
				<atmosphereMaterial
					ref={atmosphereMaterialRef}
					uSunDirection={initConfig.uSunDirection}
					uAtmosphereDayColor={initConfig.uAtmosphereDayColor}
					uAtmosphereTwilightColor={initConfig.uAtmosphereTwilightColor}
				/>
			</Sphere>
		</group>
	);
};

export default Earth;
