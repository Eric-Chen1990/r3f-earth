export const radiansToDegrees = (rad: number): number => {
	// Convert to degrees
	let deg = rad * (180 / Math.PI);

	// Normalize to 0-360 range
	deg = deg % 360;
	if (deg < 0) {
		deg += 360;
	}

	return deg;
};

export const degreesToRadians = (deg: number): number => {
	return deg * (Math.PI / 180);
};
