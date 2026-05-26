-- Run this once on existing database
-- Adds explicit hostel assignment for students and backfills from current room allocations.

ALTER TABLE student
  ADD COLUMN hostel_id INT NULL AFTER user_id,
  ADD CONSTRAINT fk_student_hostel
    FOREIGN KEY (hostel_id) REFERENCES hostel(hostel_id)
    ON DELETE SET NULL ON UPDATE CASCADE;

UPDATE student s
LEFT JOIN (
  SELECT ra.student_id, r.hostel_id
  FROM room_allocation ra
  INNER JOIN room r ON r.room_id = ra.room_id
  WHERE ra.to_date IS NULL
) cur ON cur.student_id = s.student_id
SET s.hostel_id = cur.hostel_id
WHERE s.hostel_id IS NULL;
