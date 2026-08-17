import { useEffect, useState } from "react";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [donations, setDonations] = useState([]);
  const [dashboard, setDashboard] = useState({
    total_donations: 0,
    available: 0,
    claimed: 0,
    collected: 0,
  });

  const [food, setFood] = useState({
    donor_name: "",
    food_name: "",
    quantity: "",
    category: "",
    expiry_time: "",
    location: "",
  });

  // ==========================================
  // FETCH DONATIONS
  // ==========================================

  const fetchDonations = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/donations"
      );

      const data = await response.json();

      setDonations(data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };


  // ==========================================
  // FETCH DASHBOARD
  // ==========================================

  const fetchDashboard = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/dashboard"
      );

      const data = await response.json();

      setDashboard(data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }
  };


  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    fetchDonations();
    fetchDashboard();
  }, []);


  // ==========================================
  // REFRESH ALL DATA
  // ==========================================

  const refreshData = () => {
    fetchDonations();
    fetchDashboard();
  };


  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFood((previousFood) => ({
      ...previousFood,
      [name]: value,
    }));
  };


  // ==========================================
  // ADD DONATION
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/donations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(food),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "✅ Food donation added successfully!"
        );

        setFood({
          donor_name: "",
          food_name: "",
          quantity: "",
          category: "",
          expiry_time: "",
          location: "",
        });

        refreshData();

        setTimeout(() => {
          setShowForm(false);
          setMessage("");
        }, 1200);

      } else {
        setMessage(
          "❌ " +
          (data.error || "Failed to add donation.")
        );
      }

    } catch (error) {
      console.error(error);

      setMessage(
        "❌ Unable to connect to backend."
      );
    }
  };


  // ==========================================
  // CLAIM FOOD
  // ==========================================

  const claimFood = async (donationId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/donations/${donationId}/claim`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("✅ Food claimed successfully!");
        refreshData();
      } else {
        alert(
          data.error ||
          "Unable to claim food."
        );
      }

    } catch (error) {
      console.error(error);

      alert(
        "Unable to connect to backend."
      );
    }
  };


  // ==========================================
  // MARK AS COLLECTED
  // ==========================================

  const collectFood = async (donationId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/donations/${donationId}/collect`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("✅ Food marked as collected!");
        refreshData();
      } else {
        alert(
          data.error ||
          "Unable to mark food as collected."
        );
      }

    } catch (error) {
      console.error(error);

      alert(
        "Unable to connect to backend."
      );
    }
  };


  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#f4f8f5",
        minHeight: "100vh",
        color: "#173b2c",
      }}
    >

      {/* ======================================
          NAVBAR
      ======================================= */}

      <nav
        style={{
          background: "white",
          padding: "18px 8%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ddd",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >

        <h2 style={{ margin: 0 }}>
          🌱 ShelfLife
        </h2>

        <div>

          <a
            href="#home"
            style={navLink}
          >
            Home
          </a>

          <a
            href="#dashboard"
            style={navLink}
          >
            Dashboard
          </a>

          <a
            href="#food"
            style={navLink}
          >
            Available Food
          </a>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            style={navButton}
          >
            Donate Food
          </button>

        </div>

      </nav>


      {/* ======================================
          HERO
      ======================================= */}

      <section
        id="home"
        style={{
          padding: "80px 10%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "50px",
        }}
      >

        <div
          style={{
            maxWidth: "650px",
          }}
        >

          <p
            style={{
              color: "#287a4b",
              fontWeight: "bold",
              letterSpacing: "2px",
            }}
          >
            RESCUE FOOD • REDUCE WASTE
          </p>

          <h1
            style={{
              fontSize: "55px",
              margin: "15px 0",
              lineHeight: "1.1",
            }}
          >
            Give Surplus Food
            <br />

            <span
              style={{
                color: "#287a4b",
              }}
            >
              A Second Life.
            </span>
          </h1>

          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.7",
              color: "#63736a",
            }}
          >
            ShelfLife connects surplus food donors
            with volunteers who can collect and
            distribute it before it goes to waste.
          </p>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            style={primaryButton}
          >
            Donate Surplus Food
          </button>

        </div>


        {/* IMPACT */}

        <div style={impactCard}>

          <div style={{ fontSize: "55px" }}>
            🍲
          </div>

          <h3>
            Today's Impact
          </h3>

          <h1
            style={{
              color: "#287a4b",
              fontSize: "40px",
            }}
          >
            Food Rescue
          </h1>

          <p>
            Together we reduce food waste.
          </p>

        </div>

      </section>


      {/* ======================================
          DASHBOARD
      ======================================= */}

      <section
        id="dashboard"
        style={{
          background: "white",
          padding: "60px 10%",
        }}
      >

        <div
          style={{
            textAlign: "center",
            marginBottom: "35px",
          }}
        >

          <p
            style={{
              color: "#287a4b",
              fontWeight: "bold",
              letterSpacing: "2px",
            }}
          >
            DASHBOARD
          </p>

          <h2
            style={{
              fontSize: "35px",
            }}
          >
            Food Rescue Statistics
          </h2>

        </div>


        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >

          <StatCard
            icon="🍱"
            title="Total Donations"
            value={dashboard.total_donations}
          />

          <StatCard
            icon="🟢"
            title="Available"
            value={dashboard.available}
          />

          <StatCard
            icon="🤝"
            title="Claimed"
            value={dashboard.claimed}
          />

          <StatCard
            icon="♻️"
            title="Collected"
            value={dashboard.collected}
          />

        </div>

      </section>


      {/* ======================================
          FEATURES
      ======================================= */}

      <section
        style={{
          padding: "60px 10%",
          display: "flex",
          gap: "25px",
          flexWrap: "wrap",
        }}
      >

        <Feature
          icon="🍱"
          title="Donate Food"
          text="List surplus food with quantity and expiry information."
        />

        <Feature
          icon="🤝"
          title="Rescue Food"
          text="Volunteers can discover and claim available food."
        />

        <Feature
          icon="♻️"
          title="Reduce Waste"
          text="Track food from donation to successful collection."
        />

      </section>


      {/* ======================================
          AVAILABLE FOOD
      ======================================= */}

      <section
        id="food"
        style={{
          padding: "70px 10%",
        }}
      >

        <div
          style={{
            textAlign: "center",
          }}
        >

          <p
            style={{
              color: "#287a4b",
              fontWeight: "bold",
            }}
          >
            AVAILABLE NOW
          </p>

          <h2
            style={{
              fontSize: "35px",
            }}
          >
            Food Ready to Be Rescued
          </h2>

          <p
            style={{
              color: "#63736a",
            }}
          >
            Browse surplus food available for collection.
          </p>

        </div>


        <div
          style={{
            display: "flex",
            gap: "25px",
            marginTop: "40px",
            flexWrap: "wrap",
          }}
        >

          {donations.filter(
            (donation) =>
              donation.status === "Available"
          ).length === 0 ? (

            <p
              style={{
                textAlign: "center",
                width: "100%",
                color: "#63736a",
              }}
            >
              No food donations available.
            </p>

          ) : (

            donations
              .filter(
                (donation) =>
                  donation.status === "Available"
              )
              .map((donation) => (

                <FoodCard
                  key={donation.id}
                  donation={donation}
                  onClaim={claimFood}
                />

              ))

          )}

        </div>

      </section>


      {/* ======================================
          CLAIMED / COLLECTION
      ======================================= */}

      <section
        style={{
          background: "white",
          padding: "70px 10%",
        }}
      >

        <div
          style={{
            textAlign: "center",
            marginBottom: "35px",
          }}
        >

          <p
            style={{
              color: "#287a4b",
              fontWeight: "bold",
            }}
          >
            COLLECTION
          </p>

          <h2>
            Claimed Food
          </h2>

        </div>


        <div
          style={{
            display: "flex",
            gap: "25px",
            flexWrap: "wrap",
          }}
        >

          {donations.filter(
            (donation) =>
              donation.status === "Claimed"
          ).length === 0 ? (

            <p
              style={{
                width: "100%",
                textAlign: "center",
                color: "#63736a",
              }}
            >
              No claimed food yet.
            </p>

          ) : (

            donations
              .filter(
                (donation) =>
                  donation.status === "Claimed"
              )
              .map((donation) => (

                <div
                  key={donation.id}
                  style={cardStyle}
                >

                  <span style={claimedBadge}>
                    Claimed
                  </span>

                  <h3>
                    {donation.food_name}
                  </h3>

                  <p>
                    📦 {donation.quantity}
                  </p>

                  <p>
                    📍 {donation.location}
                  </p>

                  <p>
                    👤 {donation.donor_name}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      collectFood(donation.id)
                    }
                    style={collectButton}
                  >
                    Mark as Collected
                  </button>

                </div>

              ))

          )}

        </div>

      </section>


      {/* ======================================
          COLLECTED FOOD
      ======================================= */}

      <section
        style={{
          padding: "70px 10%",
        }}
      >

        <div
          style={{
            textAlign: "center",
            marginBottom: "35px",
          }}
        >

          <p
            style={{
              color: "#287a4b",
              fontWeight: "bold",
            }}
          >
            COMPLETED
          </p>

          <h2>
            Successfully Collected
          </h2>

        </div>


        <div
          style={{
            display: "flex",
            gap: "25px",
            flexWrap: "wrap",
          }}
        >

          {donations.filter(
            (donation) =>
              donation.status === "Collected"
          ).length === 0 ? (

            <p
              style={{
                width: "100%",
                textAlign: "center",
                color: "#63736a",
              }}
            >
              No completed collections yet.
            </p>

          ) : (

            donations
              .filter(
                (donation) =>
                  donation.status === "Collected"
              )
              .map((donation) => (

                <div
                  key={donation.id}
                  style={cardStyle}
                >

                  <span style={collectedBadge}>
                    Collected ✓
                  </span>

                  <h3>
                    {donation.food_name}
                  </h3>

                  <p>
                    📦 {donation.quantity}
                  </p>

                  <p>
                    📍 {donation.location}
                  </p>

                  <p>
                    👤 {donation.donor_name}
                  </p>

                </div>

              ))

          )}

        </div>

      </section>


      {/* ======================================
          FOOTER
      ======================================= */}

      <footer
        style={{
          background: "#173b2c",
          color: "white",
          textAlign: "center",
          padding: "45px",
        }}
      >

        <h3>
          🌱 ShelfLife
        </h3>

        <p>
          Rescuing surplus food.
          Building sustainable communities.
        </p>

        <small>
          Full Stack Project | Docker | Jenkins CI/CD
        </small>

      </footer>


      {/* ======================================
          DONATION MODAL
      ======================================= */}

      {showForm && (

        <div style={modalOverlay}>

          <div style={modal}>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >

              <h2>
                Donate Surplus Food
              </h2>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setMessage("");
                }}
                style={closeButton}
              >
                ×
              </button>

            </div>


            <form onSubmit={handleSubmit}>

              <input
                type="text"
                name="donor_name"
                placeholder="Donor Name"
                value={food.donor_name}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              <input
                type="text"
                name="food_name"
                placeholder="Food Name"
                value={food.food_name}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              <input
                type="text"
                name="quantity"
                placeholder="Quantity (Example: 10 kg)"
                value={food.quantity}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              <select
                name="category"
                value={food.category}
                onChange={handleChange}
                required
                style={inputStyle}
              >

                <option value="">
                  Select Category
                </option>

                <option value="Meals">
                  Meals
                </option>

                <option value="Bakery">
                  Bakery
                </option>

                <option value="Fruits">
                  Fruits
                </option>

                <option value="Vegetables">
                  Vegetables
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

              <input
                type="text"
                name="expiry_time"
                placeholder="Expiry Time"
                value={food.expiry_time}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              <input
                type="text"
                name="location"
                placeholder="Pickup Location"
                value={food.location}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              <button
                type="submit"
                style={submitButton}
              >
                Add Donation
              </button>

            </form>


            {message && (

              <p
                style={{
                  textAlign: "center",
                  marginTop: "15px",
                  fontWeight: "bold",
                }}
              >
                {message}
              </p>

            )}

          </div>

        </div>

      )}

    </div>
  );
}


