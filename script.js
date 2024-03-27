document.addEventListener('DOMContentLoaded', function () {
  const btnCargarCapitulos = document.getElementById('btnCargarCapitulos');
  const btnInicio = document.getElementById('btnInicio'); // Botón para ir al inicio
  let contenidoVisible = false;
  let capitulosData = []; // Almacenar los datos de los capítulos
  let capituloActualIndex = -1; // Índice del capítulo actual

  btnCargarCapitulos.addEventListener('click', function () {
      if (!contenidoVisible) {
          // Hacer una solicitud GET al servidor para obtener los capítulos
          fetch('/capitulos')
              .then(response => response.json())
              .then(capitulos => {
                  capitulosData = capitulos; // Almacenar los datos de los capítulos
                  const capitulosList = document.getElementById('capitulos-list');
                  capitulosList.innerHTML = ''; // Limpiar contenido anterior

                  capitulos.forEach((capitulo, index) => {
                      // Concatenar los datos en una sola cadena
                      const capituloInfo = `Saga: ${capitulo.saga}, Número de capítulo: ${capitulo.numero_capitulo}, Título: ${capitulo.titulo}`;

                      // Crear elementos HTML para representar cada capitulo
                      const capituloElement = document.createElement('li');
                      capituloElement.textContent = capituloInfo;

                      // Agregar un evento de clic para cargar el video correspondiente
                      capituloElement.addEventListener('click', function () {
                          cargarVideo(capitulo.url, capitulo.titulo, capitulo.numero_capitulo);
                          ocultarCapitulos();
                          capituloActualIndex = index; // Actualizar el índice del capítulo actual
                      });

                      // Agregar el elemento <li> del capitulo a la lista de capitulos
                      capitulosList.appendChild(capituloElement);
                  });
                  contenidoVisible = true;
                  btnCargarCapitulos.textContent = 'Ocultar Capítulos de Dragon Ball';
              })
              .catch(error => {
                  console.error('Error al obtener los capitulos:', error);
              });
      } else {
          ocultarCapitulos();
      }
  });

  function ocultarCapitulos() {
      const capitulosList = document.getElementById('capitulos-list');
      capitulosList.style.display = (capitulosList.style.display === 'none' || capitulosList.style.display === '') ? 'block' : 'none';
      btnCargarCapitulos.textContent = (capitulosList.style.display === 'none') ? 'Mostrar Capítulos de Dragon Ball' : 'Ocultar Capítulos de Dragon Ball';
  }

  // Función para cargar el video en un contenedor de video junto con el nombre y número del capítulo
  function cargarVideo(url, nombreCapitulo, numeroCapitulo) {
      const videoContainer = document.getElementById('video-container');
      videoContainer.innerHTML = `
          <h2>${nombreCapitulo}</h2>
          <p>Número de capítulo: ${numeroCapitulo}</p>
          <iframe src="${url}" width="640" height="360" frameborder="0" allowfullscreen></iframe>
          <button id="btnCapituloAnterior">Capítulo Anterior</button>
          <button id="btnSiguienteCapitulo">Siguiente Capítulo</button>
      `;
      
      // Agregar evento de clic al botón "Capítulo Anterior"
      const btnCapituloAnterior = document.getElementById('btnCapituloAnterior');
      btnCapituloAnterior.addEventListener('click', function() {
          cargarCapituloAnterior();
      });
      
      // Agregar evento de clic al botón "Siguiente Capítulo"
      const btnSiguienteCapitulo = document.getElementById('btnSiguienteCapitulo');
      btnSiguienteCapitulo.addEventListener('click', function() {
          cargarSiguienteCapitulo();
      });
  }

  // Función para cargar el siguiente capítulo
  function cargarSiguienteCapitulo() {
      if (capituloActualIndex < capitulosData.length - 1) {
          capituloActualIndex++;
          const siguienteCapitulo = capitulosData[capituloActualIndex];
          cargarVideo(siguienteCapitulo.url, siguienteCapitulo.titulo, siguienteCapitulo.numero_capitulo);
      } else {
          console.log('Ya no hay más capítulos disponibles.');
      }
  }

  // Función para cargar el capítulo anterior
  function cargarCapituloAnterior() {
      if (capituloActualIndex > 0) {
          capituloActualIndex--;
          const capituloAnterior = capitulosData[capituloActualIndex];
          cargarVideo(capituloAnterior.url, capituloAnterior.titulo, capituloAnterior.numero_capitulo);
      } else {
          console.log('Ya estás en el primer capítulo.');
      }
  }

  // Agregar evento de clic al botón "Inicio"
  btnInicio.addEventListener('click', function() {
      scrollToSection('.capitulos-section');
  });

  // Función para desplazarse a una sección específica
  function scrollToSection(selector) {
      const section = document.querySelector(selector);
      if (section) {
          window.scrollTo({
              top: section.offsetTop,
              behavior: 'smooth'
          });
      }
  }
});
