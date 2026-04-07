CREATE TABLE t_p88522653_restaurant_classic_s.bookings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(10) NOT NULL,
    guests VARCHAR(20) NOT NULL,
    wishes TEXT DEFAULT '',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);