/* ==========================================
   COMPONENTS
========================================== */

function StatCard({
  icon,
  title,
  value,
}) {
  return (
    <div
      style={{
        background: "#f4f8f5",
        padding: "30px",
        borderRadius: "15px",
        textAlign: "center",
        border: "1px solid #dce8df",
      }}
    >

      <div
        style={{
          fontSize: "35px",
        }}
      >
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <div
        style={{
          fontSize: "35px",
          fontWeight: "bold",
          color: "#287a4b",
        }}
      >
        {value}
      </div>

    </div>
  );
}


function Feature({
  icon,
  title,
  text,
}) {
  return (
    <div
      style={{
        flex: "1 1 250px",
        padding: "30px",
        border: "1px solid #dce8df",
        borderRadius: "15px",
        background: "white",
      }}
    >

      <div
        style={{
          fontSize: "35px",
        }}
      >
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p
        style={{
          color: "#63736a",
          lineHeight: "1.6",
        }}
      >
        {text}
      </p>

    </div>
  );
}


/* ==========================================
   STYLES
========================================== */

const navLink = {
  marginRight: "20px",
  textDecoration: "none",
  color: "#173b2c",
};

const navButton = {
  padding: "10px 18px",
  background: "#287a4b",
  color: "white",
  border: "none",
  borderRadius: "7px",
  cursor: "pointer",
};

