# Gemini Code Assist Context for Eric Raymond's Website

## Website Overview
This project is a personal portfolio website for Eric Raymond, showcasing skills and projects as an AI/ML Developer and Robotics Engineer. The website is built with a React frontend using TypeScript, Vite for development, and Tailwind CSS for styling. It features a modern design with interactive elements, including a 3D robotic arm component intended to follow mouse movements using React Three Fiber.

- **Frontend Structure**: The frontend code is located in the `frontend/` directory, with key files including:
  - `frontend/src/App.tsx`: Main routing component directing to Home and About pages.
  - `frontend/src/pages/Home.tsx`: Home page where the robotic arm is rendered.
  - `frontend/src/components/RoboticArmScene.tsx`: Implementation of the 3D robotic arm using React Three Fiber.
  - `frontend/src/hooks/useMousePosition.tsx`: Custom hook to track mouse position for the robotic arm interaction.
  - `frontend/src/styles/Home.css`: Styling for the home page, including animations and responsive design.
- **Backend**: There is a backend setup in `backend/` using TypeScript and Node.js, likely for serving data or APIs to the frontend. Key files include `backend/project/server.ts` and various routes for data endpoints.
- **Deployment**: The project includes deployment configurations (`DEPLOYMENT.md`, `docker-compose.yml`, GitHub workflows in `.github/workflows/`), indicating it may be deployed to a hosting service or run in containers.
- **Dependencies**: Key dependencies for the frontend include React (`react`, `react-dom`), React Router (`react-router-dom`), Framer Motion for animations (`framer-motion`), and 3D rendering libraries (`@react-three/fiber`, `@react-three/drei`, `three`).

## Current Focus: Robotic Arm Display Issue
We have been troubleshooting an issue where the robotic arm is not displaying on the website. The following details summarize the investigation and findings:

- **Component Implementation**: The `RoboticArmScene.tsx` component is a complex 3D rendering using React Three Fiber, designed to follow mouse movements with inverse kinematics for realistic arm motion. It uses `Canvas`, `OrbitControls`, and custom components for arm segments and joints.
- **Integration**: The component is correctly imported and rendered in `Home.tsx` within a dedicated container with the necessary `mousePosition` prop passed from the `useMousePosition` hook.
- **Dependencies**: All required dependencies for 3D rendering (`@react-three/fiber`, `@react-three/drei`, `three`) are present in `frontend/package.json`.
- **Styling**: No obvious CSS issues were found in `frontend/src/styles/Home.css` that would hide the component. The container in `Home.tsx` has inline styles for height and positioning.
- **Potential Causes**: The issue might be due to:
  - **Browser Compatibility**: The browser might not support WebGL or could have rendering issues with the 3D canvas.
  - **Runtime Errors**: JavaScript errors in the console could prevent the component from rendering properly.
  - **CSS Positioning**: The container for the robotic arm might be positioned or styled in a way that makes it invisible (e.g., z-index issues or incorrect dimensions).

## Steps Taken
- Reviewed the code for `RoboticArmScene.tsx`, `App.tsx`, `Home.tsx`, `Home.css`, and `package.json` to ensure proper implementation and dependency setup.
- Identified that the component is correctly placed in the DOM structure but may not be rendering due to external factors like browser support or console errors.

## Detailed Troubleshooting Guide for Agent Mode
To assist in resolving the robotic arm display issue and other potential code issues, follow these detailed steps:

1. **Check Browser Console for Errors**:
   - Open the browser's developer tools (usually F12 or right-click and select "Inspect") and navigate to the "Console" tab.
   - Load the website (likely by running `npm run dev` in the `frontend/` directory to start the Vite development server).
   - Look for any errors related to WebGL, React Three Fiber, or general JavaScript exceptions. Common errors might include "WebGL not supported" or module import failures.
   - If errors are found, note them down and research solutions (e.g., enabling WebGL in browser settings, updating graphics drivers, or fixing code based on error messages).

2. **Inspect DOM for Canvas Element**:
   - In the browser's developer tools, go to the "Elements" tab.
   - Search for a `<canvas>` element within the container div with class or ID related to `desk-canvas` (as defined in `RoboticArmScene.tsx`).
   - Verify that the canvas has dimensions (height and width not set to 0) and is not obscured by other elements (check `z-index`, `display`, and `visibility` CSS properties).
   - If the canvas is missing or has incorrect styling, adjust the CSS in `Home.tsx` or add debug styles to ensure visibility.

3. **Test Browser Compatibility**:
   - If no errors are found or if WebGL support is suspected, test the website in a different browser (e.g., switch from Firefox to Chrome or Edge).
   - Ensure the browser supports WebGL by visiting a WebGL test page like `get.webgl.org`.
   - If WebGL is disabled, enable it in browser settings or update the browser to the latest version.

4. **Add Debug Styles for Visibility**:
   - If the canvas is present but not visible, temporarily modify the container styles in `Home.tsx` to ensure visibility. Add the following inline styles to the div containing `RoboticArmScene`:
     ```css
     style={{ height: '100vh', width: '100%', position: 'relative', zIndex: 50 }}
     ```
   - Alternatively, edit `frontend/src/styles/Home.css` to add a debug class with high z-index and explicit dimensions, then apply it to the container.

5. **Verify Dependency Installation**:
   - Ensure all dependencies are installed correctly by running `npm install` in the `frontend/` directory.
   - Check for version mismatches or deprecated packages in `package.json` that might cause rendering issues with React Three Fiber.

6. **Run Development Server**:
   - If not already running, start the development server by executing `npm run dev` in the `frontend/` directory. This will launch the Vite server, typically accessible at `localhost:5173` or a similar port.
   - Navigate to the URL in the browser to test the website live.

7. **Code Adjustments if Necessary**:
   - If a specific error is identified in the console (e.g., a missing prop or incorrect import), modify the relevant file (`RoboticArmScene.tsx` or `Home.tsx`) to fix the issue.
   - Use `replace_in_file` to make targeted changes to code, ensuring to match the exact content including whitespace and line endings.

## Additional Project Context for Code Assistance
- **Routing**: The application uses `react-router-dom` for navigation, with routes defined in `App.tsx` for Home (`/`) and About (`/about`) pages.
- **Styling**: The project employs Tailwind CSS classes and custom CSS for animations and gradients, ensuring a modern look. Be mindful of CSS specificity and z-index when adding new styles.
- **Interactivity**: The robotic arm is designed to follow mouse movements, using a custom hook `useMousePosition.tsx`. Ensure any changes to mouse tracking logic maintain smooth interaction.
- **Performance**: The website includes animations via Framer Motion, which should be optimized to avoid performance hits, especially with 3D rendering active.

## Key Files for Reference
- **Robotic Arm Logic**: `frontend/src/components/RoboticArmScene.tsx` for 3D rendering details and `frontend/src/hooks/useMousePosition.tsx` for interaction logic.
- **Main Page Structure**: `frontend/src/pages/Home.tsx` for component placement and inline styling.
- **Dependency List**: `frontend/package.json` for version and package information.
- **Project Root**: Review `README.md` if available for setup instructions or deployment notes.

This document serves as a comprehensive context for Gemini Code Assist in agent mode to understand the current state of the project, troubleshoot the robotic arm display issue, and assist with further development or code fixes. Use the outlined steps to systematically address issues, and refer to the specified files for targeted modifications.
