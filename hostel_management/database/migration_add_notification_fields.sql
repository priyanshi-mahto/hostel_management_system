-- Migration: Add target_audience and hostel_id to notification table
ALTER TABLE notification 
ADD COLUMN target_audience VARCHAR(100) NOT NULL DEFAULT 'All Students' AFTER message,
ADD COLUMN priority ENUM('Normal','Important') NOT NULL DEFAULT 'Normal' AFTER target_audience,
ADD COLUMN hostel_id INT AFTER priority,
ADD FOREIGN KEY (hostel_id) REFERENCES hostel(hostel_id) ON DELETE CASCADE ON UPDATE CASCADE;
