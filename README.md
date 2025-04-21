# Task Manager (Angular + .NET Core Web API)


This is a full-stack Task Manager application built using Angular for the frontend and .NET Core Web API for the backend. It supports user authentication using JWT tokens, role-based access (Admins and Users), and full task management functionality including listing, creating, updating, and deleting tasks. The backend handles authentication and task logic, while the frontend provides a responsive and user-friendly interface for interacting with the system.

The frontend is available at [TaskManager](https://github.com/Kaustubh-Dahake/TaskManager) and the backend at [TaskManager_api](https://github.com/Kaustubh-Dahake/TaskManager_api). Both repositories must be cloned and run separately.

To get started, begin by cloning both repositories. For the frontend, clone the repository using `git clone https://github.com/Kaustubh-Dahake/TaskManager.git` and navigate into the project folder with `cd TaskManager`. Make sure Node.js and Angular CLI are installed. Run `npm install` to install dependencies and start the application using `ng serve`. You can access the app in your browser at `http://localhost:4200/login`.

For the backend, clone the repository using `git clone https://github.com/Kaustubh-Dahake/TaskManager_api.git` and open it in Visual Studio or Visual Studio Code. Run the backend API, which will be available at `https://localhost:7197/swagger/index.html` for testing via Swagger. Ensure the backend is running before using the frontend so API calls are properly handled.

The frontend connects to the backend using HTTP requests and includes an Angular interceptor that automatically attaches the JWT token stored in localStorage. Upon login, the user receives a token, which is used to authenticate further API calls. Role-based access ensures that Admins can manage all tasks and assign them to users, while regular users can only manage their own tasks.

There are several predefined users included for demonstration purposes. Admins include `admin1` (password: `admin_123`), `admin2` (`admin_123`), `admin3` (`admin_123`), and `admin4` (`admin_123`). Regular users include `user1` (`user_123`), `user2` (`user_123`), `user3` (`user_123`), and `user4` (`user_123`). Each user is displayed with a profile avatar using the UI Avatars service.

The frontend uses standard Angular modules, services, routing, guards, and components. Key features include login authentication with JWT, task listing and editing forms, route protection based on roles, a header with user info, and integration with Bootstrap for styling. RxJS is used for managing reactive state and async data flows. The code is modular and organized into folders like `login`, `task-list`, `task-form`, and shared services.

The backend is built with .NET Core Web API using an in-memory database. It uses Entity Framework Core for data modeling and repositories, and FluentValidation for input validation. Authentication and authorization are handled via JWT tokens. Controllers include `AuthController` for login and token generation, and `TaskController` for task operations. Middleware is configured to validate JWT tokens and enforce role-based access.

This project is designed for learning and demonstration. Some advanced features like persistent database storage, robust form validations, unit testing, and deployment are simplified or omitted. The UI is kept clean and minimal to focus on core logic and functionality.

Technologies used include Angular 14+, RxJS, Bootstrap, .NET Core 8, Entity Framework Core, FluentValidation, and Swagger. The folder structure is cleanly organized, and the solution demonstrates how to build a modern full-stack web application with authentication, authorization, and RESTful API integration.

Feel free to fork, clone, modify, and build upon this project. It is open-source and available for educational and demonstration use.
