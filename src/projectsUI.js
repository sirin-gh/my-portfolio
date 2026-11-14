// ============================================================
// projectsUI.js
// Gothic Portfolio - Featured Projects
// ============================================================

import './projectsUI.css';


// ============================================================
// PROJECT DATA
// HORROR GAME IS PROJECT 01
// ============================================================

const projects = [

  // ==========================================================
  // 01 - HORROR GAME
  // ==========================================================

  {
    id: 'horror-game',

    title: 'Horror Game',

    subtitle: 'Psychological Horror · Unity',

    description:
      'A psychological horror game focused on exploration, environmental storytelling and puzzle-solving. The project uses unsettling environments and gameplay systems designed to reinforce the narrative atmosphere.',

    tech: [
      'Unity',
      'C#',
      '3D',
      'Horror',
      'Puzzles'
    ],

    images: [
      '/projects/Horror%20Game/1.png',
      '/projects/Horror%20Game/2.png',
      '/projects/Horror%20Game/3.png',
      '/projects/Horror%20Game/4.png',
      '/projects/Horror%20Game/5.png'
    ],

    github: '',
    demo: ''
  },


  // ==========================================================
  // 02 - FACE-BLINDNESS VISUAL NOVEL
  // ==========================================================

  {
    id: 'face-blindness',

    title: 'Face-Blindness Visual Novel',

    subtitle: '2D Game · Story & Puzzles',

    description:
      'A narrative-focused 2D visual novel combining story progression with interactive puzzles and minigames. The project includes scene transitions, puzzle-based gameplay and branching interactions supporting the story.',

    tech: [
      'Unity',
      'C#',
      '2D',
      'Narrative',
      'Puzzles'
    ],

    images: [
      '/projects/Face-Blindness%20Visual%20Novel/1.png',
      '/projects/Face-Blindness%20Visual%20Novel/2.png',
      '/projects/Face-Blindness%20Visual%20Novel/3.png',
      '/projects/Face-Blindness%20Visual%20Novel/4.png',
      '/projects/Face-Blindness%20Visual%20Novel/5.png',
      '/projects/Face-Blindness%20Visual%20Novel/6.png'
    ],

    github: '',
    demo: ''
  },


  // ==========================================================
  // 03 - VRMED
  // ==========================================================

  {
    id: 'vrmed',

    title: 'VRMed Surgical Handwashing',

    subtitle: 'VR Training · Meta Quest',

    description:
      'An immersive VR medical-training experience designed around surgical handwashing procedures. The application guides users through a structured training sequence using interactive VR mechanics.',

    tech: [
      'Unity',
      'VR',
      'Meta Quest',
      'XR'
    ],

    images: [
      '/projects/VRMed%20Surgical%20Handwashing/1.png',
      '/projects/VRMed%20Surgical%20Handwashing/2.png',
      '/projects/VRMed%20Surgical%20Handwashing/3.png',
      '/projects/VRMed%20Surgical%20Handwashing/4.png',
      '/projects/VRMed%20Surgical%20Handwashing/5.png',
      '/projects/VRMed%20Surgical%20Handwashing/6.png'
    ],

    github: 'https://github.com/sirin-gh/MedicalVR',
    demo: ''
  },


  // ==========================================================
  // 04 - DECORA
  // ==========================================================

  {
    id: 'decora',

    title: 'Decora 3D Room Design App',

    subtitle: 'Backend · 3D Room Designer',

    description:
      'Backend development for a 3D room-design application, including MongoDB and Mongoose integration, JWT authentication, user profiles and REST API routes for designs and likes.',

    tech: [
      'Node.js',
      'MongoDB',
      'Mongoose',
      'JWT',
      'REST API'
    ],

    images: [
      '/projects/Decora%203D%20Room%20Design%20App/1.png',
      '/projects/Decora%203D%20Room%20Design%20App/2.png',
      '/projects/Decora%203D%20Room%20Design%20App/3.png',
      '/projects/Decora%203D%20Room%20Design%20App/4.png'
    ],

    github: '',
    demo: ''
  },


  // ==========================================================
  // 05 - 3D MAX MODELS
  // ==========================================================

  {
    id: '3d-max-models',

    title: '3D Max Models',

    subtitle: '3D Modeling · Autodesk 3ds Max',

    description:
      'A collection of 3D modeling work created in Autodesk 3ds Max, including hard-surface assets, stylized objects, low-poly modeling, topology optimization, UV preparation and texture placement.',

    tech: [
      '3ds Max',
      '3D Modeling',
      'Low Poly',
      'UV'
    ],

    images: [
      '/projects/3D%20Max%20Models/1.png',
      '/projects/3D%20Max%20Models/2.png',
      '/projects/3D%20Max%20Models/3.png',
      '/projects/3D%20Max%20Models/4.png'
    ],

    github: '',
    demo: ''
  }

];


