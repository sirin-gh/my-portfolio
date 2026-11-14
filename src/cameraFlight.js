// ============================================================
// cameraFlight.js
//
// Smooth cinematic camera system
//
// FIXES:
// - front-facing horizontal initial view
// - complete room visible on first load
// - complete object framing
// - obstacle-aware object views
// - smooth camera flights
// - 3D room moves down when EXPLORE handle is dragged
// ============================================================

import * as THREE from 'three';

import {
    scene,
    camera,
    controls
} from './scene.js';


// ============================================================
// STATE
// ============================================================

let activeFlight = null;

let homeCameraPosition = null;

let homeTarget = null;

let homeSceneSize = null;


// ============================================================
// IMPORTANT
//
// This forces the first view to face the model STRAIGHT ON.
//
// It no longer inherits the previous diagonal camera angle.
// ============================================================

const FRONT_DIRECTION =
    new THREE.Vector3(
        0,
        0,
        1
    ).normalize();


let homeViewDirection =
    FRONT_DIRECTION.clone();


// ============================================================
// SHARED
// ============================================================

const worldUp =
    new THREE.Vector3(
        0,
        1,
        0
    );


const obstacleRaycaster =
    new THREE.Raycaster();


// ============================================================
// HELPERS
// ============================================================

function clamp(
    value,
    min,
    max
) {

    return Math.min(
        max,
        Math.max(
            min,
            value
        )
    );

}


// ============================================================
// EASING
// ============================================================

function easeInOutCubic(
    t
) {

    return t < 0.5

        ? 4 *
          t *
          t *
          t

        : 1 -

          Math.pow(
              -2 * t + 2,
              3
          ) / 2;

}


function smootherStep(
    t
) {

    t =
        clamp(
            t,
            0,
            1
        );


    return (
        t *
        t *
        t *
        (
            t *
            (
                t * 6 -
                15
            ) +
            10
        )
    );

}


// ============================================================
// CHILD CHECK
// ============================================================

function isChildOf(
    object,
    parent
) {

    let current =
        object;


    while (
        current
    ) {

        if (
            current === parent
        ) {

            return true;

        }


        current =
            current.parent;

    }


    return false;

}


// ============================================================
// GET SCENE MODEL BOUNDS
// ============================================================

function getSceneMeshBounds() {

    const box =
        new THREE.Box3();


    let found =
        false;


    scene.traverse(
        object => {


            if (
                !object.isMesh ||
                !object.visible
            ) {

                return;

            }


            const objectBox =
                new THREE.Box3()
                    .setFromObject(
                        object
                    );


            if (
                objectBox.isEmpty()
            ) {

                return;

            }


            if (
                !found
            ) {

                box.copy(
                    objectBox
                );


                found =
                    true;

            } else {

                box.union(
                    objectBox
                );

            }

        }
    );


    return found
        ? box
        : null;

}


// ============================================================
// COMPLETE CLICKABLE OBJECT
// ============================================================

function resolveCompleteObject(
    clickedObject
) {

    if (
        !clickedObject
    ) {

        return null;

    }


    const definitionName =
        clickedObject.userData?.name;


    if (
        definitionName
    ) {

        const completeObject =
            scene.getObjectByName(
                definitionName
            );


        if (
            completeObject
        ) {

            return completeObject;

        }

    }


    return clickedObject;

}


// ============================================================
// FLATTEN DIRECTION
// ============================================================

function flattenDirection(
    direction
) {

    const result =
        direction.clone();


    result.y =
        0;


    if (
        result.lengthSq() <
        0.000001
    ) {

        result.copy(
            FRONT_DIRECTION
        );

    }


    result.normalize();


    return result;

}


// ============================================================
// ROTATE DIRECTION AROUND Y
// ============================================================

function rotateDirectionY(
    direction,
    degrees
) {

    return direction
        .clone()
        .applyAxisAngle(

            worldUp,

            THREE.MathUtils.degToRad(
                degrees
            )

        )
        .normalize();

}


// ============================================================
// CAMERA RIGHT
// ============================================================

