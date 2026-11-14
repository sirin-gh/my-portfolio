// ============================================================
// interaction.js
// 3D interaction + panels
// Projects now use the dedicated large projects gallery
// ============================================================

import * as THREE from 'three';


import {
  camera,
  controls
} from './scene.js';


import {
  interactiveObjects,
  objectDataMap,
  CLICKABLE_DEFS,
  heartbeatGlow,
  changeColor
} from './loader.js';


import {
  flyToObject,
  flyHome,
  cancelCameraFlight
} from './cameraFlight.js';


import {
  showProjectsUI,
  hideProjectsUI
} from './projectsUI.js';


// ============================================================
// DOM
// ============================================================

const panel =
  document.getElementById(
    'panel'
  );


const panelIcon =
  document.getElementById(
    'panel-icon'
  );


const panelTitle =
  document.getElementById(
    'panel-title'
  );


const panelBody =
  document.getElementById(
    'panel-body'
  );


const panelClose =
  document.getElementById(
    'panel-close'
  );


const panelPrev =
  document.getElementById(
    'panel-prev'
  );


const panelNext =
  document.getElementById(
    'panel-next'
  );


const tooltip =
  document.getElementById(
    'tooltip'
  );


const topbar =
  document.getElementById(
    'topbar'
  );


const heroIntro =
  document.getElementById(
    'hero-intro'
  );


const sectionNavButtons =
  document.querySelectorAll(
    '#section-nav .section-pill'
  );


// ============================================================
// RAYCAST
// ============================================================

const raycaster =
  new THREE.Raycaster();


const mouse =
  new THREE.Vector2();


// ============================================================
// STATE
// ============================================================

let hoveredMesh = null;
let selectedMesh = null;
let panelOpenIndex = 0;
let isDragging = false;


let mouseDownPosition = {
  x: 0,
  y: 0
};


const savedMaterials =
  new Map();


// ============================================================
// MOUSE POSITION
// ============================================================

function setMousePosition(
  x,
  y
) {

  mouse.x =
    (
      x /
      window.innerWidth
    )
    *
    2
    -
    1;


  mouse.y =
    -(
      y /
      window.innerHeight
    )
    *
    2
    +
    1;

}


// ============================================================
// GET HIT
// ============================================================

function getHit() {

  raycaster.setFromCamera(
    mouse,
    camera
  );


  const hits =
    raycaster.intersectObjects(
      interactiveObjects,
      true
    );


  return hits.length
    ? hits[0]
    : null;

}


// ============================================================
// GET DEFINITION
// ============================================================

function getDefinition(
  mesh
) {

  if (
    objectDataMap.has(
      mesh.uuid
    )
  ) {

    return objectDataMap.get(
      mesh.uuid
    );

  }


  let object =
    mesh.parent;


  while (
    object
  ) {

    if (
      objectDataMap.has(
        object.uuid
      )
    ) {

      return objectDataMap.get(
        object.uuid
      );

    }


    object =
      object.parent;

  }


  return mesh.userData?.title
    ? mesh.userData
    : null;

}


// ============================================================
// FIND MESH
// ============================================================

function findMeshForDefinition(
  definition
) {

  return interactiveObjects.find(

    mesh => {

      const data =
        getDefinition(
          mesh
        );


      return (
        data?.name ===
        definition?.name

        ||

        data?.title ===
        definition?.title

        ||

        data?.label ===
        definition?.label
      );

    }

  );

}


// ============================================================
// PROJECT CHECK
// ============================================================

function isProjectsDefinition(
  definition
) {

  if (
    !definition
  ) {
    return false;
  }


  const value =
    `${definition.title || ''} ${definition.label || ''} ${definition.name || ''}`
      .toLowerCase();


  return (
    value.includes(
      'featured projects'
    )

    ||

    value ===
      'projects'

    ||

    value.includes(
      'project'
    )
  );

}


// ============================================================
// PANEL SIDE
// ============================================================

function determinePanelSide(
  mesh,
  definition
) {

  if (
    definition?.title ===
    'About Me'
  ) {

    return 'left';

  }


  const position =
    new THREE.Vector3();


  mesh.getWorldPosition(
    position
  );


  position.project(
    camera
  );


  return position.x < 0
    ? 'right'
    : 'left';

}


// ============================================================
// PANEL POSITION
// ============================================================

