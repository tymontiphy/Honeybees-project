## Honeybees

🛍️ Full-Stack E-Commerce Application

📌 Project Overview

This is a full-stack e-commerce web application built using Flask-RESTful for the backend and React.js for the frontend. Users can browse products, add them to their cart, and place orders. The application supports full CRUD operations on products and orders.

## Technologies Used

⚙️ Backend (Flask-RESTful API)

Python

Flask & Flask-RESTful

SQLAlchemy (ORM for database)

Marshmallow (Data validation)

PostgreSQL/MySQL (Database)


⚙️ Frontend (React.js)

React.js (Functional Components & Hooks)

Axios (API communication)

React Router (Navigation)

Formik (Form validation)

⚙️ CSS (Styling)

🚀 Features

User Features

✅ View available products with prices, and stock information.
✅ Add products to the cart and place orders.
✅ Add custom special instructions for orders.

Admin Features

✅ Add, Edit, and Delete products.
✅ Manage stock and pricing.
✅ View and manage customer orders.

🛠️ Setup & Installation

1. Clone the Repository

git clone https://github.com/tymontiphy/ecommerce-app.git
cd ecommerce-app

2. Backend Setup (Flask API)

Create a Virtual Environment & Install Dependencies

python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate    # Windows
pipenv install

Setup the Database & Run Migrations

flask db init
flask db migrate -m "Initial migration"
flask db upgrade

Run the Flask Server

python app.py

The backend will run at: http://localhost:5000

3. Frontend Setup (React.js)

Install Dependencies

cd frontend
npm install

Start the React App

npm start

The frontend will run at: http://localhost:3000

📡 API Endpoints


🔥 Future Enhancements

Implement user authentication (JWT or OAuth).

Add payment integration (Stripe or PayPal).

Implement order tracking & notifications.

Improve UI with animations and advanced styling.


📜 License

This project is open-source and available under the MIT License.

🤝 Contributing

Fork the repository.

Create a new branch (git checkout -b feature-name).

Commit your changes (git commit -m 'Added new feature').

Push to the branch (git push origin feature-name).

Create a Pull Request.

👨‍💻 Author

Simon Tiphy📧 
Email: simontiphy@gmail.com