function getCameraRight(
    cameraDirection
) {

    const forward =
        cameraDirection
            .clone()
            .multiplyScalar(
                -1
            );


    const right =
        new THREE.Vector3()
            .crossVectors(
                forward,
                worldUp
            );


    if (
        right.lengthSq() <
        0.000001
    ) {

        right.set(
            1,
            0,
            0
        );

    }


    return right.normalize();

}


// ============================================================
// FIT DISTANCE
// ============================================================

function calculateFitDistance(
    size,
    margin = 1.2
) {

    const verticalFov =
        THREE.MathUtils.degToRad(
            camera.fov
        );


    const horizontalFov =

        2 *

        Math.atan(

            Math.tan(
                verticalFov / 2
            )

            *

            camera.aspect

        );


    const verticalDistance =

        (
            size.y / 2
        )

        /

        Math.tan(
            verticalFov / 2
        );


    const horizontalDistance =

        (
            size.x / 2
        )

        /

        Math.tan(
            horizontalFov / 2
        );


    const depthDistance =
        size.z *
        1.10;


    return Math.max(

        verticalDistance,

        horizontalDistance,

        depthDistance,

        1

    ) * margin;

}


// ============================================================
// CREATE EXACT FRONT-FACING HOME VIEW
//
// ONLY CHANGE HERE:
// The first opening camera is pulled a bit farther back
// so the model looks more like your second screenshot.
// ============================================================

function createNormalHomeView() {

    const sceneBounds =
        getSceneMeshBounds();


    if (
        !sceneBounds
    ) {

        return;

    }


    const center =
        new THREE.Vector3();


    const size =
        new THREE.Vector3();


    sceneBounds.getCenter(
        center
    );


    sceneBounds.getSize(
        size
    );


    homeSceneSize =
        size.clone();


    // ========================================================
    // FORCE FRONT VIEW
    // ========================================================

    homeViewDirection =
        FRONT_DIRECTION.clone();


    // ========================================================
    // FIT WHOLE MODEL
    //
    // Increased from 1.18 to 1.34
    // so the first view is more extended / zoomed out.
    // ========================================================

    const distance =
        calculateFitDistance(
            size,
            1.34
        );


    // ========================================================
    // CENTER TARGET
    // ========================================================

    const target =
        center.clone();


    target.y +=
        size.y *
        0.01;


    // ========================================================
    // CAMERA
    // ========================================================

    const position =
        target
            .clone()
            .addScaledVector(

                homeViewDirection,

                distance

            );


    position.y +=
        size.y *
        0.02;


    camera.up.set(
        0,
        1,
        0
    );


    camera.position.copy(
        position
    );


    controls.target.copy(
        target
    );


    controls.update();

}


// ============================================================
// SAVE HOME
// ============================================================

export function saveHomeCamera() {

    createNormalHomeView();


    homeCameraPosition =
        camera.position.clone();


    homeTarget =
        controls.target.clone();


    console.log(
        '📷 Front-facing home camera ready'
    );

}


// ============================================================
// MOVE WHOLE 3D ROOM WITH EXPLORE HANDLE
//
// progress:
// 0 = original room position
// 1 = room visually moved downward
//
// To make the ROOM appear lower,
// the camera + target move upward together.
// ============================================================

export function setSceneDragProgress(
    progress
) {

    if (
        !homeCameraPosition ||
        !homeTarget
    ) {

        return;

    }


    progress =
        clamp(
            progress,
            0,
            1
        );


    cancelCameraFlight();


    const sceneHeight =
        homeSceneSize?.y ??
        5;


    const verticalMovement =
        Math.max(

            sceneHeight *
            0.72,

            3.0

        ) *
        progress;


    camera.position.copy(
        homeCameraPosition
    );


    controls.target.copy(
        homeTarget
    );


    camera.position.y +=
        verticalMovement;


    controls.target.y +=
        verticalMovement;


    camera.up.set(
        0,
        1,
        0
    );


    controls.update();

}


// ============================================================
// CANCEL FLIGHT
// ============================================================