// ============================================================
// STATE
// ============================================================

let currentProject = 0;
let currentImage = 0;


// ============================================================
// CREATE PROJECT UI
// ============================================================

function createProjectsUI() {

  if (
    document.getElementById('projects-showcase')
  ) {
    return;
  }


  const showcase =
    document.createElement('div');


  showcase.id =
    'projects-showcase';


  showcase.className =
    'projects-showcase hidden';


  showcase.innerHTML = `

    <div class="projects-modal">

      <!-- ===================================================
           HEADER
           =================================================== -->

      <header class="projects-modal-header">

        <div class="projects-header-decoration">
          <span></span>
          <b>✦</b>
          <span></span>
        </div>


        <div class="projects-modal-title">
          FEATURED PROJECTS
        </div>


        <div class="projects-header-decoration">
          <span></span>
          <b>✦</b>
          <span></span>
        </div>


        <button
          id="projects-close"
          class="projects-close"
          type="button"
          aria-label="Close projects"
        >
          ✕
        </button>

      </header>


      <!-- ===================================================
           MAIN BODY
           =================================================== -->

      <div class="projects-modal-body">


        <!-- =================================================
             LEFT PROJECT NAVIGATION
             ================================================= -->

        <aside class="projects-sidebar">

          <div class="projects-sidebar-heading">
            SELECT PROJECT
          </div>


          <div
            id="projects-list"
            class="projects-list"
          ></div>

        </aside>


        <!-- =================================================
             PROJECT DETAIL
             ================================================= -->

        <main class="projects-content">

          <!-- PROJECT HEADING -->

          <div class="projects-content-header">

            <div class="projects-title-block">

              <div
                id="project-number-label"
                class="project-number-label"
              >
                PROJECT 01
              </div>


              <h2 id="project-title">
                Horror Game
              </h2>


              <div
                id="project-subtitle"
                class="project-subtitle"
              >
                Psychological Horror · Unity
              </div>

            </div>


            <div
              id="project-counter"
              class="project-counter"
            >
              01 / 05
            </div>

          </div>


          <!-- =================================================
               MAIN IMAGE
               ================================================= -->

          <div class="project-main-image-box">

            <img
              id="project-main-image"
              src=""
              alt="Project screenshot"
            >


            <button
              id="image-prev"
              class="project-image-arrow project-image-arrow-left"
              type="button"
              aria-label="Previous screenshot"
            >
              ‹
            </button>


            <button
              id="image-next"
              class="project-image-arrow project-image-arrow-right"
              type="button"
              aria-label="Next screenshot"
            >
              ›
            </button>


            <button
              id="image-expand"
              class="project-image-expand"
              type="button"
              aria-label="Open image fullscreen"
            >
              ⛶
            </button>

          </div>


          <!-- IMAGE INFO -->

          <div class="project-image-meta">

            <span>
              GALLERY
            </span>


            <span id="image-counter">
              IMAGE 01 / 05
            </span>

          </div>


          <!-- =================================================
               THUMBNAILS
               ================================================= -->

          <div
            id="project-thumbnails"
            class="project-thumbnails"
          ></div>


          <!-- =================================================
               PROJECT INFORMATION
               ================================================= -->

          <div class="project-lower-layout">


            <!-- DESCRIPTION -->

            <section class="project-info-section">

              <div class="project-section-title">

                <span>
                  ✦
                </span>

                DESCRIPTION

              </div>


              <p id="project-description"></p>

            </section>


            <!-- TECH -->

            <section class="project-tech-section">

              <div class="project-section-title">

                <span>
                  ✦
                </span>

                TECH STACK

              </div>


              <div
                id="project-tech"
                class="project-tech"
              ></div>

            </section>

          </div>


          <!-- =================================================
               LINKS
               ================================================= -->

          <div class="project-actions">

            <a
              id="project-github"
              class="project-action"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
            >
              GITHUB
              <span>↗</span>
            </a>


            <a
              id="project-demo"
              class="project-action"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
            >
              DEMO / DETAILS
              <span>↗</span>
            </a>

          </div>

        </main>

      </div>


      <!-- ===================================================
           FOOTER
           =================================================== -->

      <footer class="projects-modal-footer">


        <!-- PREVIOUS PROJECT -->

        <button
          id="project-prev"
          class="project-navigation-button"
          type="button"
        >
          <span>←</span>

          PREVIOUS PROJECT
        </button>


        <!-- PROJECT DOTS -->

        <div class="project-pagination">

          <div id="project-page-text">
            01 / 05
          </div>


          <div
            id="project-dots"
            class="project-dots"
          ></div>

        </div>


        <!-- NEXT PROJECT -->

        <button
          id="project-next"
          class="project-navigation-button"
          type="button"
        >
          NEXT PROJECT

          <span>→</span>
        </button>


        <!-- CONTACT -->

        <button
          id="projects-contact"
          class="projects-contact-button"
          type="button"
        >
          CONTINUE TO CONTACT

          <span class="contact-arrow">
            →
          </span>
        </button>

      </footer>

    </div>


    <!-- =====================================================
         FULLSCREEN IMAGE VIEWER
         ===================================================== -->

    <div
      id="project-lightbox"
      class="project-lightbox hidden"
    >

      <button
        id="lightbox-close"
        class="lightbox-close"
        type="button"
        aria-label="Close image"
      >
        ✕
      </button>


      <button
        id="lightbox-prev"
        class="lightbox-arrow lightbox-left"
        type="button"
        aria-label="Previous image"
      >
        ‹
      </button>


      <img
        id="lightbox-image"
        src=""
        alt="Project screenshot"
      >


      <button
        id="lightbox-next"
        class="lightbox-arrow lightbox-right"
        type="button"
        aria-label="Next image"
      >
        ›
      </button>


      <div
        id="lightbox-counter"
        class="lightbox-counter"
      ></div>

    </div>

  `;


  document.body.appendChild(showcase);


  connectProjectEvents();

  renderProject();

}


