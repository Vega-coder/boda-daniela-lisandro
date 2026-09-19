# 💍 Invitación de Boda Digital e Interactiva
## Lisandro & Daniela &mdash; 27 de Diciembre de 2026

Página web interactiva y elegante para la boda de **Lisandro & Daniela** en Ábrego, Norte de Santander.

---

## ✨ Características Principales

1. **💌 Sobre de Lujo 100% Cerrado e Interactivo:**
   - Diseño con textura de papelería nupcial rosa perla, completamente cerrado con pliegues continuos y solapa triangular.
   - Cruzado por un elegante listón de satén vino y oro rosado con lazo y sello de lacre en relieve con el monograma **`L & D`**.
   - Al tocar el listón o el sobre:
     - El listón se abre suavemente.
     - La solapa se eleva en animación 3D (`rotateX: 180°`).
     - La tarjeta de boda interior se desliza hacia arriba saliendo del sobre.
     - Inicia la música de piano romántico y brotan destellos dorados y pétalos de rosa.
     - Se disuelve suavemente hacia la invitación principal.

2. **🌸 Paleta de Colores Rosa Romántico & Vino Fino:**
   - Fondos en degradé rosa suave y rubor nupcial (`#fdebed`, `#fbd5df`).
   - Acentos en vino borgoña profundo (`#781836`), oro rosado sedoso (`#df9b8a`) y destellos luminosos.

3. **👰 Portada Principal a Pantalla Completa:**
   - La foto de los novios vestidos de blanco (`foto-estudio-3.png`) se luce en portada completa.
   - Título emotivo *«¡Nos vamos a casar!»*, dedicatoria romántica y placa de fecha.

4. **⏳ Cuenta Regresiva en Tiempo Real:**
   - Días, horas, minutos y segundos exactos hasta el 27 de diciembre de 2026 a las 5:00 PM.
   - Botones para agregar el evento a **Google Calendar** o descargar el archivo **.ics**.

5. **🎹 Música de Piano Romántico:**
   - Pieza instrumental en piano de alta calidad (`musica-boda.wav`) con reproductor flotante interactivo para pausar o reanudar.

6. **📍 Itinerario en Ábrego, Norte de Santander:**
   - **Ceremonia Religiosa (Misa):** 5:00 PM en la **Iglesia Santa Bárbara** (con botón directo a Google Maps).
   - **Recepción & Fiesta:** 6:30 PM en el **Club de los Maestros** (con botón directo a Google Maps).

7. **🎁 Lluvia de Sobres:**
   - Sección dedicada para regalos en efectivo con diseño distinguido.

8. **📸 Galería de las Tres Fotografías (Sin carrusel):**
   - Las 3 fotos expuestas juntas en formato editorial:
     - *«Un Solo Corazón»* (Estudio de blanco).
     - *«Bendición en el Altar»* (Beso en el templo).
     - *«Risas y Complicidad»* (Selfie sonrientes).
   - Modal *Lightbox* para ampliar cada fotografía a pantalla completa.

9. **💬 Confirmación de Asistencia (RSVP) por WhatsApp:**
   - Vinculado de manera fija y no editable al número oficial: **+57 318 857 2916**.
   - Los invitados completan su nombre, cantidad de acompañantes y mensaje, y se abre WhatsApp con el mensaje estructurado listo para enviar.

---

## 🚀 Cómo Ver la Invitación en Local

1. Iniciar el servidor local:
   ```bash
   python -m http.server 8080
   ```
2. Abrir en el navegador:
   - **Local:** `http://localhost:8080`
   - **Móvil (misma red Wi-Fi):** `http://<TU_IP_LOCAL>:8080`

---

## 📁 Estructura de Archivos

```
├── index.html                  # Estructura principal y contenido
├── styles.css                  # Estilos, paleta rosa/vino y sobre 3D
├── app.js                      # Lógica interactiva, cuenta regresiva, piano y WhatsApp
├── assets/
│   ├── images/
│   │   ├── foto-estudio-3.png  # Foto principal novios vestidos de blanco
│   │   ├── foto-iglesia-2.jpg  # Foto en el altar de la iglesia
│   │   └── foto-pareja-1.png   # Foto selfie cómplices
│   └── audio/
│       └── musica-boda.wav     # Pista instrumental de piano
└── README.md                   # Documentación del proyecto
```