export function cancelCameraFlight() {

    if (
        activeFlight !== null
    ) {

        cancelAnimationFrame(
            activeFlight
        );


        activeFlight =
            null;

    }


    controls.enabled =
        true;

}


// ============================================================
// CAMERA CURVE
// ============================================================

function createCameraCurve(
    start,
    end
) {

    const middle =
        start
            .clone()
            .lerp(
                end,
                0.5
            );


    const direction =
        end
            .clone()
            .sub(
                start
            );


    direction.y =
        0;


    const distance =
        direction.length();


    if (
        distance >
        0.001
    ) {

        direction.normalize();


        const side =
            new THREE.Vector3(
                -direction.z,
                0,
                direction.x
            );


        middle.addScaledVector(

            side,

            Math.min(
                distance *
                0.035,
                0.35
            )

        );

    }


    middle.y +=
        Math.min(
            distance *
            0.01,
            0.15
        );


    return new THREE.CatmullRomCurve3(

        [

            start.clone(),

            middle,

            end.clone()

        ],

        false,

        'catmullrom',

        0.5

    );

}


// ============================================================
// GENERAL CAMERA FLIGHT
// ============================================================

export function flyCameraTo({

    position,

    target,

    duration = null,

    onComplete = null

}) {

    if (
        !position ||
        !target
    ) {

        return;

    }


    cancelCameraFlight();


    const startPosition =
        camera.position.clone();


    const startTarget =
        controls.target.clone();


    const endPosition =
        position.clone();


    const endTarget =
        target.clone();


    const distance =
        startPosition.distanceTo(
            endPosition
        );


    const flightDuration =

        duration ??

        clamp(

            900 +
            distance *
            70,

            1050,

            2600

        );


    const curve =
        createCameraCurve(
            startPosition,
            endPosition
        );


    const startTime =
        performance.now();


    controls.enabled =
        false;


    function animate(
        now
    ) {

        const rawProgress =
            clamp(

                (
                    now -
                    startTime
                )

                /

                flightDuration,

                0,

                1

            );


        const positionProgress =
            easeInOutCubic(
                rawProgress
            );


        const targetProgress =
            smootherStep(
                rawProgress
            );


        camera.position.copy(

            curve.getPoint(
                positionProgress
            )

        );


        controls.target
            .lerpVectors(

                startTarget,

                endTarget,

                targetProgress

            );


        camera.up.set(
            0,
            1,
            0
        );


        controls.update();


        if (
            rawProgress <
            1
        ) {

            activeFlight =
                requestAnimationFrame(
                    animate
                );

        } else {

            camera.position.copy(
                endPosition
            );


            controls.target.copy(
                endTarget
            );


            camera.up.set(
                0,
                1,
                0
            );


            controls.update();


            controls.enabled =
                true;


            activeFlight =
                null;


            if (
                typeof onComplete ===
                'function'
            ) {

                onComplete();

            }

        }

    }


    activeFlight =
        requestAnimationFrame(
            animate
        );

}


// ============================================================
// VISIBILITY SAMPLE POINTS
// ============================================================

function createVisibilitySamples(
    center,
    size
) {

    return [

        center.clone(),


        center.clone().add(

            new THREE.Vector3(
                0,
                size.y *
                0.30,
                0
            )

        ),


        center.clone().add(

            new THREE.Vector3(
                0,
                -size.y *
                0.25,
                0
            )

        ),


        center.clone().add(

            new THREE.Vector3(
                size.x *
                0.28,
                0,
                0
            )

        ),


        center.clone().add(

            new THREE.Vector3(
                -size.x *
                0.28,
                0,
                0
            )

        )

    ];

}


// ============================================================
// OBSTRUCTION SCORE
// ============================================================