// ============================================================
// PROJECT LIST
// ============================================================

function renderProjectList() {

  const container =
    document.getElementById('projects-list');


  container.innerHTML =
    '';


  projects.forEach(

    (project, index) => {

      const button =
        document.createElement('button');


      button.type =
        'button';


      button.className =
        `project-list-button ${
          index === currentProject
            ? 'active'
            : ''
        }`;


      const number =
        String(index + 1)
          .padStart(2, '0');


      button.innerHTML = `

        <span class="project-card-number">
          ${number}
        </span>


        <span class="project-list-text">

          <strong>
            ${project.title}
          </strong>


          <small>
            ${project.subtitle}
          </small>

        </span>


        <span class="project-list-chevron">
          →
        </span>

      `;


      button.addEventListener(

        'click',

        () => {

          currentProject =
            index;


          currentImage =
            0;


          renderProject();

        }

      );


      container.appendChild(
        button
      );

    }

  );

}


// ============================================================
// THUMBNAILS
// ============================================================

function renderThumbnails(
  project
) {

  const container =
    document.getElementById('project-thumbnails');


  container.innerHTML =
    '';


  project.images.forEach(

    (imagePath, index) => {

      const button =
        document.createElement('button');


      button.type =
        'button';


      button.className =
        `project-thumbnail ${
          index === currentImage
            ? 'active'
            : ''
        }`;


      const img =
        document.createElement('img');


      img.src =
        imagePath;


      img.alt =
        `${project.title} screenshot ${index + 1}`;


      button.appendChild(img);


      button.addEventListener(

        'click',

        () => {

          currentImage =
            index;


          renderCurrentImage();

        }

      );


      container.appendChild(button);

    }

  );

}


