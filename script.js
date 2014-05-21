//debug mode
	var gamePaused = false;
/**START WEBGL **/
$(window).load(function() {

	// laddar in guit
	initialize_GUI();

	// standard global variables
	var floor, floorList, collideableMeshList, 
		pos1, pos2, cube2, loader, engine, bulletEngine,
		container, scene, camera, renderer, 
		group, ship, cube, sphere, dt, lookatpoint,
		gravity; //controls;
	var keyboard = new THREEx.KeyboardState();
	var keyboard_2 = new KeyboardState();
	var clock = new THREE.Clock();

	// custom global variables
	var jumpClock;
	var jumpTime = 0.0;

	


	var bulletShot = false;

	var maxRotX, maxTransX; //skeppets maximala rotation resp. förflyttning
	var jumpAmp; //hur högt skeppet kan hoppa (jumpAmplitude)
	var jumpOrdive; //Dyka eller hoppa.
	var hoverDist; //hur högt över banan som skeppet flyger
	var cubeMass = 0.7;

	var totalHealth = 400;
	var totalHealthLost = 0;

	//SKEPPETS GEOMETRI
	var shipLength 	= 200, shipHeight = 60,	shipWidth = 60,
			wingWidth	= 150, wingHeight = 20, wingDepth = 100;


	//CUBE GEOMETRI
	var cubeX = 200,
		cubeY = 80,
		cubeZ = 180;

	var startingSpeed =  -1500;
	var levelSpeed = 1;

	

	
	var coins = []; //array med coins
	var checkIfCollect = []; //satt till false i generateGroundSegment
	var indexCoins = 0;

	var ammunition = [];
	var bulletMesh;
	var bulletX =10,
		bulletY =10,
		bulletZ =400;

	var shipDistZ = 0,
		shipDistStart = 0;

	var shipStartPosition = -300;

	//COINS per spel
	var TOTALCOINS = 0;

	var PI = Math.PI;

	//global ground and obstacle variables
	var laneWidth = 300,		//bredd på varje vägfil
		minSegmentLength = 2000, //minsta längden på ett vägsegment
		laneOverlap = 1000;

	var	groundPosY = -10.5,
		groundPosZ = 1950,		//uppdateras efter varje nytt segment, defaultvärdet ska vara lika med startplanets sista z-koordinat
		prevGroundLane = 0;		// -1 = vänster lane, 0 = mitten, 1 = höger lane

	var	obstaclePosZ =500;

	var coinRadiusTop = 50, 
		coinRadiusBottom = 50; 
	var coinTexture = new THREE.ImageUtils.loadTexture( 'texture/coinTexture.png' );

	var groundTexture = new THREE.ImageUtils.loadTexture( 'texture/gradient6.png' );
		groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping; 
		//groundTexture.repeat.set( 0.5, 2.0 );
	var groundMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, map: groundTexture, side: THREE.DoubleSide, transparent: true, opacity:0.5 } );
	var groundGeometry;

	var obstacleTexture = new THREE.ImageUtils.loadTexture( 'texture/WarningSign2.jpg' );
	var obstacleMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, map: obstacleTexture, side: THREE.DoubleSide } );
	var obstacleGeometry,
		obstacleHeight = 250;

	var totalCoinMesh;
	
	var count = 0;
	
	init();
	animate();

	// FUNCTIONS 		
	function init() 
	{

		'use strict';
		//Initiate Physijs
		Physijs.scripts.worker = 'physics/physijs_worker.js';
		Physijs.scripts.ammo = 'ammo.js';
		// SCENE
		scene = new Physijs.Scene();
		gravity = -1800;

		//Group to place all things that's supposed
		//to follow the ship in the z axis, such as camera, lights, skybox(?!), etc
		group = new THREE.Object3D();


		// CAMERA
		var SCREEN_WIDTH = window.innerWidth, 
			SCREEN_HEIGHT = window.innerHeight;
		var VIEW_ANGLE = 45, 
			ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, 
			NEAR = 1, 
			FAR = 20000;

		camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);

		camera.position.set(0,500,800);
		camera.lookAt(scene.position);
		lookatpoint = new THREE.Object3D();


		// RENDERER
		if ( Detector.webgl )
			renderer = new THREE.WebGLRenderer( {antialias:true} );
		else
			renderer = new THREE.CanvasRenderer(); 

		renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

		renderer.shadowMapEnabled = true;
		renderer.shadowMapSoft = true;// to antialias the shadow

		container = document.getElementById( 'WebGL-container' );
		container.appendChild( renderer.domElement );

		// EVENTS
		THREEx.WindowResize(renderer, camera);
		THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

		// FLOOR
		var floorTexture = new THREE.ImageUtils.loadTexture( 'texture/motherboard.jpg' );
		floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
		floorTexture.repeat.set( 1, 1 );
		var floorMaterial = new THREE.MeshLambertMaterial( { color: 0x444444, map: floorTexture, side: THREE.DoubleSide } );
		var floorGeometry = new THREE.PlaneGeometry(300, 2000, 10, 10);
		 floor = new Physijs.BoxMesh(floorGeometry, groundMaterial);
		floor.position.y = -10.5;
		floor.position.z = -950;
		floor.rotation.x = PI / 2;
		floor.id = "startGround";

		floorList = [floor];



		// SKYBOX/FOG
		var skyBoxGeometry  = new THREE.CubeGeometry( 20000, 8000, 30000 );
		var skyBoxMaterial  = new THREE.MeshLambertMaterial( {map:THREE.ImageUtils.loadTexture('texture/space.jpg'), side: THREE.BackSide } );
		var skyBox 			= new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
		skyBox.position.y = 1500;

	    sphere = new Physijs.SphereMesh(new THREE.SphereGeometry(100, 3200), floorMaterial, 0.2);
		sphere.position.y = 100;
		sphere.position.z = -300;
		sphere.rotation.x=0.5;
		//scene.add(sphere);

		var ambientLight = new THREE.AmbientLight(0xbbbbbb);
	    //scene.add(ambientLight);
	    //Directional light
	    var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	    directionalLight.position.set( 0, 10, 10 ).normalize();

	    //Totalcoins i vänstra hörnet
	    var coinGeometryTot = new THREE.CylinderGeometry( coinRadiusTop, coinRadiusTop, 10, 32 );
		var material = new THREE.MeshBasicMaterial( {color: 0xffff00, map: coinTexture, side: THREE.BackSide} );
		totalCoinMesh = new THREE.Mesh( coinGeometryTot, material );

		//Position på totalcoins i hörnet, efter storlek på skärmen
		var totalCoinPosX = -(document.getElementById("WebGL-container").offsetWidth)/2;
		var totalCoinPosY = (document.getElementById("WebGL-container").offsetHeight)/1.25;
		var totalCoinPosZ = -1500;

		totalCoinMesh.rotation.x =  Math.PI / 2;
		totalCoinMesh.position.set(totalCoinPosX, totalCoinPosY, totalCoinPosZ);
		

			////////////
			// CUSTOM //
			////////////
		//////////////////////
		/// Carlbaum edits ///
		//////////////////////

		//kuben som styr fysiken
		cube = new Physijs.BoxMesh(new THREE.CubeGeometry(cubeX,cubeY,cubeZ), floorMaterial, cubeMass);
		cube.position.y = 200;
		cube.position.z = shipStartPosition;

		scene.setGravity(new THREE.Vector3( 0, gravity, 0 ));



		var shipGeom = new THREE.CubeGeometry(	shipWidth,
												shipHeight,
												shipLength);
		/*var	wingGeom 	= new THREE.CubeGeometry( wingWidth,
												  wingHeight,
												  wingDepth);
		*/
		var shipMat 	= new THREE.MeshLambertMaterial( { color: 0x006464 } );

		ship 			= new THREE.Mesh( shipGeom, shipMat, 0.4);

		/*var rightWing = new THREE.Mesh( wingGeom, shipMat ),
			leftWing  = new THREE.Mesh( wingGeom, shipMat );*/

		//skeppet övrigt
		maxRotX = PI /3; 	//skeppets maximala lutning
		maxTransX = 625;	
		jumpAmp = 150;
		hoverDist = shipHeight / 2 + 30; //flyger 100units över planet 

		ship.position.y = hoverDist;

		/*leftWing.position.x = -30;
		leftWing.rotation.y = PI * 1/3.2;

		rightWing.position.x = 30;
		rightWing.rotation.y = -PI * 1/3.2;*/

		//föremåls skugghantering
		/*ship.castShadow = true;	
		ship.receiveShadow = true;*/

		/*leftWing.castShadow = true;
		leftWing.receiveShadow = true;

		rightWing.castShadow = true;
		rightWing.receiveShadow = true;*/

		floor.castShadow = false;
		floor.receiveShadow = true;

		// LIGHTS
		//LJUSEN FUCKARRRRRRRRRRRRRRRRRRRRR, måste fixas
		//tror det beror på att positionen som de tittar på måste uppdateras varje frame, eller liknande
		var lightMain	= new THREE.SpotLight(0xffffff), 			//ljus ovan som följer skeppet
			lightFront	= new THREE.SpotLight(0x00ff00),				//framlykta
			lightRear	= new THREE.PointLight(0xff2200, 10.0, 150.0);	//(color, intensity, distance) tanken är att simulera ljus från partiklarna(elden) 

		lightMain.position.set( 0, 2500, 0);
		lightMain.target = group;
		lightMain.castShadow = true;
		//lightMain.shadowDarkness = 0.5;
		//inte riktigt säker på vad följande gör men men
		lightMain.shadowMapWidth = 512; //hur många pixlar som skuggan ska bestå av?
		lightMain.shadowMapHeight = 512; // -||-
		lightMain.shadowCameraNear = 500; //skuggor som är närmare ljuskällan renderas inte?
		lightMain.shadowCameraFar = 3000; //skuggor som är längre ifrån ljuskällan renderas inte?
		lightMain.shadowCameraFov = 30;	  //FieldOfView? ändrar i princip skärpan på skuggan, högre = sämre men mer 'falloff' 	

		var aim = new THREE.Object3D();	
		aim.position.y = -100;
		aim.position.z = -2000;
		lightFront.angle = PI/9;
		lightFront.position.set( 0, 0, -shipLength/2-15);
		lightFront.target = aim;
		//lightFront.exponent = 10;
		lightFront.distance = 2000;
		//lightFront.target = new THREE.Vector3(0,0,ship.position.z -200);
		lightFront.castShadow = true; 
		//lightFront.intensity = 1.0;
		/*lightFront.shadowMapWidth = 1024; 
		lightFront.shadowMapHeight = 1024; 
		lightFront.shadowCameraNear = 500; 
		lightFront.shadowCameraFar = 4000; 
		lightFront.shadowCameraFov = 30; 

		lightRear.position.set( 0, shipHeight/2-10, shipLength/2+20);
	/*	lightRear.intensity = 10.0;
		lightRear.distance = 100;
	*/
		//skapa partikelsystem
		engine = new ParticleEngine();
		engine.setValues( Examples.carlbaum );
		engine.initialize(); // jag tog bort scene.add från ParticleEngine.js för att kunna använda ship.add istället
		engine.positionBase.y = -cubeY;
		engine.positionBase.z = (shipLength+30)/2;

		//laddar in modell
		loader = new THREE.OBJMTLLoader();
		loader.load( 'objects/ship6.obj', 'objects/ship6.mtl', function ( object ) {
			//Object is the car, adding car to the cube for physics
			/*object.scale.set(0.6,0.6,0.6);
			object.rotation.y = Math.PI;*/
			object.position.y = -cubeY;
			object.castShadow = true;	
			object.receiveShadow = true;

			ship.add(object);

		} );

		//för modell

		collideableMeshList = [];

		
		/*rightWing.visible = true;
		leftWing.visible = true;*/
		ship.visible = false;
		cube.visible = false;

		//lägg till objekt i scenen/gruppen etc
		var i;
		for (i = 0; i < 10 ; i++) {
			generateGroundSegment();
		}

		//cube.add(skyBox);
		camera.add(skyBox);
		camera.add(totalCoinMesh);
		//scene.add(skyBox);
		scene.add(camera);
		//cube.add(camera);

		scene.add(cube);
		scene.add(floor);
		scene.add( directionalLight );

		/*ship.add( leftWing );
		ship.add( rightWing );
		*/
		ship.add( aim );
		ship.add( lightFront );
		ship.add( lightRear );	
		ship.add( engine.particleMesh );


		group.add(lightMain);
		cube.add(group);
		cube.add(ship);
	}

	function getSeconds(){

		var temp = $('#timer span').html();
		var tempArr = temp.split("'");
		return parseInt(tempArr[1]);
	}


	function animate() 
	{
		
		var requestId = requestAnimationFrame( animate );
		
	    
	    // för att den endast ska åka i sidled 
	    cube.lookAt(new THREE.Vector3( 0, 0, 1200 ) );
	    
	   // stabilizeCube();
	   


		camera.position.x = cube.position.x*0.5;
	   	camera.position.z = cube.position.z + 1200;
	    lookatpoint.position.x = cube.position.x*0.5;
		lookatpoint.position.z = cube.position.z-1500;
		camera.lookAt(lookatpoint.position);

		render();		
		update();

		checkRotation();

		// här dör man
		if((cube.position.y < -500) || pixelsToNumber($('#health').css('width')) < 1)
			endGame(requestId, TOTALCOINS);

		scene.simulate();
		animateCoin();
		//animateTotalCoin();
	}

	//Rätt ful lösning
	function pixelsToNumber(px){

		var tempArr = px.split('p');
		return parseInt(tempArr[0]);

	}

	function checkRotation(){

		var rotSpeed = 0.02;

	    var x = camera.position.x,
	        y = camera.position.y,
	        z = camera.position.z;

	    if (keyboard.pressed("Z")){ 
	        camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
	        camera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
	    } else if (keyboard.pressed("X")){
	        camera.position.x = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
	        camera.position.z = z * Math.cos(rotSpeed) + x * Math.sin(rotSpeed);
	    }if (keyboard.pressed("G")){ 
	        camera.position.y = y * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
	        camera.position.z = z * Math.cos(rotSpeed) - y * Math.sin(rotSpeed);
	    } else if (keyboard.pressed("B")){
	        camera.position.y = 100;
	        camera.position.z = -500;
	        cube.add(camera);
	    }

	    //camera.lookAt(scene.position);

	}

	function update()
	{	
		keyboard_2.update();
		// för att styra skeppet
		if(controlsActivated)
			shipControls();

		checkCoinCollision();

		//ger sekunder sen senaste 
		dt = clock.getDelta();

		engine.update( dt * 0.8 );	//uppdatera particles
		if(bulletShot == true)
		{
			bulletEngine.update( dt * 2);	//uppdatera particles skott
		}
			
		//generera ett vägsegment 
		shipDistZ = cube.position.z;

		if ( shipDistZ-shipDistStart <= -500 ) {
			generateGroundSegment();
			shipDistStart = cube.position.z;
		}

		shipHover();
		shipCollideWithObstacle();
	}

	function shipHover(){

/*
		for (var vertexIndex = 0; vertexIndex < cube.geometry.vertices.length; vertexIndex++)
		{       
		    var localVertex = cube.geometry.vertices[vertexIndex].clone();
		    var globalVertex = localVertex.applyMatrix4(cube.matrix);
		    var directionVector = globalVertex.sub( cube.position );

		    console.log(directionVector.getComponent(0));
		    console.log(directionVector.getComponent(1));
		    console.log(directionVector.getComponent(2));*/

		    var newCube = new THREE.Vector3(cube.position.x, cube.position.y+1-cubeY/2, cube.position.z);

		    var ray = new THREE.Raycaster( newCube, new THREE.Vector3(0,-1,0), 0, 210);
		    var collisionResults = ray.intersectObjects( floorList );

		    //"Krock" med marken
		    if ( collisionResults.length > 0 && collisionResults[0].distance < 200 ) 
		    {
		    	var value = 200;
				value -= cube.position.y+1;
					value /= 100;
				var cubeYDir;
				if(cube.getLinearVelocity().y > 0) 
					cubeYDir = 0.5;
				else
					cubeYDir = 2;

				var jumpvec = new THREE.Vector3( 0,-gravity*value*cubeYDir*0.9, 0 );
				cube.applyCentralForce(jumpvec);
		    }
	//	}

	}

	function shipCollideWithObstacle(){

		//skeppets fart
		var shipSpeed = Math.abs(cube.getLinearVelocity().z);

		for (var vertexIndex = 0; vertexIndex < cube.geometry.vertices.length; vertexIndex++)
		{       
		    var localVertex = cube.geometry.vertices[vertexIndex].clone();
		    var globalVertex = localVertex.applyMatrix4(cube.matrix);
		    var directionVector = globalVertex.sub( cube.position );

		    var ray = new THREE.Raycaster( cube.position, directionVector.clone().normalize() );
		    var collisionResults = ray.intersectObjects( collideableMeshList );

		    //Krock!!
		    if ( collisionResults.length > 0 && collisionResults[0].distance <= directionVector.length() )
		    	if(shipSpeed > 200)	// tappar liv om farten är över 500
		    		shipTakesHit(shipSpeed);
		    
		}
	}

	var shipTakesHit = function(shipSpeed){

		//tappar liv beroende på hur fort man åker
    	shipSpeed/=400; // skalar ner

    	//räknar ut liv och hur mkt man tappat totalt
    	totalHealth-=shipSpeed;
    	totalHealthLost+=shipSpeed;

    	//visar rött i 0.1 sek
 		$('#redSplash').show();
 		setTimeout(function(){
			$('#redSplash').hide();
		}, 100);
    						
    	animateHealthBar();

	}

	var animateHealthBar = function(){

		$('#health').stop().animate({
 			width:totalHealth, // bredden på diven är totalt liv
 			marginLeft:totalHealthLost	// för att animare vänster -> höger
			}, 500, function(){	// callback, detta utförs när animationen är klar

				if(pixelsToNumber($('#health').css('width')) <= 200)
					$('#health').css('background-color', 'yellow');

				if(pixelsToNumber($('#health').css('width')) <= 100)
					$('#health').css('background-color', 'red');
			});					//att den ska gå uppifrån och ner

	}


	function shipControls(){

		var jumpvec = new THREE.Vector3( 0, 700, 0 );
		var downvec = new THREE.Vector3(0, -800, 0);
		var rightvec = new THREE.Vector3( 20, 0, 0 );
		var leftvec = new THREE.Vector3( -20, 0, 0 );
		var toscreenvec = new THREE.Vector3( 0, 0, 40 );
		var awayscreenvec = new THREE.Vector3( 0, 0, -30);


		//skeppets fart - Ändring för olika levels man når //gamepaused fungerar inte för man "svävar"  ..tryck "P"
		if ((cube.getLinearVelocity().z > startingSpeed*levelSpeed)&& (gamePaused != true)) {

			cube.applyCentralImpulse(awayscreenvec);			

			engine.positionStyle = Type.SPHERE;
		}

		//liten eld då man inte gasar
		else
			engine.positionStyle = Type.CUBE;

		//if ( keyboard.pressed("down") ) 
		//	cube.applyCentralImpulse(toscreenvec);

		//skeppets lutning
		if ( keyboard.pressed("right") ||  keyboard.pressed("left") ) {
			if ( keyboard.pressed("right") &&   keyboard.pressed("left") ) { //om båda knapparna hålls in -> räknas som dem är släppta
				stabilizeShip(dt, ship.rotation.z, 1.0);
			}

			else if ( keyboard.pressed("right") ) {

				if ( ship.position.x >= maxTransX -200) { 	//om skeppet närmar sig maxTransX, stabilisera
					ship.rotation.z = stabilizeShip(dt, ship.rotation.z, 5.0);
				}
				else{
					ship.rotation.z -= dt * PI * 2/3;
					cube.applyCentralImpulse(rightvec);
				}
				if(ship.rotation.z < -maxRotX)			
					ship.rotation.z = -maxRotX;
			}

			else if ( keyboard.pressed("left") ) {
				if ( ship.position.x <= -maxTransX +200) {
					ship.rotation.z = stabilizeShip(dt, ship.rotation.z, 5.0);
				}
				else{
					ship.rotation.z += dt * PI * 2/3;
					cube.applyCentralImpulse(leftvec);
				}
				if(ship.rotation.z > maxRotX ) {
					ship.rotation.z = maxRotX ;
				}	
			}
		}

		else if (ship.rotation.z != 0 ){
			ship.rotation.z = stabilizeShip( dt, ship.rotation.z ,1.0);
		}

		//console.log(ship.rotation.z);
		//skeppets x-position styrs av lutningen
		//ship.position.x -= ship.rotation.z*50;

/*		Används antagnligen inte.... finns ingen ship position

		if ( Math.abs(ship.position.x) >= maxTransX ) {
			ship.position.x = ship.position.x/Math.abs(ship.position.x) * maxTransX;
		}
*/

		if (jumpTime != 0.0 ) { //if a jump is in progress
			if (jumpClock.getElapsedTime() >= 1.0) { //if jump completed, end jump and reset variables to default values
				jumpClock.stop();
				jumpTime=0.0;
				ship.position.y = hoverDist;
				ship.rotation.x = 0;
			}
			else { //if the jump is still in progress

				jumpTime = jumpClock.getElapsedTime();

				//skeppet hänger ju alltid efter kuben nu..?
				//ship.position.y = jumpOrdive * jumpAmp * Math.sin( 1 * PI* jumpTime) + hoverDist;

				if(jumpOrdive === 0){
					ship.rotation.x = PI/16 *Math.sin( 2 * PI *jumpTime);
				}
				// rotation för hopp
				else
					ship.rotation.x = -PI/16 *Math.sin( 2 * PI *jumpTime);
			}
		}
		else if ( keyboard_2.down("space") ) { //if jump is not in progress and user hits space
			
			// för att undvika dubbelhopp.. men går att "bunnyjumpa" om man tajmar rätt;)
			if(Math.abs(cube.position.y) < 180)
			{
				cube.applyCentralImpulse(jumpvec);
				// 0 för den ska endast hänga efter kuben
				jumpOrdive = 0;
				jump(); //starts jump timer
			}
		}
		
		else if(keyboard.pressed("shift") ) {
			
			
			// om man inte ska kunna spammdyka och inte dyka i luften..
			if(Math.abs(cube.position.y) > 80 && Math.abs(cube.position.y) < 180)
			{
				cube.applyCentralImpulse(downvec);
				jumpOrdive = 1;
				jump();
			}
		}
		else if(keyboard_2.down("ctrl")) {
			makeBullet();
		}
		
		

	}

	//stabiliserar skeppet.. 
	//dt = delta time, 
	//axis = axel som ska stabiliseras, 
	//factor bestämmer hur snabbt det ska stabiliseras
	function stabilizeShip(dt,axis,factor)
	{
		if(axis < 0 ) {
			axis -= dt * PI * axis * factor;
		}
		else if (axis > 0 )
			axis -= dt * PI * axis * factor;		
		else
			axis = 0 ;
		return axis;
	}

	function jump() //starts a new jump timer
	{
		jumpClock = new THREE.Clock();
		jumpClock.start();
		jumpTime = jumpClock.getElapsedTime();
	}
	


	function render() 
	{
		renderer.render( scene, camera );
	}	

	//ground generating function	
	function generateGroundSegment() //generates a ground segment
	{
		generateGap();
		var segLength = Math.floor((Math.random()*1000)+minSegmentLength);			//den faktiska längden på det segment som genereras
		groundGeometry = new THREE.PlaneGeometry(laneWidth, segLength,2,6); 	//antalet segment är 1 default, tog bort 2 sista parametrarna..Lagg?


		coinGeometry = new THREE.CylinderGeometry( coinRadiusTop, coinRadiusTop, 10, 32 );
		var material = new THREE.MeshBasicMaterial( {color: 0xffff00, map: coinTexture, side: THREE.BackSide} );
		coin = new THREE.Mesh( coinGeometry, material );
		coin.name='coin';


		obstacleGeometry = new THREE.PlaneGeometry(laneWidth, obstacleHeight,20);
		var ground = new Physijs.BoxMesh(groundGeometry, groundMaterial);	
		var obstacle = new Physijs.BoxMesh(obstacleGeometry, obstacleMaterial); //hinder i banan, genereras på planet	


		/*RENSA ARRAY PÅ ONÖDIG DATA?? **/
		//if(collidebleMesh.length > 20)
		//	collidebleMesh = [];

		collideableMeshList.push(obstacle); // lägg till nytt objekt i array
		floorList.push(ground);

		var newGroundLane = Math.floor((Math.random()*5)-1); //randomgrejen genererar -1, 0 eller 1 ( alltså vilken lane som ground ska hamna i)
		if(newGroundLane == 3 || newGroundLane == 2) {
			newGroundLane = 0;
		}

		ground.rotation.x = PI / 2;
		coin.rotation.x = PI / 2;

		if( newGroundLane == prevGroundLane ||  prevGroundLane == 3) {
			ground.position.z = -groundPosZ - segLength/2;

			obstacle.position.z = -groundPosZ - segLength/2;
			coin.position.z = -groundPosZ - segLength/2;

			obstacle.position.z = ground.position.z;

			groundPosZ += segLength;			// öka på för att nästa segment ska hamna på korrekt plats
		}
		else {
			ground.position.z = -groundPosZ - segLength/2 + laneOverlap;

			coin.position.z =-groundPosZ - segLength/3 + laneOverlap;
			//groundPosZ += segLength -600 ;			// öka på för att nästa segment ska hamna på korrekt plats

			obstacle.position.z = ground.position.z;
			groundPosZ += (segLength-laneOverlap) ;			// öka på för att nästa segment ska hamna på korrekt plats

		}

		ground.position.x = laneWidth * newGroundLane;
		ground.position.y = groundPosY;	

		obstacle.position.x = laneWidth * newGroundLane;
		obstacle.position.y = obstacleHeight/2;

		coin.position.y = hoverDist*2;
		coin.position.x = laneWidth * newGroundLane;
			//inte så många obstacle
			if(count % 5 == 0)
			{
					scene.add(obstacle)	;
			}


			if((count-2) % 5 == 0)
			{
				scene.add(coin);
				var temp = new THREE.Vector3( coin.position.x, coin.position.y, coin.position.z );
				coins.push(coin);
				checkIfCollect.push(false);
				
			}

		count++;

		prevGroundLane = newGroundLane;

		//För att ibland kunna välja väg, höger eller vänster
		//Lite fel nu.. blir överlappning ibland.. orkar inte fixa atm
		if(Math.abs(newGroundLane)==1 && Math.floor(Math.random()*5) == 1) {
			var ground2 = new Physijs.BoxMesh(groundGeometry, groundMaterial);
			ground2.rotation.x = ground.rotation.x;
			ground2.position.x = -1*ground.position.x;
			ground2.position.y = groundPosY;
			ground2.position.z = ground.position.z;
			ground2.name = 'ground';
			floorList.push(ground2);
			scene.add(ground2);
			prevGroundLane = 3;
		}
		ground.name = 'ground';
		scene.add(ground);

	}	

	function generateGap(){
		if(Math.floor(Math.random()*5) == 1)
			groundPosZ += 1500;
	}

	///MÅSTE!!! MÅSTE lägga till removeGroundSegment() ( tror jag.. )
	function removeGroundSegment() 
	{
	}

	// revolutions per second
  	var angularSpeed = 0.8; 
  	var lastTime = 0;

	function animateCoin()
	{
        // update
        var time = (new Date()).getTime();
        var timeDiff = time - lastTime;
        var angleChange = angularSpeed * timeDiff * 2 * PI / 1000;
       	var i;
      

       	for (i = 0 ; i < coins.length; i++) {
        	coins[i].rotation.z += angleChange;
        	
        }
        
        lastTime = time;
	}
	
	function animateTotalCoin()
	{
        // update
        var time = (new Date()).getTime();
        var timeDiff = time - lastTime;
        var angleChange = angularSpeed * timeDiff * 2 * PI / 1000;
       	var i;
    	
       	totalCoinMesh.rotation.z += angleChange;
        lastTime = time;
	}
	

	//Orre edits
	function checkCoinCollision()
	{
		if(cube.position.z < -2000)
		{

			if(coins[indexCoins])
			{

				var coinX = coins[indexCoins].position.x;
				var coinY = coins[indexCoins].position.y;
				var coinZ = coins[indexCoins].position.z;

				//Jämför kubens postion, det fungerade inte att jämföra skeppets
				var shipX = cube.position.x,
					shipY = cube.position.y,
					shipZ = cube.position.z;

				//console.log(coinX);
				//console.log(coinY);
				//console.log(coinZ);
				//console.log(coins[indexCoins].position.z);
				//console.log(cubeY + shipY);
				//console.log(coinY);

				if(	coinX >= (shipX - cubeX) && coinY <= (shipY + cubeY) &&
					coinX <= (shipX + cubeX) && coinY >=(shipY - cubeY) &&
					shipZ < (coinZ + 200) && shipZ > (coinZ - 200))
				{
					//kollar om coinet är true eller false, sedan sätter till true eftersom det är träffat och tar bort det
					if(!Boolean(checkIfCollect[indexCoins]))
					{
						checkIfCollect[indexCoins] = true;
						TOTALCOINS++;
						indexCoins++;
						playCoinSound(); 		//hittas i sound.js
						$('#coins #totalcoins').html(TOTALCOINS);
						scene.remove(coins[indexCoins-1]);


					}

					//Byt till nästa coin att jämföra en collision med	
				}else if(shipZ < (coinZ - 300))
				{

					indexCoins++;
				}
			}
		}
	}
	//
	//skapa ett skott och lägger till partikelsystem
	function makeBullet(){
		bulletMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000} );
																//topradius, bottomradius, height,densitet
		bulletMesh = new Physijs.SphereMesh(new THREE.SphereGeometry(bulletX,bulletY,2), bulletMaterial, 0.01); 
		bulletMesh.position.set(cube.position.x,cube.position.y,cube.position.z-(cubeZ+bulletZ)/2); //Z-position så att den inte kolliderar med Kuben.
		bulletMesh.rotation.x = Math.PI/2;
		scene.add(bulletMesh);

		
		//skapa partikelsystem
		bulletEngine = new ParticleEngine();
		bulletEngine.setValues( Examples.fireball );
		bulletEngine.initialize(); 
		
	
		bulletMesh.applyCentralImpulse(new THREE.Vector3(0,0,-500));	
		bulletMesh.visible = true;
		bulletShot = true;
		
		bulletMesh.add(bulletEngine.particleMesh);
		


	}
	//restart page på ENTER 
    /*$(document).keypress(function(e) {
    if(e.which == 13) {
    	if(gamePaused != true)
    	{
    		gamePaused = true;
    	}else
    	{
    		gamePaused = false;
    		animate();
    	}
        
    }
	});
	*/

});

