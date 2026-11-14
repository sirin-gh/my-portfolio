// ============================================================
// main.js
// Entry point + animation loop
// ============================================================

import * as THREE from 'three';

import './style.css';
import './projectsUI.js';

import {

    scene,

    camera,

    renderer,

    controls,

    composer,

    candleLight,

    candleLight2,

    ambientLight,

    moonLight,

    fillLight,

    rimLight,

    updatePostProcessing,

    toggleBloom,

    toggleAfterimage

} from './scene.js';


import {

    loadScene,

    glowMeshes

} from './loader.js';


import {

    saveHomeCamera,

    setSceneDragProgress

} from './cameraFlight.js';


import './interaction.js';


import {

    initEnhancedParticles,

    updateEnhancedParticles,

    setWeather

} from './particles-enhanced.js';


// ============================================================
// EFFECT CONTROLS
// ============================================================

window.toggleBloom =
    toggleBloom;


window.toggleAfterimage =
    toggleAfterimage;


// ============================================================
// SOUND
// ============================================================

const listener =
    new THREE.AudioListener();


camera.add(
    listener
);


const bgSound =
    new THREE.Audio(
        listener
    );


let soundOn =
    false;


new THREE.AudioLoader().load(

    './sounds/moon.mp3',

    buffer => {


        bgSound.setBuffer(
            buffer
        );


        bgSound.setLoop(
            true
        );


        bgSound.setVolume(
            0.35
        );

    },

    undefined,

    error => {


        console.error(
            'Audio error:',
            error
        );

    }

);


// ============================================================
// SOUND BUTTON
// ============================================================

window.toggleSound =
    () => {


        soundOn =
            !soundOn;


        if (
            soundOn
        ) {


            if (
                bgSound.buffer &&
                !bgSound.isPlaying
            ) {

                bgSound.play();

            }


        } else {


            if (
                bgSound.isPlaying
            ) {

                bgSound.stop();

            }

        }


        const button =
            document.getElementById(
                'btn-sound'
            );


        if (
            button
        ) {


            button.textContent =
                soundOn

                    ? '♪ ON'

                    : '♪ Sound';

        }

    };


// ============================================================
// DAY / NIGHT
// ============================================================

let isNight =
    true;


window.toggleDayNight =
    () => {


        isNight =
            !isNight;


        const startTime =
            performance.now();


        const duration =
            1200;


        const fromBackground =
            scene.background.clone();


        const fromFog =
            scene.fog.color.clone();


        const targetBackground =
            new THREE.Color(

                isNight

                    ? 0x0a0a1a

                    : 0x2a1a3a

            );


        const targetFog =
            new THREE.Color(

                isNight

                    ? 0x0a0a1a

                    : 0x2a1a3a

            );


        const fromAmbient =
            ambientLight.intensity;


        const targetAmbient =
            isNight
                ? 1.0
                : 2.2;


        const fromMoon =
            moonLight.intensity;


        const targetMoon =
            isNight
                ? 4.0
                : 6.5;


        (
            function animate(
                now
            ) {


                const progress =
                    Math.min(

                        (
                            now -
                            startTime
                        )

                        /

                        duration,

                        1

                    );


                scene.background
                    .lerpColors(

                        fromBackground,

                        targetBackground,

                        progress

                    );


                scene.fog.color
                    .lerpColors(

                        fromFog,

                        targetFog,

                        progress

                    );


                ambientLight.intensity =
                    THREE.MathUtils.lerp(

                        fromAmbient,

                        targetAmbient,

                        progress

                    );


                moonLight.intensity =
                    THREE.MathUtils.lerp(

                        fromMoon,

                        targetMoon,

                        progress

                    );


                if (
                    progress <
                    1
                ) {

                    requestAnimationFrame(
                        animate
                    );

                }

            }

        )(
            performance.now()
        );


        const button =
            document.getElementById(
                'btn-night'
            );


        if (
            button
        ) {


            button.textContent =
                isNight

                    ? '☀ Day'

                    : '🌙 Night';

        }

    };


// ============================================================
// WEATHER
// ============================================================

let weatherIndex =
    0;


const weathers = [

    'embers',

    'rain',

    'snow',

    'ash'

];


window.toggleWeather =
    () => {


        weatherIndex =

            (
                weatherIndex +
                1
            )

            %

            weathers.length;


        setWeather(

            weathers[
                weatherIndex
            ]

        );

    };


// ============================================================
// PARTICLES
// ============================================================

initEnhancedParticles();


