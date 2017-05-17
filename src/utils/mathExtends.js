const getDistance = function (point1, point2) {
	if (point1.hasOwnProperty('x') &&
	point1.hasOwnProperty('y') &&
	point2.hasOwnProperty('x') &&
	point2.hasOwnProperty('y')) {
		console.warn('wrong x, y');
		return NaN;
	}

	point1.x = Number(point1.x);
	point1.y = Number(point1.y);
	point2.x = Number(point2.x);
	point2.y = Number(point2.y);

	if (isNaN(point1.x) ||
		isNaN(point1.y) ||
		isNaN(point2.x) ||
		isNaN(point2.y)) {
		console.warn('wrong type of x, y');
		return NaN;
	}

	return Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2));
};

export default getDistance;