function positionPanel(
  side
) {

  if (
    !panel
  ) {
    return;
  }


  if (
    window.innerWidth <
    900
  ) {

    panel.style.left =
      '0';


    panel.style.right =
      '0';


    panel.style.top =
      'auto';


    panel.style.bottom =
      '0';


    panel.style.width =
      '100%';


    panel.style.maxWidth =
      'none';


    panel.style.transform =
      'none';


    return;

  }


  panel.style.top =
    '50%';


  panel.style.bottom =
    'auto';


  panel.style.width =
    'min(470px, 32vw)';


  panel.style.maxWidth =
    '470px';


  panel.style.transform =
    'translateY(-50%)';


  if (
    side ===
    'left'
  ) {

    panel.style.left =
      '28px';


    panel.style.right =
      'auto';

  } else {

    panel.style.right =
      '28px';


    panel.style.left =
      'auto';

  }

}


// ============================================================
// HERO
// ============================================================

function hideHeroIntro() {

  heroIntro?.classList.add(
    'is-hidden'
  );

}


// ============================================================
// ACTIVE NAV BUTTON
// ============================================================

function setActiveNavigation(
  target
) {

  sectionNavButtons.forEach(

    button => {

      button.classList.toggle(

        'is-active',

        button.dataset.target ===
        target

      );

    }

  );

}


// ============================================================
// MATERIAL SAVE
// ============================================================

function saveMaterial(
  mesh
) {

  if (
    !mesh?.material ||
    savedMaterials.has(
      mesh.uuid
    )
  ) {
    return;
  }


  savedMaterials.set(

    mesh.uuid,

    {

      emissive:

        mesh.material.emissive

          ? mesh.material.emissive.clone()

          : new THREE.Color(0),


      emissiveIntensity:

        mesh.material.emissiveIntensity ??
        0

    }

  );

}


// ============================================================
// HIGHLIGHT
// ============================================================

function highlight(
  mesh
) {

  if (
    !mesh?.material
  ) {
    return;
  }


  saveMaterial(
    mesh
  );


  if (
    mesh.material.emissive
  ) {

    mesh.material.emissive.set(
      0xaa88ff
    );


    mesh.material.emissiveIntensity =
      0.9;

  }

}


// ============================================================
// REMOVE HIGHLIGHT
// ============================================================

function unhighlight(
  mesh
) {

  if (
    !mesh?.material
  ) {
    return;
  }


  const state =
    savedMaterials.get(
      mesh.uuid
    );


  if (
    !state
  ) {
    return;
  }


  if (
    mesh.material.emissive
  ) {

    mesh.material.emissive.copy(
      state.emissive
    );


    mesh.material.emissiveIntensity =
      state.emissiveIntensity;

  }

}


// ============================================================
// PULSE
// ============================================================

function pulse(
  mesh
) {

  const originalScale =
    mesh.scale.clone();


  const start =
    performance.now();


  function animate(
    now
  ) {

    const progress =
      Math.min(
        (
          now -
          start
        )
        /
        350,
        1
      );


    const amount =
      1
      +
      Math.sin(
        progress *
        Math.PI
      )
      *
      0.08;


    mesh.scale.set(

      originalScale.x *
      amount,

      originalScale.y *
      amount,

      originalScale.z *
      amount

    );


    if (
      progress <
      1
    ) {

      requestAnimationFrame(
        animate
      );

    } else {

      mesh.scale.copy(
        originalScale
      );

    }

  }


  requestAnimationFrame(
    animate
  );

}


// ============================================================
// COLORS
// ============================================================

function createColorButtons(
  definition
) {

  const colors =
    definition.colors
    ||
    [
      0x8b5cf6,
      0xa855f7,
      0xd946ef
    ];


  return colors.map(

    color => {

      const hex =
        color
          .toString(16)
          .padStart(
            6,
            '0'
          );


      return `

        <button
          class="swatch"
          type="button"
          data-color="${hex}"
          style="background-color:#${hex}">
        </button>

      `;

    }

  ).join('');

}


// ============================================================
// COLOR EVENTS
// ============================================================

function connectColorButtons() {

  panelBody
    .querySelectorAll(
      '.swatch'
    )
    .forEach(

      button => {

        button.addEventListener(

          'click',

          event => {

            event.preventDefault();
            event.stopPropagation();


            if (
              !selectedMesh
            ) {
              return;
            }


            changeColor(

              selectedMesh,

              parseInt(
                button.dataset.color,
                16
              ),

              300

            );

          }

        );

      }

    );

}