const primaryButton = {
  marginTop: "20px",
  padding: "14px 25px",
  background: "#287a4b",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
};

const impactCard = {
  background: "white",
  padding: "35px",
  borderRadius: "20px",
  width: "280px",
  textAlign: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  border: "1px solid #dfe8e1",
  flex: "1 1 280px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
};

const claimedBadge = {
  background: "#fff4d6",
  color: "#8a6500",
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "12px",
};

const collectedBadge = {
  background: "#e8f5eb",
  color: "#287a4b",
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "12px",
};

const collectButton = {
  width: "100%",
  padding: "11px",
  background: "#287a4b",
  color: "white",
  border: "none",
  borderRadius: "7px",
  cursor: "pointer",
  marginTop: "10px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  border: "1px solid #d5dfd8",
  borderRadius: "7px",
  fontSize: "14px",
  boxSizing: "border-box",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modal = {
  background: "white",
  padding: "35px",
  borderRadius: "15px",
  width: "420px",
  maxWidth: "90%",
};

const closeButton = {
  border: "none",
  background: "none",
  fontSize: "25px",
  cursor: "pointer",
};

const submitButton = {
  width: "100%",
  padding: "13px",
  background: "#287a4b",
  color: "white",
  border: "none",
  borderRadius: "7px",
  cursor: "pointer",
  fontSize: "16px",
};


export default App;