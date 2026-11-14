// ============================================================
// scene.js  —  Enhanced Post-Processing Magic
// ============================================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';


// ── Scene ────────────────────────────────────────────────────

export const scene = new THREE.Scene();

scene.background = new THREE.Color(0x0a0a1a);

scene.fog = new THREE.FogExp2(
    0x0a0a1a,
    0.0025
);


// ── Camera ───────────────────────────────────────────────────

export const camera =
    new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.01,
        5000
    );

camera.position.set(
    8,
    6,
    10
);

camera.lookAt(
    0,
    1,
    0
);


// ── Renderer ─────────────────────────────────────────────────

const canvas =
    document.getElementById('canvas');


export const renderer =
    new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);


renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;


renderer.toneMapping =
    THREE.ACESFilmicToneMapping;


renderer.toneMappingExposure =
    0.7;


renderer.outputColorSpace =
    THREE.SRGBColorSpace;


// ── LIGHTS ───────────────────────────────────────────────────

export const ambientLight =
    new THREE.AmbientLight(
        0x8866aa,
        1.1
    );

scene.add(
    ambientLight
);


export const moonLight =
    new THREE.DirectionalLight(
        0xffcc88,
        4.5
    );

moonLight.position.set(
    2,
    3,
    1.5
);

moonLight.castShadow = true;

moonLight.shadow.mapSize.set(
    2048,
    2048
);

scene.add(
    moonLight
);


export const fillLight =
    new THREE.DirectionalLight(
        0xaa88ff,
        0.9
    );

fillLight.position.set(
    -1.5,
    1,
    -1.5
);

scene.add(
    fillLight
);


export const candleLight =
    new THREE.PointLight(
        0xffaa66,
        3.0,
        16
    );

candleLight.position.set(
    0,
    1.5,
    0
);

scene.add(
    candleLight
);


export const candleLight2 =
    new THREE.PointLight(
        0xff8844,
        2.5,
        14
    );

candleLight2.position.set(
    2.5,
    1.5,
    1.8
);

scene.add(
    candleLight2
);


export const rimLight =
    new THREE.PointLight(
        0xaa66ff,
        1.3
    );

rimLight.position.set(
    -2,
    2,
    -2.5
);

scene.add(
    rimLight
);


// ── OrbitControls ────────────────────────────────────────────

export const controls =
    new OrbitControls(
        camera,
        renderer.domElement
    );


controls.enableDamping = true;

controls.dampingFactor = 0.07;

controls.enablePan = true;

controls.panSpeed = 0.7;

controls.rotateSpeed = 0.9;

controls.zoomSpeed = 1.1;

controls.minDistance = 2.5;

controls.maxDistance = 25;

controls.target.set(
    0,
    1.2,
    0
);

controls.update();


// ── POST PROCESSING ──────────────────────────────────────────

export const composer =
    new EffectComposer(
        renderer
    );


composer.addPass(
    new RenderPass(
        scene,
        camera
    )
);


// ── Bloom ────────────────────────────────────────────────────

export const bloomPass =
    new UnrealBloomPass(

        new THREE.Vector2(
            window.innerWidth,
            window.innerHeight
        ),

        0.5,

        0.4,

        0.6
    );


composer.addPass(
    bloomPass
);


// ── Ghost / Afterimage ───────────────────────────────────────

export const afterimagePass =
    new AfterimagePass(
        0.96
    );


// Ghost really starts OFF.
afterimagePass.enabled = false;


composer.addPass(
    afterimagePass
);


// ── FXAA ─────────────────────────────────────────────────────

let fxaaPass = null;


function initFXAA() {

    const pixelRatio =
        renderer.getPixelRatio();


    const uniforms =
        FXAAShader.uniforms;


    uniforms['resolution']
        .value
        .set(

            1 / (
                window.innerWidth *
                pixelRatio
            ),

            1 / (
                window.innerHeight *
                pixelRatio
            )

        );


    fxaaPass =
        new ShaderPass(
            FXAAShader
        );


    fxaaPass.renderToScreen =
        true;


    composer.addPass(
        fxaaPass
    );
}


// ── Post-processing states ───────────────────────────────────

let bloomEnabled = true;

let afterimageEnabled = false;


// ── Bloom toggle ─────────────────────────────────────────────

export function toggleBloom() {

    bloomEnabled =
        !bloomEnabled;


    bloomPass.enabled =
        bloomEnabled;


    const button =
        document.getElementById(
            'btn-bloom'
        );


    if (button) {

        button.textContent =
            bloomEnabled
                ? '✨ Bloom: ON'
                : '✨ Bloom: OFF';

    }

}


// ── Ghost toggle ─────────────────────────────────────────────

export function toggleAfterimage() {

    afterimageEnabled =
        !afterimageEnabled;


    afterimagePass.enabled =
        afterimageEnabled;


    const button =
        document.getElementById(
            'btn-afterimage'
        );


    if (button) {

        button.textContent =
            afterimageEnabled
                ? '👻 Ghost: ON'
                : '👻 Ghost: OFF';

    }

}


// ── Update post-processing ───────────────────────────────────

// Kept because main.js already calls it.
// Vignette has been completely removed.

export function updatePostProcessing() {

    // Nothing required.

}


// ── Resize ───────────────────────────────────────────────────

window.addEventListener(
    'resize',
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        composer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        if (
            fxaaPass &&
            fxaaPass.uniforms
        ) {

            const pixelRatio =
                renderer.getPixelRatio();


            fxaaPass.uniforms
                .resolution
                .value
                .set(

                    1 / (
                        window.innerWidth *
                        pixelRatio
                    ),

                    1 / (
                        window.innerHeight *
                        pixelRatio
                    )

                );

        }

    }
);


// Initialize FXAA

initFXAA();