// ============================================================
// TECH STACK
// ============================================================

function renderTech(
  project
) {

  document.getElementById(
    'project-tech'
  ).innerHTML =

    project.tech

      .map(

        item => `

          <span class="project-tech-chip">
            ${item}
          </span>

        `

      )

      .join('');

}


// ============================================================
// PROJECT DOTS
// ============================================================

function renderDots() {

  const dots =
    document.getElementById(
      'project-dots'
    );


  dots.innerHTML =
    '';


  projects.forEach(

    (project, index) => {

      const dot =
        document.createElement('button');


      dot.type =
        'button';


      dot.className =
        `project-dot ${
          index === currentProject
            ? 'active'
            : ''
        }`;


      dot.setAttribute(
        'aria-label',
        project.title
      );


      dot.addEventListener(

        'click',

        () => {

          currentProject =
            index;


          currentImage =
            0;


          renderProject();

        }

      );


      dots.appendChild(dot);

    }

  );

}


// ============================================================
// CURRENT IMAGE
// ============================================================

function renderCurrentImage() {

  const project =
    projects[currentProject];


  const mainImage =
    document.getElementById(
      'project-main-image'
    );


  mainImage.src =
    project.images[currentImage];


  mainImage.alt =
    `${project.title} screenshot ${currentImage + 1}`;


  document.getElementById(
    'image-counter'
  ).textContent =

    `IMAGE ${String(
      currentImage + 1
    ).padStart(
      2,
      '0'
    )} / ${String(
      project.images.length
    ).padStart(
      2,
      '0'
    )}`;


  renderThumbnails(project);

  updateLightbox();

}


// ============================================================
// LINKS
// ============================================================

function updateLink(
  element,
  url
) {

  if (url) {

    element.href =
      url;


    element.classList.remove(
      'disabled'
    );

  } else {

    element.href =
      '#';


    element.classList.add(
      'disabled'
    );

  }

}


// ============================================================
// RENDER CURRENT PROJECT
// ============================================================

function renderProject() {

  const project =
    projects[currentProject];


  const number =
    String(
      currentProject + 1
    ).padStart(
      2,
      '0'
    );


  const total =
    String(
      projects.length
    ).padStart(
      2,
      '0'
    );


  document.getElementById(
    'project-number-label'
  ).textContent =
    `PROJECT ${number}`;


  document.getElementById(
    'project-title'
  ).textContent =
    project.title;


  document.getElementById(
    'project-subtitle'
  ).textContent =
    project.subtitle;


  document.getElementById(
    'project-description'
  ).textContent =
    project.description;


  document.getElementById(
    'project-counter'
  ).textContent =
    `${number} / ${total}`;


  document.getElementById(
    'project-page-text'
  ).textContent =
    `${number} / ${total}`;


  updateLink(
    document.getElementById(
      'project-github'
    ),
    project.github
  );


  updateLink(
    document.getElementById(
      'project-demo'
    ),
    project.demo
  );


  renderProjectList();

  renderTech(project);

  renderDots();

  renderCurrentImage();

}


// ============================================================
// PROJECT NAVIGATION
// ============================================================

function nextProject() {

  currentProject =
    (
      currentProject +
      1
    )
    %
    projects.length;


  currentImage =
    0;


  renderProject();

}


function previousProject() {

  currentProject =
    (
      currentProject -
      1 +
      projects.length
    )
    %
    projects.length;


  currentImage =
    0;


  renderProject();

}


// ============================================================
// IMAGE NAVIGATION
// ============================================================

function nextImage() {

  const images =
    projects[currentProject].images;


  currentImage =
    (
      currentImage +
      1
    )
    %
    images.length;


  renderCurrentImage();

}


function previousImage() {

  const images =
    projects[currentProject].images;


  currentImage =
    (
      currentImage -
      1 +
      images.length
    )
    %
    images.length;


  renderCurrentImage();

}


// ============================================================
// LIGHTBOX
// ============================================================

function openLightbox() {

  document
    .getElementById(
      'project-lightbox'
    )
    .classList
    .remove(
      'hidden'
    );


  updateLightbox();

}