// ============================================================
// LOAD MODEL
// ============================================================

loadScene(

    () => {


        saveHomeCamera();


        console.log(
            '✅ Front camera ready'
        );

    }

);


// ============================================================
// RENDER LOOP
// ============================================================

const clock =
    new THREE.Clock();


let postTime =
    0;


renderer.setAnimationLoop(

    () => {


        const time =
            clock.getElapsedTime();


        postTime +=
            0.016;


        // ====================================================
        // CANDLE FLICKER
        // ====================================================

        const flicker =

            Math.sin(
                time *
                6.2
            ) *
            0.6

            +

            Math.sin(
                time *
                3.8
            ) *
            0.4

            +

            Math.sin(
                time *
                12.5
            ) *
            0.25;


        candleLight.intensity =

            2.8 +

            flicker *
            0.35;


        candleLight2.intensity =

            2.2 +

            Math.sin(

                time *
                5.2 +
                1.3

            ) *

            0.25;


        // ====================================================
        // CANDLE DRIFT
        // ====================================================

        candleLight.position.x +=

            (
                Math.sin(
                    time *
                    1.8
                ) *
                0.012

                -

                candleLight.position.x *
                0.006
            );


        candleLight.position.z +=

            (
                Math.cos(
                    time *
                    1.5
                ) *
                0.012

                -

                candleLight.position.z *
                0.006
            );


        // ====================================================
        // GLOW MESHES
        // ====================================================

        for (
            const glow
            of glowMeshes
        ) {


            if (
                !glow.mesh?.material
            ) {

                continue;

            }


            if (
                glow.isCharacter
            ) {


                const heartbeat =

                    Math.sin(
                        time *
                        5
                    ) *
                    0.15

                    +

                    Math.sin(
                        time *
                        2.5
                    ) *
                    0.1;


                glow.mesh.material
                    .emissiveIntensity =

                    Math.max(

                        0.3,

                        glow.baseIntensity +
                        heartbeat

                    );


            } else {


                glow.mesh.material
                    .emissiveIntensity =

                    glow.baseIntensity

                    +

                    Math.sin(

                        time *
                        2.5 +

                        glow.baseIntensity

                    ) *

                    0.2;

            }

        }


        updateEnhancedParticles(
            time
        );


        updatePostProcessing(
            postTime
        );


        controls.update();


        composer.render();

    }

);


// ============================================================
// EXPLORE DRAG CONTROL
// ============================================================

const scrollControl =
    document.getElementById(
        'page-scroll-control'
    );


const scrollTrack =
    document.getElementById(
        'page-scroll-track'
    );


const scrollHandle =
    document.getElementById(
        'page-scroll-handle'
    );


const projectsSection =
    document.getElementById(
        'projects'
    );


// ============================================================
// PORTFOLIO SCROLL TARGET
// ============================================================

function getPortfolioDestination() {


    if (
        projectsSection
    ) {

        return projectsSection.offsetTop;

    }


    return Math.max(

        0,

        document.documentElement
            .scrollHeight

        -

        window.innerHeight

    );

}


// ============================================================
// EXPLORE CONTROL
// ============================================================

