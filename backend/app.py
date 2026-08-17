from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app)

# SQLite database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///shelflife.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# -------------------------
# Donation Model
# -------------------------
class Donation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    food_name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    expiry_time = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    donor_name = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(30), default="Available")
    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "food_name": self.food_name,
            "quantity": self.quantity,
            "category": self.category,
            "expiry_time": self.expiry_time,
            "location": self.location,
            "donor_name": self.donor_name,
            "status": self.status
        }


# -------------------------
# Home
# -------------------------
@app.route("/")
def home():
    return jsonify({
        "message": "Welcome to ShelfLife - Food Rescue Management System"
    })


# -------------------------
# Health Check
# -------------------------
@app.route("/api/health")
def health():
    return jsonify({
        "status": "healthy",
        "message": "ShelfLife backend is running successfully"
    })


# -------------------------
# Add Donation
# -------------------------
@app.route("/api/donations", methods=["POST"])
def add_donation():

    data = request.get_json()

    donation = Donation(
        food_name=data.get("food_name"),
        quantity=data.get("quantity"),
        category=data.get("category"),
        expiry_time=data.get("expiry_time"),
        location=data.get("location"),
        donor_name=data.get("donor_name")
    )

    db.session.add(donation)
    db.session.commit()

    return jsonify({
        "message": "Food donation added successfully",
        "donation": donation.to_dict()
    }), 201


# -------------------------
# Get Donations
# -------------------------
@app.route("/api/donations", methods=["GET"])
def get_donations():

    donations = Donation.query.order_by(
        Donation.id.desc()
    ).all()

    return jsonify([
        donation.to_dict()
        for donation in donations
    ])


# -------------------------
# Claim Donation
# -------------------------
@app.route("/api/donations/<int:donation_id>/claim", methods=["PUT"])
def claim_donation(donation_id):

    donation = Donation.query.get(donation_id)

    if not donation:
        return jsonify({
            "error": "Donation not found"
        }), 404

    if donation.status != "Available":
        return jsonify({
            "error": "Donation is no longer available"
        }), 400

    donation.status = "Claimed"

    db.session.commit()

    return jsonify({
        "message": "Food donation claimed successfully",
        "donation": donation.to_dict()
    })


# -------------------------
# Mark as Collected
# -------------------------
@app.route("/api/donations/<int:donation_id>/collect", methods=["PUT"])
def collect_donation(donation_id):

    donation = Donation.query.get(donation_id)

    if not donation:
        return jsonify({
            "error": "Donation not found"
        }), 404

    donation.status = "Collected"

    db.session.commit()

    return jsonify({
        "message": "Food donation collected successfully",
        "donation": donation.to_dict()
    })


# -------------------------
# Dashboard Statistics
# -------------------------
@app.route("/api/dashboard", methods=["GET"])
def dashboard():

    total = Donation.query.count()
    available = Donation.query.filter_by(
        status="Available"
    ).count()

    claimed = Donation.query.filter_by(
        status="Claimed"
    ).count()

    collected = Donation.query.filter_by(
        status="Collected"
    ).count()

    return jsonify({
        "total_donations": total,
        "available": available,
        "claimed": claimed,
        "collected": collected
    })


# -------------------------
# Create Database
# -------------------------
with app.app_context():
    db.create_all()


# -------------------------
# Run Application
# -------------------------
if __name__ == "__main__":
    app.run(debug=True)