// ============================================================
// NORMAL PANEL
// ============================================================

function showNormalPanel(
  definition,
  side
) {

  hideProjectsUI();


  panelOpenIndex =
    CLICKABLE_DEFS.findIndex(

      item =>
        item.name ===
        definition.name

    );


  panelIcon.textContent =
    definition.icon ||
    '✦';


  panelTitle.textContent =
    definition.title ||
    definition.label ||
    'Portfolio';


  const content =
    definition.text

      .map(
        line =>
          `<p>${line}</p>`
      )

      .join('');


  panelBody.innerHTML = `

    <div class="panel-text">
      ${content}
    </div>


    <div class="color-section">

      <div class="color-title">
        Color
      </div>


      <div class="swatch-row">

        ${createColorButtons(
          definition
        )}

      </div>

    </div>

  `;


  connectColorButtons();


  positionPanel(
    side
  );


  panel.classList.remove(
    'hidden'
  );

}


// ============================================================
// HIDE NORMAL PANEL
// ============================================================

function hidePanel() {

  panel.classList.add(
    'hidden'
  );

}


// ============================================================
// SELECT MESH
// ============================================================

function selectMesh(
  mesh
) {

  if (
    selectedMesh &&
    selectedMesh !==
    mesh
  ) {

    unhighlight(
      selectedMesh
    );

  }


  selectedMesh =
    mesh;


  highlight(
    mesh
  );


  pulse(
    mesh
  );


  heartbeatGlow(
    mesh
  );


  const definition =
    getDefinition(
      mesh
    );


  if (
    !definition
  ) {
    return;
  }


  hideHeroIntro();


  // ========================================================
  // PROJECTS
  //
  // IMPORTANT:
  // Do NOT open the old normal Featured Projects panel.
  // ========================================================

  if (
    isProjectsDefinition(
      definition
    )
  ) {

    hidePanel();


    setActiveNavigation(
      'Featured Projects'
    );


    showProjectsUI();


    return;

  }


  // ========================================================
  // NORMAL PANELS
  // ========================================================

  const panelSide =
    determinePanelSide(
      mesh,
      definition
    );


  showNormalPanel(
    definition,
    panelSide
  );


  setActiveNavigation(
    definition.title
  );


  flyToObject(

    mesh,

    {
      panelSide
    }

  );

}


// ============================================================
// OPEN NAV SECTION
// ============================================================

function openPortfolioSection(
  target
) {

  hideHeroIntro();


  // PROJECTS

  if (
    target ===
    'Featured Projects'
  ) {

    hidePanel();


    setActiveNavigation(
      'Featured Projects'
    );


    showProjectsUI();


    return;

  }


  // NORMAL SECTION

  hideProjectsUI();


  const definition =
    CLICKABLE_DEFS.find(

      item =>
        item.title ===
        target

        ||

        item.label ===
        target

        ||

        item.name ===
        target

    );


  if (
    !definition
  ) {

    console.warn(
      `Section not found: ${target}`
    );

    return;

  }


  const mesh =
    findMeshForDefinition(
      definition
    );


  if (
    mesh
  ) {

    selectMesh(
      mesh
    );

  }

}


// ============================================================
// TOP NAV
// ============================================================

sectionNavButtons.forEach(

  button => {

    button.addEventListener(

      'click',

      event => {

        event.preventDefault();
        event.stopPropagation();


        const target =
          button.dataset.target;


        if (
          target
        ) {

          openPortfolioSection(
            target
          );

        }

      }

    );

  }

);


// ============================================================
// PREV / NEXT NORMAL PANEL
// ============================================================

function navigate(
  direction
) {

  panelOpenIndex =
    (
      panelOpenIndex
      +
      direction
      +
      CLICKABLE_DEFS.length
    )
    %
    CLICKABLE_DEFS.length;


  const definition =
    CLICKABLE_DEFS[
      panelOpenIndex
    ];


  // If navigation lands on Projects,
  // open dedicated Projects modal.

  if (
    isProjectsDefinition(
      definition
    )
  ) {

    hidePanel();

    setActiveNavigation(
      'Featured Projects'
    );

    showProjectsUI();

    return;

  }


  const mesh =
    findMeshForDefinition(
      definition
    );


  if (
    mesh
  ) {

    selectMesh(
      mesh
    );

  }

}