function calculateObstructionScore(
    candidatePosition,
    targetObject,
    samplePoints
) {

    let score =
        0;


    for (
        const sample
        of samplePoints
    ) {

        const direction =
            sample
                .clone()
                .sub(
                    candidatePosition
                );


        const distance =
            direction.length();


        if (
            distance <
            0.0001
        ) {

            continue;

        }


        direction.normalize();


        obstacleRaycaster.set(

            candidatePosition,

            direction

        );


        obstacleRaycaster.near =
            0.05;


        obstacleRaycaster.far =
            Math.max(

                0.1,

                distance -
                0.05

            );


        const hits =
            obstacleRaycaster
                .intersectObjects(

                    scene.children,

                    true

                );


        for (
            const hit
            of hits
        ) {


            if (
                isChildOf(
                    hit.object,
                    targetObject
                )
            ) {

                continue;

            }


            if (
                !hit.object.visible
            ) {

                continue;

            }


            score +=
                1;


            break;

        }

    }


    return score;

}


// ============================================================
// CHOOSE CLEAR VIEW
// ============================================================

function chooseBestDirection(
    targetObject,
    center,
    size,
    distance
) {

    const testAngles = [

        0,

        -20,

        20,

        -40,

        40,

        -60,

        60,

        -80,

        80

    ];


    const samples =
        createVisibilitySamples(
            center,
            size
        );


    let bestDirection =
        homeViewDirection.clone();


    let bestScore =
        Infinity;


    for (
        const angle
        of testAngles
    ) {

        const direction =
            rotateDirectionY(

                homeViewDirection,

                angle

            );


        const candidate =
            center
                .clone()
                .addScaledVector(

                    direction,

                    distance

                );


        candidate.y =
            center.y +
            size.y *
            0.04;


        const obstructionScore =
            calculateObstructionScore(

                candidate,

                targetObject,

                samples

            );


        const anglePenalty =
            Math.abs(
                angle
            ) *
            0.002;


        const totalScore =
            obstructionScore +
            anglePenalty;


        if (
            totalScore <
            bestScore
        ) {

            bestScore =
                totalScore;


            bestDirection.copy(
                direction
            );

        }


        if (
            obstructionScore ===
            0 &&
            Math.abs(
                angle
            ) <=
            20
        ) {

            break;

        }

    }


    return bestDirection;

}


// ============================================================
// OBJECT DISTANCE
// ============================================================

function calculateObjectDistance(
    size
) {

    return calculateFitDistance(
        size,
        1.65
    );

}


// ============================================================
// FLY TO OBJECT
// ============================================================

export function flyToObject(
    clickedObject,
    options = {}
) {

    const targetObject =
        resolveCompleteObject(
            clickedObject
        );


    if (
        !targetObject
    ) {

        return;

    }


    const panelSide =
        options.panelSide ||
        'right';


    const box =
        new THREE.Box3()
            .setFromObject(
                targetObject
            );


    if (
        box.isEmpty()
    ) {

        return;

    }


    const center =
        new THREE.Vector3();


    const size =
        new THREE.Vector3();


    box.getCenter(
        center
    );


    box.getSize(
        size
    );


    const maxSize =
        Math.max(

            size.x,

            size.y,

            size.z,

            0.2

        );


    const distance =
        Math.max(

            calculateObjectDistance(
                size
            ),

            3.5

        );


    const bestDirection =
        chooseBestDirection(

            targetObject,

            center,

            size,

            distance

        );


    const right =
        getCameraRight(
            bestDirection
        );


    const compositionAmount =
        Math.max(

            maxSize *
            0.48,

            0.45

        );


    const target =
        center.clone();


    if (
        panelSide ===
        'left'
    ) {

        target.addScaledVector(

            right,

            -compositionAmount

        );

    } else {

        target.addScaledVector(

            right,

            compositionAmount

        );

    }


    target.y +=
        size.y *
        0.01;


    const destination =
        target
            .clone()
            .addScaledVector(

                bestDirection,

                distance

            );


    destination.y =
        center.y +
        size.y *
        0.04;


    flyCameraTo({

        position:
            destination,

        target

    });

}


// ============================================================
// RETURN HOME
// ============================================================

export function flyHome() {

    if (
        !homeCameraPosition ||
        !homeTarget
    ) {

        return;

    }


    flyCameraTo({

        position:
            homeCameraPosition,

        target:
            homeTarget,

        duration:
            1500

    });

}