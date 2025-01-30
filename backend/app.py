from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from marshmallow import ValidationError

from models import db, User, Product, Order, OrderItem, user_schema, product_schema, order_schema, order_item_schema

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///shop.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)
CORS(app)
bcrypt = Bcrypt(app)

# Resources
class Register(Resource):
    def post(self):
        try:
            data = request.get_json()
            user_schema.load(data)
            hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
            new_user = User(username=data['username'], email=data['email'], password_hash=hashed_password)
            db.session.add(new_user)
            db.session.commit()
            return {'message': 'User registered successfully'}, 201
        except ValidationError as err:
            return {'errors': err.messages}, 400

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        if user and bcrypt.check_password_hash(user.password_hash, data['password']):
            return {'message': 'Login successful', 'user_id': user.id}, 200
        return {'message': 'Invalid credentials'}, 401

class ProductResource(Resource):
    def get(self):
        products = Product.query.all()
        return jsonify([{'id': p.id, 'name': p.name, 'price': p.price, 'stock': p.stock} for p in products])
    
    def post(self):
        try:
            data = request.get_json()
            product_schema.load(data)
            new_product = Product(name=data['name'], price=data['price'], stock=data['stock'])
            db.session.add(new_product)
            db.session.commit()
            return {'message': 'Product added successfully'}, 201
        except ValidationError as err:
            return {'errors': err.messages}, 400

    def put(self, product_id):
        product = Product.query.get(product_id)
        if not product:
            return {'message': 'Product not found'}, 404
        data = request.get_json()
        product.name = data.get('name', product.name)
        product.price = data.get('price', product.price)
        product.stock = data.get('stock', product.stock)
        db.session.commit()
        return {'message': 'Product updated successfully'}, 200

    def delete(self, product_id):
        product = Product.query.get(product_id)
        if not product:
            return {'message': 'Product not found'}, 404
        db.session.delete(product)
        db.session.commit()
        return {'message': 'Product deleted successfully'}, 200

class OrderResource(Resource):
    def get(self):
        orders = Order.query.all()
        return jsonify([{'id': o.id, 'user_id': o.user_id} for o in orders])
    
    def post(self):
        try:
            data = request.get_json()
            order_schema.load(data)
            new_order = Order(user_id=data['user_id'])
            db.session.add(new_order)
            db.session.commit()
            return {'message': 'Order placed successfully'}, 201
        except ValidationError as err:
            return {'errors': err.messages}, 400

# class OrderItemResource(Resource):
#     def post(self):
#         try:
#             data = request.get_json()
#             order_item_schema.load(data)
#             new_order_item = OrderItem(order_id=data['order_id'], product_id=data['product_id'], quantity=data['quantity'], special_instructions=data.get('special_instructions'))
#             db.session.add(new_order_item)
#             db.session.commit()
#             return {'message': 'Item added to order'}, 201
#         except ValidationError as err:
#             return {'errors': err.messages}, 400

class OrderItemResource(Resource):
    def post(self):
        try:
            data = request.get_json()
            order_item_schema.load(data)  # Validate the data with schema (if any)
            
            # Check if the order and product exist
            order = Order.query.get(data['order_id'])
            product = Product.query.get(data['product_id'])
            
            if not order:
                return {'message': 'Order not found'}, 404
            if not product:
                return {'message': 'Product not found'}, 404

            # Create a new order item
            new_order_item = OrderItem(
                order_id=data['order_id'],
                product_id=data['product_id'],
                quantity=data['quantity'],
                special_instructions=data.get('special_instructions')
            )
            
            # Add the order item to the session and commit the transaction
            db.session.add(new_order_item)
            db.session.commit()
            
            return {'message': 'Item added to order', 'order_item_id': new_order_item.id}, 201
        except ValidationError as err:
            return {'errors': err.messages}, 400
        except Exception as e:
            return {'message': str(e)}, 500


# API Routes
api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(ProductResource, '/products', '/products/<int:product_id>')
api.add_resource(OrderResource, '/orders')
api.add_resource(OrderItemResource, '/order_items')

if __name__ == '__main__':
    app.run(port=5000, debug=True)
