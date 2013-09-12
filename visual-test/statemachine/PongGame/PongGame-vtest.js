require.config({
	paths: {
		"goo": "../../../src/goo"
	}
});

require([
	'goo/entities/GooRunner',
	'goo/entities/World',
	'goo/renderer/Material',
	'goo/renderer/shaders/ShaderLib',
	'goo/renderer/Camera',
	'goo/shapes/ShapeCreator',
	'goo/entities/components/CameraComponent',
	'goo/scripts/OrbitCamControlScript',
	'goo/entities/EntityUtils',
	'goo/entities/components/ScriptComponent',
	'goo/renderer/MeshData',
	'goo/entities/components/MeshRendererComponent',
	'goo/math/Vector3',
	'goo/renderer/light/PointLight',
	'goo/entities/components/LightComponent',
	'goo/statemachine/FSMComponent',
	'goo/statemachine/FSMSystem',
	'goo/statemachine/State',
	'goo/statemachine/Machine',
	'goo/statemachine/actions/KeyDownAction',
	'goo/statemachine/actions/KeyUpAction',
	'goo/statemachine/actions/AddPositionAction'
], function (
	GooRunner,
	World,
	Material,
	ShaderLib,
	Camera,
	ShapeCreator,
	CameraComponent,
	OrbitCamControlScript,
	EntityUtils,
	ScriptComponent,
	MeshData,
	MeshRendererComponent,
	Vector3,
	PointLight,
	LightComponent,
	FSMComponent,
	FSMSystem,
	State,
	Machine,
	KeyDownAction,
	KeyUpAction,
	AddPositionAction
	) {
	'use strict';

	function getFSMComponent(entity) {
		var fsmComponent = new FSMComponent();
		// create action tied to listen to pick events
		// tie pick event to a channel

		var speed = 10;

		// horizontal moving
		var machine1 = new Machine('horizontalMoving');
		fsmComponent.addMachine(machine1);

		var stateIdle = new State('idle');
		machine1.addState(stateIdle);
		stateIdle.addAction(new KeyDownAction({ key: 'a', jumpTo: 'movingLeft' }));
		stateIdle.addAction(new KeyDownAction({ key: 'd', jumpTo: 'movingRight' }));

		var stateMovingLeft = new State('movingLeft');
		machine1.addState(stateMovingLeft);
		stateMovingLeft.addAction(new KeyUpAction({ key: 'a', jumpTo: 'idle' }));
		stateMovingLeft.addAction(new AddPositionAction({ entity: entity, position: [-speed, 0, 0] }));

		var stateMovingRight = new State('movingRight');
		machine1.addState(stateMovingRight);
		stateMovingRight.addAction(new KeyUpAction({ key: 'd', jumpTo: 'idle' }));
		stateMovingRight.addAction(new AddPositionAction({ entity: entity, position: [ speed, 0, 0] }));


		// vertical moving
		var machine1 = new Machine('verticalMoving');
		fsmComponent.addMachine(machine1);

		var stateIdle = new State('idle');
		machine1.addState(stateIdle);
		stateIdle.addAction(new KeyDownAction({ key: 'w', jumpTo: 'movingUp' }));
		stateIdle.addAction(new KeyDownAction({ key: 's', jumpTo: 'movingDown' }));

		var stateMovingUp = new State('movingUp');
		machine1.addState(stateMovingUp);
		stateMovingUp.addAction(new KeyUpAction({ key: 'w', jumpTo: 'idle' }));
		stateMovingUp.addAction(new AddPositionAction({ entity: entity, position: [0, 0, -speed] }));

		var stateMovingDown = new State('movingDown');
		machine1.addState(stateMovingDown);
		stateMovingDown.addAction(new KeyUpAction({ key: 's', jumpTo: 'idle' }));
		stateMovingDown.addAction(new AddPositionAction({ entity: entity, position: [0, 0, speed] }));


		return fsmComponent;
	}

	function addCharacter(goo, x, y, z) {
		var boxMeshData = ShapeCreator.createBox(1, 1, 1);
		var boxMaterial = Material.createMaterial(ShaderLib.simpleLit, 'mat');
		var boxEntity = EntityUtils.createTypicalEntity(goo.world, boxMeshData, boxMaterial);
		boxEntity.transformComponent.transform.translation.setd(x, y, z);
		boxEntity.setComponent(getFSMComponent(boxEntity));
		boxEntity.addToWorld();
	}

	function getColor(x, y, z) {
		var step = 1.9;
		return [
			Math.cos(x + y + z) / 2 + 0.5,
			Math.cos(x + y + z + step) / 2 + 0.5,
			Math.cos(x + y + z + step * 2) / 2 + 0.5];
	}

	function addLamp(goo, x, y, z) {
		var color = getColor(x, y, z);

		var lampMeshData = ShapeCreator.createSphere(32, 32);
		var lampMaterial = Material.createMaterial(ShaderLib.simpleColored, '');
		lampMaterial.uniforms.color = color;
		var lampEntity = EntityUtils.createTypicalEntity(goo.world, lampMeshData, lampMaterial, 'lamp1');

		var light = new PointLight();
		light.color = new Vector3(color[0], color[1], color[2]);
		light.range = 10;
		lampEntity.setComponent(new LightComponent(light));
		lampEntity.transformComponent.transform.translation.setd(x, y, z);
		lampEntity.addToWorld();

		return lampEntity;
	}

	function addLamps(goo) {
		var nLamps = 1;
		var lampEntities = [];
		for(var i = 0; i < nLamps; i++) {
			lampEntities.push(addLamp(goo, (i - ((nLamps - 1) / 2)) * 4, 5, 0));
		}
		return lampEntities;
	}

	function addCamera(goo) {
		// camera
		var camera = new Camera(45, 1, 1, 1000);
		var cameraEntity = goo.world.createEntity("CameraEntity");
		cameraEntity.transformComponent.transform.translation.set(0, 0, 3);
		cameraEntity.transformComponent.transform.lookAt(new Vector3(0, 0, 0), Vector3.UNIT_Y);
		cameraEntity.setComponent(new CameraComponent(camera));
		cameraEntity.addToWorld();
		var scripts = new ScriptComponent();
		scripts.scripts.push(new OrbitCamControlScript({
			domElement : goo.renderer.domElement,
			spherical : new Vector3(60, Math.PI / 2, 0)
		}));
		cameraEntity.setComponent(scripts);
	}

	function pongGame(goo) {
		var goo = new GooRunner();
		goo.renderer.domElement.id = 'goo';
		document.body.appendChild(goo.renderer.domElement);

		goo.world.setSystem(new FSMSystem(goo));

		addCamera(goo);
		/*var lampEntities = */addLamps(goo);

		/*var boxEntity = */addCharacter(goo, 0, 0, 0);
	}

	function init() {
		var goo = new GooRunner();
		goo.renderer.domElement.id = 'goo';
		document.body.appendChild(goo.renderer.domElement);

		pongGame(goo);
	}

	init();
});