function closeLightbox() {

  document
    .getElementById(
      'project-lightbox'
    )
    ?.classList
    .add(
      'hidden'
    );

}


function updateLightbox() {

  const lightbox =
    document.getElementById(
      'project-lightbox'
    );


  if (
    !lightbox ||
    lightbox.classList.contains(
      'hidden'
    )
  ) {
    return;
  }


  const project =
    projects[currentProject];


  document.getElementById(
    'lightbox-image'
  ).src =
    project.images[currentImage];


  document.getElementById(
    'lightbox-counter'
  ).textContent =
    `${currentImage + 1} / ${project.images.length}`;

}


// ============================================================
// OPEN PROJECTS
// ============================================================

export function showProjectsUI() {

  createProjectsUI();


  document
    .getElementById(
      'projects-showcase'
    )
    ?.classList
    .remove(
      'hidden'
    );

}


// ============================================================
// CLOSE PROJECTS
// ============================================================

export function hideProjectsUI() {

  document
    .getElementById(
      'projects-showcase'
    )
    ?.classList
    .add(
      'hidden'
    );


  closeLightbox();

}


// ============================================================
// MOVE TO CONTACT
// ============================================================

function goToContact() {

  hideProjectsUI();


  const contactButton =
    document.querySelector(
      '#section-nav .section-pill[data-target="Get In Touch"]'
    );


  if (contactButton) {

    contactButton.click();

  }

}


// ============================================================
// EVENTS
// ============================================================

function connectProjectEvents() {

  document
    .getElementById(
      'projects-close'
    )
    .addEventListener(
      'click',
      hideProjectsUI
    );


  document
    .getElementById(
      'project-prev'
    )
    .addEventListener(
      'click',
      previousProject
    );


  document
    .getElementById(
      'project-next'
    )
    .addEventListener(
      'click',
      nextProject
    );


  document
    .getElementById(
      'image-prev'
    )
    .addEventListener(
      'click',
      previousImage
    );


  document
    .getElementById(
      'image-next'
    )
    .addEventListener(
      'click',
      nextImage
    );


  document
    .getElementById(
      'image-expand'
    )
    .addEventListener(
      'click',
      openLightbox
    );


  document
    .getElementById(
      'lightbox-close'
    )
    .addEventListener(
      'click',
      closeLightbox
    );


  document
    .getElementById(
      'lightbox-prev'
    )
    .addEventListener(
      'click',
      previousImage
    );


  document
    .getElementById(
      'lightbox-next'
    )
    .addEventListener(
      'click',
      nextImage
    );


  document
    .getElementById(
      'projects-contact'
    )
    .addEventListener(
      'click',
      goToContact
    );


  document
    .getElementById(
      'project-lightbox'
    )
    .addEventListener(

      'click',

      event => {

        if (
          event.target.id ===
          'project-lightbox'
        ) {

          closeLightbox();

        }

      }

    );


  document
    .querySelectorAll(
      '.project-action'
    )
    .forEach(

      element => {

        element.addEventListener(

          'click',

          event => {

            if (
              element.classList.contains(
                'disabled'
              )
            ) {

              event.preventDefault();

            }

          }

        );

      }

    );


  window.addEventListener(

    'keydown',

    event => {

      const showcase =
        document.getElementById(
          'projects-showcase'
        );


      if (
        !showcase ||
        showcase.classList.contains(
          'hidden'
        )
      ) {
        return;
      }


      if (
        event.key ===
        'Escape'
      ) {

        const lightbox =
          document.getElementById(
            'project-lightbox'
          );


        if (
          !lightbox.classList.contains(
            'hidden'
          )
        ) {

          closeLightbox();

        } else {

          hideProjectsUI();

        }

      }


      if (
        event.key ===
        'ArrowLeft'
      ) {

        previousImage();

      }


      if (
        event.key ===
        'ArrowRight'
      ) {

        nextImage();

      }

    }

  );

}


// ============================================================
// INITIALIZE
// ============================================================

createProjectsUI();


// ============================================================
// GLOBAL ACCESS
// ============================================================

window.showProjectsUI =
  showProjectsUI;


window.hideProjectsUI =
  hideProjectsUI;