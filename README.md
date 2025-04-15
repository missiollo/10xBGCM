# Board Game Collection Manager

## Description

Board Game Collection Manager is a web application designed to help board game enthusiasts organize, manage, and analyze their game collections. It offers secure user authentication, comprehensive CRUD operations for game management, and a recommendation engine that suggests new games based on the analysis of collection categories and mechanics. This application addresses the challenges of information overload, prevents duplicate purchases, and supports informed decision-making when expanding a collection.

## Tech Stack

- **Frontend:** Astro 5, React 19, TypeScript 5, Tailwind 4, Shadcn/ui
- **Backend:** Supabase (leveraging PostgreSQL, built-in authentication, and related services)
- **AI Integration:** Openrouter.ai for intelligent recommendations and insights
- **CI/CD & Hosting:** GitHub Actions for CI/CD pipelines and DigitalOcean for hosting

## Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/missiollo/10xBGCM.git
   cd 10xBGCM
   ```

2. **Install dependencies:**
   Ensure you are using the Node version specified in the `.nvmrc` file (22.14.0):
   ```bash
   nvm use
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`.

## Available Scripts

- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Builds the project for production.
- **`npm run preview`**: Serves the production build for preview.
- **`npm run astro`**: Runs the Astro CLI.
- **`npm run lint`**: Runs ESLint to analyze the code for issues.
- **`npm run lint:fix`**: Automatically fixes linting errors where possible.
- **`npm run format`**: Formats the codebase using Prettier.

## Project Scope

This project includes the following key functionalities:

- **User Authentication:** Secure registration and login mechanisms.
- **CRUD Operations for Board Games:** Add, edit, delete, and view games with detailed information such as title, publisher, categories, mechanics, player count, and playing time.
- **Game Recommendations:** An engine that analyzes the collection and suggests new games based on categories and mechanics.
- **Search and Filtering:** Advanced options to filter and search through a growing collection of board games.
- **User Feedback:** Integrated system allowing users to rate and provide feedback on both the application and individual games.

## Project Status

This project is currently in the MVP (Minimum Viable Product) stage. Core features have been implemented, and the project continues to evolve with ongoing improvements to enhance functionality, scalability, and user experience.

## License

This project is licensed under the MIT License.
