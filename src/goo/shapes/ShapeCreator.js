define(['goo/renderer/MeshData', 'goo/shapes/Box', 'goo/shapes/Quad', 'goo/shapes/Sphere', 'goo/shapes/Torus'],
	/** @lends ShapeCreator */
	function (MeshData, Box, Quad, Sphere, Torus) {
	"use strict";

	/**
	 * @class Factory for shape creation.
	 * @constructor
	 * @description Only used to define the class. Should never be instantiated.
	 */

	function ShapeCreator() {
	}

	/**
	 * @static
	 * @description Creates a quad shape.
	 * @param {Float} width Total width of quad.
	 * @param {Float} height Total height of quad.
	 * @param {Integer} tileX Number of texture repetitions in the texture's x direction.
	 * @param {Integer} tileY Number of texture repetitions in the texture's y direction.
	 * @returns {Quad} The created quad.
	 */

	ShapeCreator.createQuad = function (width, height, tileX, tileY) {
		return new Quad(width, height, tileX, tileY);
	};

	/**
	 * @static
	 * @description Creates a box shape.
	 * @param {Float} width Total width of box.
	 * @param {Float} height Total height of box.
	 * @param {Float} length Total length of box.
	 * @param {Integer} tileX Number of texture repetitions in the texture's x direction.
	 * @param {Integer} tileY Number of texture repetitions in the texture's y direction.
	 * @returns {Box} The created box.
	 */

	ShapeCreator.createBox = function (width, height, length, tileX, tileY) {
		return new Box(width, height, length, tileX, tileY);
	};

	/**
	 * @static
	 * @description Creates a sphere shape.
	 * @param {Integer} zSamples Number of segments.
	 * @param {Integer} radialSamples Number of slices.
	 * @param {Float} radius Radius.
	 * @param {Enum} textureMode Texture wrapping mode.
	 * @returns {Sphere} The created sphere.
	 */

	ShapeCreator.createSphere = function (zSamples, radialSamples, radius, textureMode) {
		return new Sphere(zSamples, radialSamples, radius, textureMode);
	};

	/**
	 * @static
	 * @description Creates a torus shape.
	 * @param {Integer} circleSamples Number of segments.
	 * @param {Integer} radialSamples Number of slices.
	 * @param {Float} tubeRadius Radius of tube.
	 * @param {Float} centerRadius Radius from center.
	 * @returns {Torus} The created torus.
	 */

	ShapeCreator.createTorus = function (circleSamples, radialSamples, tubeRadius, centerRadius) {
		return new Torus(circleSamples, radialSamples, tubeRadius, centerRadius);
	};

	return ShapeCreator;
});