// ============================================================
// PROTECT UI
// ============================================================

[
  'click',
  'mousedown',
  'mouseup',
  'dblclick'
].forEach(

  eventName => {

    panel?.addEventListener(

      eventName,

      event =>
        event.stopPropagation()

    );

  }

);


// ============================================================
// MOUSE DOWN
// ============================================================

window.addEventListener(

  'mousedown',

  event => {

    if (
      event.target.closest('#panel')
      ||
      event.target.closest('#topbar')
      ||
      event.target.closest('#projects-showcase')
      ||
      event.target.closest('#page-scroll-control')
    ) {
      return;
    }


    cancelCameraFlight();


    isDragging =
      false;


    mouseDownPosition = {
      x: event.clientX,
      y: event.clientY
    };

  }

);


// ============================================================
// MOUSE MOVE
// ============================================================

window.addEventListener(

  'mousemove',

  event => {

    if (
      event.buttons
    ) {

      const dx =
        event.clientX -
        mouseDownPosition.x;


      const dy =
        event.clientY -
        mouseDownPosition.y;


      if (
        Math.sqrt(
          dx * dx +
          dy * dy
        )
        >
        5
      ) {

        isDragging =
          true;

      }

    }


    setMousePosition(
      event.clientX,
      event.clientY
    );


    const hit =
      getHit();


    const mesh =
      hit?.object ||
      null;


    if (
      hoveredMesh &&
      hoveredMesh !== mesh &&
      hoveredMesh !== selectedMesh
    ) {

      unhighlight(
        hoveredMesh
      );

    }


    hoveredMesh =
      mesh;


    if (
      hoveredMesh &&
      hoveredMesh !== selectedMesh
    ) {

      highlight(
        hoveredMesh
      );


      const definition =
        getDefinition(
          hoveredMesh
        );


      if (
        definition
      ) {

        tooltip.textContent =
          `✦ ${definition.label}`;


        tooltip.style.left =
          `${event.clientX + 16}px`;


        tooltip.style.top =
          `${event.clientY - 15}px`;


        tooltip.classList.remove(
          'hidden'
        );

      }

    } else {

      tooltip.classList.add(
        'hidden'
      );

    }

  }

);


// ============================================================
// CLICK
// ============================================================

window.addEventListener(

  'click',

  event => {

    if (
      event.target.closest('#panel')
      ||
      event.target.closest('#topbar')
      ||
      event.target.closest('#projects-showcase')
      ||
      event.target.closest('#page-scroll-control')
    ) {
      return;
    }


    if (
      isDragging
    ) {

      isDragging =
        false;

      return;

    }


    setMousePosition(
      event.clientX,
      event.clientY
    );


    const hit =
      getHit();


    if (
      hit
    ) {

      selectMesh(
        hit.object
      );

    }

  }

);


// ============================================================
// DOUBLE CLICK
// ============================================================

window.addEventListener(

  'dblclick',

  event => {

    if (
      event.target.closest('#panel')
      ||
      event.target.closest('#topbar')
      ||
      event.target.closest('#projects-showcase')
      ||
      event.target.closest('#page-scroll-control')
    ) {
      return;
    }


    flyHome();

  }

);


// ============================================================
// PANEL BUTTONS
// ============================================================

panelClose?.addEventListener(

  'click',

  event => {

    event.preventDefault();
    event.stopPropagation();

    hidePanel();

  }

);


panelPrev?.addEventListener(

  'click',

  event => {

    event.preventDefault();
    event.stopPropagation();

    navigate(-1);

  }

);


panelNext?.addEventListener(

  'click',

  event => {

    event.preventDefault();
    event.stopPropagation();

    navigate(1);

  }

);


// ============================================================
// ESC
// ============================================================

window.addEventListener(

  'keydown',

  event => {

    if (
      event.key ===
      'Escape'
    ) {

      hidePanel();

      hideProjectsUI();

    }

  }

);


// ============================================================
// RESIZE
// ============================================================

window.addEventListener(

  'resize',

  () => {

    if (
      selectedMesh &&
      !panel.classList.contains(
        'hidden'
      )
    ) {

      const definition =
        getDefinition(
          selectedMesh
        );


      positionPanel(

        determinePanelSide(
          selectedMesh,
          definition
        )

      );

    }

  }

);