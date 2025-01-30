from flask_sqlalchemy import SQLAlchemy
from marshmallow import Schema, fields, validates, ValidationError

db = SQLAlchemy()

# User Model (One-to-Many with Orders)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    orders = db.relationship('Order', backref='user', lazy=True)

# Product Model
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    order_items = db.relationship('OrderItem', backref='product', lazy=True)

# Order Model (One-to-Many with OrderItem, Many-to-One with User)
class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    order_items = db.relationship('OrderItem', backref='order', lazy=True)

# OrderItem Model (Many-to-Many between Order and Product with user-submittable attribute)
class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    special_instructions = db.Column(db.String(255), nullable=True)
    
# Schemas for validation
class UserSchema(Schema):
    username = fields.String(required=True)
    email = fields.Email(required=True)
    password = fields.String(required=True)

class ProductSchema(Schema):
    name = fields.String(required=True)
    price = fields.Float(required=True)
    stock = fields.Integer(required=True)

    @validates('price')
    def validate_price(self, value):
        if value <= 0:
            raise ValidationError('Price must be greater than 0')
    
    @validates('stock')
    def validate_stock(self, value):
        if value < 0:
            raise ValidationError('Stock cannot be negative')

class OrderSchema(Schema):
    user_id = fields.Integer(required=True)

class OrderItemSchema(Schema):
    order_id = fields.Integer(required=True)
    product_id = fields.Integer(required=True)
    quantity = fields.Integer(required=True)
    special_instructions = fields.String()

# Instantiate schemas
user_schema = UserSchema()
product_schema = ProductSchema()
order_schema = OrderSchema()
order_item_schema = OrderItemSchema()
