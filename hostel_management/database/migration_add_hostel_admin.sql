-- Run this once on existing databases
-- Purpose: enforce one-hostel-one-admin mapping

CREATE TABLE IF NOT EXISTS hostel_admin (
  hostel_admin_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  hostel_id INT NOT NULL UNIQUE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (hostel_id) REFERENCES hostel(hostel_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Example mapping (replace IDs with your actual data)
-- INSERT INTO hostel_admin (user_id, hostel_id) VALUES (2, 1);
-- INSERT INTO hostel_admin (user_id, hostel_id) VALUES (3, 2);
