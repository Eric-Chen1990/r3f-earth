"use client";

import { Environment, OrbitControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Earth from "./Earth";
import { useControls } from "leva";

const Experience = () => {
	const { atmosphereDayColor, atmosphereTwilightColor } = useControls(
		"Atmo sphere",
		{
			atmosphereDayColor: "#00aaff",
			atmosphereTwilightColor: "#ff6600",
		}
	);
	const { phi, theta } = useControls("Sun spherical", {
		phi: {
			value: 0,
			min: 0,
			max: Math.PI,
		},
		theta: {
			value: 0,
			min: -Math.PI,
			max: Math.PI,
		},
	});
	const { enable } = useControls("Skybox", {
		enable: true,
	});
	return (
		<Canvas>
			<color attach="background" args={["#000000"]} />

			{enable ? (
				<Environment files={"sky001.jpg"} path={"/images/"} background />
			) : (
				<Stars
					radius={100}
					depth={50}
					count={5000}
					factor={6}
					saturation={0}
					fade
					speed={2}
				/>
			)}

			<OrbitControls
				makeDefault
				maxDistance={10}
				minDistance={4}
				enablePan={false}
			/>
			<Earth
				atmosphereDayColor={atmosphereDayColor}
				atmosphereTwilightColor={atmosphereTwilightColor}
				phi={phi}
				theta={theta}
			/>
		</Canvas>
	);
};

export default Experience;