if (

    scrollControl &&

    scrollTrack &&

    scrollHandle

) {


    let dragging =
        false;


    let moved =
        false;


    let startPointerY =
        0;


    let startTop =
        0;


    // ========================================================
    // TRACK LIMIT
    // ========================================================

    function maximumTop() {


        return Math.max(

            0,

            scrollTrack.clientHeight -
            scrollHandle.offsetHeight

        );

    }


    // ========================================================
    // SET HANDLE
    // ========================================================

    function setHandleTop(
        value
    ) {


        const result =
            THREE.MathUtils.clamp(

                value,

                0,

                maximumTop()

            );


        scrollHandle.style.top =
            `${result}px`;


        return result;

    }


    // ========================================================
    // INITIAL POSITION
    // ========================================================

    requestAnimationFrame(
        () => {

            setHandleTop(
                0
            );


            setSceneDragProgress(
                0
            );

        }
    );


    // ========================================================
    // START DRAG
    // ========================================================

    scrollHandle.addEventListener(

        'pointerdown',

        event => {


            event.preventDefault();

            event.stopPropagation();


            dragging =
                true;


            moved =
                false;


            startPointerY =
                event.clientY;


            startTop =
                scrollHandle.offsetTop;


            scrollHandle.classList.add(
                'dragging'
            );


            scrollHandle.setPointerCapture(
                event.pointerId
            );

        }

    );


    // ========================================================
    // DRAG
    // ========================================================

    scrollHandle.addEventListener(

        'pointermove',

        event => {


            if (
                !dragging
            ) {

                return;

            }


            event.preventDefault();

            event.stopPropagation();


            const delta =
                event.clientY -
                startPointerY;


            if (
                Math.abs(
                    delta
                ) >
                3
            ) {

                moved =
                    true;

            }


            const top =
                setHandleTop(

                    startTop +
                    delta

                );


            const max =
                maximumTop();


            const progress =
                max >
                0

                    ? top / max

                    : 0;


            // =================================================
            // THIS IS THE IMPORTANT FIX
            //
            // The entire Three.js room now visually moves down
            // while the purple button is dragged down.
            // =================================================

            setSceneDragProgress(
                progress
            );


            // =================================================
            // PAGE ALSO MOVES TOWARD PROJECTS
            // =================================================

            const destination =
                getPortfolioDestination();


            if (
                destination >
                0
            ) {

                window.scrollTo({

                    top:
                        destination *
                        progress,

                    behavior:
                        'auto'

                });

            }

        }

    );


    // ========================================================
    // ANIMATE HANDLE + MODEL + PAGE
    // ========================================================

    function animateTo(
        goDown
    ) {


        const max =
            maximumTop();


        const initialHandle =
            scrollHandle.offsetTop;


        const finalHandle =
            goDown
                ? max
                : 0;


        const initialProgress =
            max >
            0

                ? initialHandle /
                  max

                : 0;


        const finalProgress =
            goDown
                ? 1
                : 0;


        const initialScroll =
            window.scrollY;


        const finalScroll =
            goDown

                ? getPortfolioDestination()

                : 0;


        const start =
            performance.now();


        const duration =
            900;


        function animate(
            now
        ) {


            const raw =
                Math.min(

                    (
                        now -
                        start
                    )

                    /

                    duration,

                    1

                );


            const eased =

                raw <
                0.5

                    ? 4 *
                      raw *
                      raw *
                      raw

                    : 1 -

                      Math.pow(
                          -2 *
                          raw +
                          2,
                          3
                      ) / 2;


            const currentHandle =
                THREE.MathUtils.lerp(

                    initialHandle,

                    finalHandle,

                    eased

                );


            const currentProgress =
                THREE.MathUtils.lerp(

                    initialProgress,

                    finalProgress,

                    eased

                );


            const currentScroll =
                THREE.MathUtils.lerp(

                    initialScroll,

                    finalScroll,

                    eased

                );


            setHandleTop(
                currentHandle
            );


            // Move actual 3D model visually.

            setSceneDragProgress(
                currentProgress
            );


            if (
                finalScroll >
                0
            ) {

                window.scrollTo({

                    top:
                        currentScroll,

                    behavior:
                        'auto'

                });

            }


            if (
                raw <
                1
            ) {

                requestAnimationFrame(
                    animate
                );

            }

        }


        requestAnimationFrame(
            animate
        );

    }


    // ========================================================
    // STOP DRAG
    // ========================================================

    function stopDrag(
        event
    ) {


        if (
            !dragging
        ) {

            return;

        }


        dragging =
            false;


        scrollHandle.classList.remove(
            'dragging'
        );


        try {

            scrollHandle.releasePointerCapture(
                event.pointerId
            );

        } catch {

            // Already released.

        }


        const max =
            maximumTop();


        const progress =
            max >
            0

                ? scrollHandle.offsetTop /
                  max

                : 0;


        animateTo(
            progress >=
            0.45
        );

    }


    scrollHandle.addEventListener(
        'pointerup',
        stopDrag
    );


    scrollHandle.addEventListener(
        'pointercancel',
        stopDrag
    );


    // ========================================================
    // CLICK WITHOUT DRAGGING
    // ========================================================

    scrollHandle.addEventListener(

        'click',

        event => {


            event.preventDefault();

            event.stopPropagation();


            if (
                moved
            ) {

                moved =
                    false;

                return;

            }


            const max =
                maximumTop();


            const isDown =
                scrollHandle.offsetTop >
                max *
                0.5;


            animateTo(
                !isDown
            );

        }

    );


    // ========================================================
    // PROTECT THREE.JS INTERACTIONS
    // ========================================================

    [

        'mousedown',

        'mouseup',

        'dblclick',

        'wheel'

    ].forEach(

        eventName => {


            scrollControl.addEventListener(

                eventName,

                event => {

                    event.stopPropagation();

                }

            );

        }

    );

}