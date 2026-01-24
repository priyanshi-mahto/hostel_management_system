CREATE DATABASE hostel_management_system;
USE hostel_management_system;

CREATE TABLE users(
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  password VARCHAR(255) NOT NULL
 CHECK (CHAR_LENGTH(password)>=8),
  email VARCHAR(100) NOT NULL UNIQUE,
  role ENUM('HOSTEL_ADMIN','STUDENT','STAFF','WARDEN') NOT NULL
);

CREATE TABLE hostel(
  hostel_id INT AUTO_INCREMENT PRIMARY KEY,
  hostel_name VARCHAR(100) NOT NULL,
  type ENUM('Boys','Girls') NOT NULL,
  number_of_rooms INT NOT NULL,
  capacity INT NOT NULL 
);

CREATE TABLE warden(
   warden_id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(100) NOT NULL,
   hostel_id INT NOT NULL UNIQUE,
   user_id INT NOT NULL UNIQUE,
   FOREIGN KEY (hostel_id) REFERENCES hostel(hostel_id) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE warden_contact_details(
   contact_id INT AUTO_INCREMENT PRIMARY KEY,
   phone CHAR(10) ,
   warden_id INT NOT NULL UNIQUE,
   CHECK (phone REGEXP '^[0-9]{10}$'),
   FOREIGN KEY (warden_id) REFERENCES warden(warden_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE room(
   room_id INT AUTO_INCREMENT PRIMARY KEY,
   unit INT NOT NULL ,
   CHECK (unit BETWEEN 100 AND 999),
   floor INT NOT NULL,
   room_no VARCHAR(10) NOT NULL,
   hostel_id INT NOT NULL,
   UNIQUE(hostel_id,unit,room_no),
   FOREIGN KEY (hostel_id) REFERENCES hostel(hostel_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE student (
   student_id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(50),
   profile_image VARCHAR(255),
   DOB date NOT NULL,
   blood_group ENUM('A+','A-','B+','B-','O+','O-','AB+','AB-') NOT NULL,
   house_no VARCHAR(50),
   street VARCHAR(255),
   area VARCHAR(100),
   city VARCHAR(100),
   state VARCHAR(30),
   pincode VARCHAR(10),
   gender ENUM('MALE','FEMALE','NOT PREFER TO SAY') NOT NULL,
   user_id INT NOT NULL UNIQUE,
   roll_no VARCHAR(20) NOT NULL UNIQUE,
   phone CHAR(10),
   CHECK (phone REGEXP '^[0-9]{10}$'),
   FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE guardian(
  guardian_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  relationship VARCHAR(40),
  phone CHAR(10),
  CHECK (phone REGEXP '^[0-9]{10}$'),
  house_no VARCHAR(50),
  street VARCHAR(255),
  area VARCHAR(100),
  city VARCHAR(100),
  state VARCHAR(30),
  pincode VARCHAR(10),
  student_id INT NOT NULL,
  FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE student_id_card(
    id_card_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL UNIQUE,
    id_front_image VARCHAR(255) NOT NULL,
    id_back_image VARCHAR(255) NOT NULL,
    verification_status ENUM('PENDING', 'VERIFIED', 'REJECTED')
	DEFAULT 'PENDING',
    verified_by INT,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE room_allocation(
    allocation_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    room_id INT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE,
    FOREIGN KEY (room_id) REFERENCES room(room_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE office_staff(
   staff_id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(50),
   phone CHAR(10),
   CHECK (phone REGEXP '^[0-9]{10}$'),
   user_id INT NOT NULL,
   hostel_id INT NOT NULL,
   FOREIGN KEY (hostel_id) REFERENCES hostel(hostel_id) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE complaint(
   complaint_id INT AUTO_INCREMENT PRIMARY KEY,
   category ENUM('Plumbing','Electrical','Internet','Cleanliness','Civil','Other') NOT NULL,
   title VARCHAR(100) NOT NULL,
   description TEXT ,
   status ENUM('Pending','Resolved') 
   DEFAULT 'Pending',
   date DATETIME DEFAULT CURRENT_TIMESTAMP,
   student_id INT NOT NULL,
   FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE visitor_profile(
   visitor_id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(50),
   relation ENUM('Parent','Sibling','Guardian','Relative','Friend','Other') NOT NULL,
   student_id INT NOT NULL,
   phone CHAR(10) NOT NULL,
   CHECK (phone REGEXP '^[0-9]{10}$'),
   email VARCHAR(50),
   FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE visiting_request(
   request_id INT AUTO_INCREMENT PRIMARY KEY,
   student_id INT NOT NULL,
   from_date DATE NOT NULL,
   to_date DATE NOT NULL,
   reason TEXT NOT NULL,
   status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   CHECK(to_date>=from_date),
   FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE visitor_request(
   request_id INT ,
   visitor_id INT,
   PRIMARY KEY(request_id,visitor_id),
   FOREIGN KEY (request_id) REFERENCES visiting_request(request_id) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY (visitor_id) REFERENCES visitor_profile(visitor_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE lost_and_found(
   item_id INT AUTO_INCREMENT PRIMARY KEY,
   item_name VARCHAR(100) NOT NULL,
   type ENUM('Lost','Found') NOT NULL,
   status ENUM('Active','Claimed')
   DEFAULT 'Active',
   date DATETIME DEFAULT CURRENT_TIMESTAMP,
   hostel_id INT NOT NULL,
   FOREIGN KEY (hostel_id) REFERENCES hostel(hostel_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE notification(
   notification_id INT AUTO_INCREMENT PRIMARY KEY,
   message TEXT,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roommate(
   roommate_id INT NOT NULL,
   student_id INT NOT NULL,
   room_id INT NOT NULL,
   PRIMARY KEY(roommate_id,student_id),
   FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY (roommate_id) REFERENCES student(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY (room_id) REFERENCES room(room_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE complaint_feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT NOT NULL UNIQUE,
    student_id INT NOT NULL,
    -- Star rating (1 to 5)
    rating INT NOT NULL,
    satisfaction ENUM ('Satisfied','Unsatisfied','False Fix'),
    feedback_text TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (rating BETWEEN 1 AND 5),
    FOREIGN KEY (complaint_id) REFERENCES complaint(complaint_id) ON DELETE CASCADE ON UPDATE CASCADE ,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE leave_request (
    leave_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    reason TEXT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by INT,
    approved_at TIMESTAMP,
    CHECK (to_date >= from_date),
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE
);
