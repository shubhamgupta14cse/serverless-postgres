CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;

DROP TABLE IF EXISTS instructors;

CREATE TYPE GENDER AS ENUM ('MALE','FEMALE','OTHER');
CREATE TABLE instructors (
    id SERIAL PRIMARY KEY,
    first_name varchar(256) NOT NULL,
    middle_name varchar(256) NOT NULL DEFAULT '',
    last_name varchar(256) NOT NULL,
    email varchar(50) NOT NULL UNIQUE,
    password varchar(256) NOT NULL,
    dob DATE NOT NULL,
    gender GENDER NOT NULL,
    image_url TEXT DEFAULT NULL,
    avg_rating INTEGER NOT NULL CHECK (avg_rating in (1,2,3,4,5)),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


DROP TABLE IF EXISTS address;

CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    address1 varchar(512) DEFAULT NULL,
    address2 varchar(512) DEFAULT NULL,
    city varchar(128) DEFAULT NULL,
    state varchar(128) DEFAULT NULL,
    postal_code varchar(32) DEFAULT NULL,
    country_code varchar(32) DEFAULT NULL,
    country_code_description varchar(128) DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


DROP TABLE IF EXISTS instructor_address;

CREATE TABLE instructor_address (
    id SERIAL PRIMARY KEY,
    instructor_id INTEGER NOT NULL REFERENCES instructors (id) ON DELETE CASCADE,
    address_id INTEGER NOT NULL REFERENCES address (id) ON DELETE CASCADE,
    CONSTRAINT instructor_address_unique UNIQUE(instructor_id,address_id)
);


DROP TABLE IF EXISTS language;

CREATE TABLE language (
    id SERIAL PRIMARY KEY,
    language varchar(512) DEFAULT 'English',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


DROP TABLE IF EXISTS instructor_language;

CREATE TYPE PREF AS ENUM ('PRIMARY','SECONDARY');
CREATE TABLE instructor_language (
    id SERIAL PRIMARY KEY,
    instructor_id INTEGER NOT NULL REFERENCES instructors (id) ON DELETE CASCADE,
    language_id INTEGER NOT NULL REFERENCES language (id) ON DELETE CASCADE,
    preference PREF NOT NULL DEFAULT 'PRIMARY',
    CONSTRAINT instructor_language_unique UNIQUE(instructor_id,language_id)
);


DROP TABLE IF EXISTS rating;

CREATE TABLE ratings (
  	id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
  	rating INTEGER NOT NULL CHECK (rating in (1,2,3,4,5)),
  	feedback TEXT,
    compliment TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


DROP TABLE IF EXISTS instructor_rating;

CREATE TABLE instructor_rating (
    id SERIAL PRIMARY KEY,
    instructor_id INTEGER NOT NULL REFERENCES instructors (id) ON DELETE CASCADE,
    rating_id INTEGER NOT NULL REFERENCES ratings (id) ON DELETE CASCADE,
    CONSTRAINT instructor_rating_unique UNIQUE(instructor_id,rating_id)
);


DROP TABLE IF EXISTS skill;

CREATE TABLE skill (
    id SERIAL PRIMARY KEY,
    skill_name varchar(256) NOT NULL,
    parent_id INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


DROP TABLE IF EXISTS instructor_skills;

CREATE TYPE OFFERING_TYPE AS ENUM ('SOLO','GROUP','BOTH');
CREATE TABLE instructor_skills (
    id  SERIAL PRIMARY KEY,
    instructor_id INTEGER NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skill (id) ON DELETE CASCADE,
    avg_rating INTEGER NOT NULL CHECK (avg_rating in (1,2,3,4,5)),
    online_exp SMALLINT DEFAULT NULL CHECK (online_exp >= 0 AND online_exp < 100),
    offline_exp SMALLINT DEFAULT NULL CHECK (offline_exp >= 0 AND offline_exp < 100),
    offering_type OFFERING_TYPE NOT NULL DEFAULT 'BOTH',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT instructor_skill_unique UNIQUE(instructor_id,skill_id)
);


DROP TABLE IF EXISTS docs_type;

CREATE TABLE docs_type (
    id  SERIAL PRIMARY KEY,
    name varchar(256) NOT NULL,
    description TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


DROP TABLE IF EXISTS instructor_docs;

CREATE TABLE instructor_docs (
    id  SERIAL PRIMARY KEY,
    instructor_id INTEGER NOT NULL REFERENCES instructors (id) ON DELETE CASCADE,
    docs_type_id INTEGER NOT NULL REFERENCES docs_type (id) ON DELETE CASCADE,
    link TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


DROP TABLE IF EXISTS instructor_skills_doc;

CREATE TABLE instructor_skills_doc (
    id  SERIAL PRIMARY KEY,
    instructor_id INTEGER NOT NULL REFERENCES instructors (id) ON DELETE CASCADE,
    instructor_docs_id INTEGER NOT NULL REFERENCES instructor_docs (id) ON DELETE CASCADE,
    instructor_skills_id INTEGER NOT NULL REFERENCES instructor_skills (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


DROP TABLE IF EXISTS instructor_media;

CREATE TYPE CONTENT_TYPE AS ENUM ('PHOTO','VIDEO');
CREATE TYPE MEDIA_TYPE AS ENUM ('WORK_SAMPLE','INTRO');
CREATE TABLE instructor_media (
    id  SERIAL PRIMARY KEY,
    instructor_id INTEGER NOT NULL REFERENCES instructors (id) ON DELETE CASCADE,
    link TEXT NOT NULL,
    content_type CONTENT_TYPE NOT NULL DEFAULT 'PHOTO',
    media_type MEDIA_TYPE NOT NULL DEFAULT 'INTRO',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


DROP TABLE IF EXISTS instructor_skills_media;

CREATE TYPE CLASS_TYPE AS ENUM ('DEMO','REGULAR');
CREATE TABLE instructor_skills_media (
    id  SERIAL PRIMARY KEY,
    instructor_id INTEGER NOT NULL REFERENCES instructors (id) ON DELETE CASCADE,
    instructor_media_id INTEGER NOT NULL REFERENCES instructor_media (id) ON DELETE CASCADE,
    instructor_skills_id INTEGER NOT NULL REFERENCES instructor_skills (id) ON DELETE CASCADE,
    class_type CLASS_TYPE NOT NULL DEFAULT 'REGULAR',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


DROP TABLE IF EXISTS instructor_skills_offering_pref;

CREATE TYPE BATCH_TYPE AS ENUM ('SOLO','GROUP','CUSTOM');
CREATE TABLE instructor_skills_offering_pref (
    id  SERIAL PRIMARY KEY,
    instructor_id INTEGER NOT NULL REFERENCES instructors (id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skill (id) ON DELETE CASCADE,
    instructor_skill_id INTEGER NOT NULL REFERENCES instructor_skills (id) ON DELETE CASCADE,
    batch_type BATCH_TYPE NOT NULL DEFAULT 'GROUP',
    name varchar(256) NOT NULL,
    description TEXT DEFAULT NULL,
    max_student SMALLINT NOT NULL CHECK (max_student >= 0 AND max_student < 50),
    min_student SMALLINT NOT NULL CHECK (min_student >= 0 AND min_student < max_student),
    max_session SMALLINT NOT NULL CHECK (max_session > 0 ),
    min_session SMALLINT NOT NULL CHECK (min_session < max_session ),
    max_session_per_week SMALLINT NOT NULL CHECK (max_session_per_week in (1,2,3,4,5,6,7)),
    recommended_session_per_week SMALLINT NOT NULL CHECK (max_session_per_week in (1,2,3,4,5,6,7)),
    cost_per_student INTEGER NOT NULL,
    total_reschedule SMALLINT NOT NULL CHECK (total_reschedule < max_session),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



DROP TABLE IF EXISTS offerings;

CREATE TYPE OFFERING_STATUS AS ENUM ('ACTIVE','INACTIVE','COMPLETE');
CREATE TABLE offerings (
    id  SERIAL PRIMARY KEY,
    instructor_id INTEGER NOT NULL REFERENCES instructors (id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skill (id) ON DELETE CASCADE,
    instructor_skills_offering_pref_id INTEGER NOT NULL REFERENCES instructor_skills_offering_pref (id) ON DELETE CASCADE,
    name varchar(256) NOT NULL,
    description TEXT DEFAULT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    status OFFERING_STATUS NOT NULL DEFAULT 'ACTIVE',
    cost INTEGER NOT NULL CHECK (cost >= 0 ),
    total_session SMALLINT NOT NULL CHECK (total_session > 0 ),
    avg_rating INTEGER NOT NULL CHECK (avg_rating in (1,2,3,4,5)),
    thumbnail_link TEXT NOT NULL,
    current_reschedule SMALLINT NOT NULL CHECK (current_reschedule < total_session),
    student_resource JSON NOT NULL,
    instructor_resource JSON NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



DROP TABLE IF EXISTS availability;

CREATE TABLE availability (
    id  SERIAL PRIMARY KEY,
    instructor_skill_id INTEGER NOT NULL REFERENCES instructor_skills (id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_date DATE NOT NULL,
    end_time TIME NOT NULL,
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    weekday varchar(1) NOT NULL CHECK (weekday in ('mon','tues','wed','thur','fri','sat','sun')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


DROP TABLE IF EXISTS offering_availability;

CREATE TABLE offering_availability (
    id  SERIAL PRIMARY KEY,
    instructor_id INTEGER NOT NULL REFERENCES instructors (id) ON DELETE CASCADE,
    availability_id INTEGER NOT NULL REFERENCES availability (id) ON DELETE CASCADE,
    offering_id INTEGER NOT NULL REFERENCES offerings (id) ON DELETE CASCADE,
    batch_type BATCH_TYPE NOT NULL DEFAULT 'GROUP',
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


DROP TABLE IF EXISTS sessions;

CREATE TYPE SESSION_STATUS AS ENUM ('ACTIVE','INACTIVE','COMPLETE');
CREATE TABLE sessions (
    id  SERIAL PRIMARY KEY,
    offering_id INTEGER NOT NULL REFERENCES offerings (id) ON DELETE CASCADE,
    instructor_id INTEGER NOT NULL REFERENCES instructors (id) ON DELETE CASCADE,
    session_no SMALLINT NOT NULL,
    total_session SMALLINT NOT NULL,
    status SESSION_STATUS NOT NULL DEFAULT 'ACTIVE',
    batch_type BATCH_TYPE NOT NULL,
    start_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_date DATE NOT NULL,
    end_time TIME NOT NULL,
    avg_rating INTEGER NOT NULL CHECK (avg_rating in (1,2,3,4,5)),
    is_cancelled BOOLEAN NOT NULL DEFAULT FALSE,
    is_rescheduled BOOLEAN NOT NULL DEFAULT FALSE,
    conference_link TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


DROP TABLE IF EXISTS session_material;

CREATE TABLE session_material (
    id  SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES sessions (id) ON DELETE CASCADE,
    offering_id INTEGER NOT NULL REFERENCES offerings (id) ON DELETE CASCADE,
    notes TEXT NOT NULL,
    description TEXT NOT NULL,
    student_resource JSON NOT NULL,
    instructor_resource JSON NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


DROP TABLE IF EXISTS students;

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    first_name varchar(256) NOT NULL,
    middle_name varchar(256) NOT NULL DEFAULT '',
    last_name varchar(256) NOT NULL,
    email varchar(50) NOT NULL UNIQUE,
    password varchar(256) NOT NULL,
    dob DATE NOT NULL,
    gender GENDER NOT NULL,
    image_url TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- Do the same for phone
DROP TABLE IF EXISTS student_address;

CREATE TABLE student_address (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    address_id INTEGER NOT NULL REFERENCES address (id) ON DELETE CASCADE,
    CONSTRAINT student_address_unique UNIQUE(student_id,address_id)
);



DROP TABLE IF EXISTS orders;

CREATE TYPE ORDER_STATUS AS ENUM ('PAID','UNPAID','INPROGRESS');
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    offering_id INTEGER NOT NULL REFERENCES offerings (id) ON DELETE CASCADE,
    rating_id INTEGER NOT NULL REFERENCES ratings (id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT NOW(),
    reciept varchar(256) UNIQUE NOT NULL,
    paid_ammount INTEGER NOT NULL CHECK (paid_ammount >= 0 ),
    due_ammount INTEGER NOT NULL CHECK (due_ammount >= 0 ),
    total_ammount INTEGER NOT NULL CHECK (total_ammount >= 0 ),
    status ORDER_STATUS NOT NULL DEFAULT 'UNPAID',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT student_offering_unique UNIQUE(student_id,offering_id)
);



DROP TABLE IF EXISTS payments;

CREATE TYPE PAYMENT_STATUS AS ENUM ('CREATED','AUTHORIZED','CAPTURED','REFUNDED','FAILED');
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    payment_id TEXT DEFAULT '',
    signature_id TEXT DEFAULT '',
    date DATE NOT NULL DEFAULT NOW(),
    ammount_paid INTEGER NOT NULL CHECK (ammount_paid >= 0 ),
    status PAYMENT_STATUS NOT NULL DEFAULT 'CREATED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



DROP TABLE IF EXISTS student_sessions;

CREATE TABLE student_sessions (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    session_id INTEGER NOT NULL REFERENCES sessions (id) ON DELETE CASCADE,
    rating_id INTEGER NOT NULL REFERENCES ratings (id) ON DELETE CASCADE,
    CONSTRAINT student_session_unique UNIQUE(student_id,session_id)
    -- see if we need oreder id here , or find a way to validate that student has paid and the entries exist here should only be for paid orders
);



DROP TABLE IF EXISTS assignments;

CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES sessions (id) ON DELETE CASCADE,
    name varchar(256) NOT NULL,
    description TEXT DEFAULT NULL,
    assignment_link TEXT NOT NULL
);



DROP TABLE IF EXISTS solutions;

CREATE TABLE solutions (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    assignment_id INTEGER NOT NULL REFERENCES assignments (id) ON DELETE CASCADE,
    student_session_id INTEGER NOT NULL REFERENCES student_sessions (id) ON DELETE CASCADE,
    CONSTRAINT student_session_assignment_unique UNIQUE(assignment_id,student_session_id)
);






-- TODO keep a average rating in session , offering and instructor and map the value from table defining unique relation with student such as order as between offering and student and student_session b/w student and session

COMMENT 'The first name of the instructor'
COMMENT 'The middle name of the instructor'
COMMENT 'The last name of the instructor'
COMMENT 'The primary email of the instructor'
COMMENT 'Encoded instructor password'
COMMENT 'The document/s3 link for the instructor profile pic'
COMMENT 'The date when the row is created'
COMMENT 'The date when the row is updated'

COMMENT 'The name of the language'
COMMENT 'The date when the row is created'
COMMENT 'The date when the row is updated'

COMMENT 'The compliment given along feedback'
COMMENT 'The date when the row is created'
COMMENT 'The date when the row is updated'

COMMENT 'The first name of the skill'
COMMENT 'The parent id of the skill to represent tree heriarchy'
COMMENT 'The date when the row is created'
COMMENT 'The date when the row is updated'

COMMENT 'is this availability recurring'
COMMENT 'The No of years of experience in online teaching'
COMMENT 'The No of years of experience in offline teaching'
COMMENT 'The class type(one2one, group or both) preference of the instructor for the skill'
COMMENT 'The date when the row is created'
COMMENT 'The date when the row is updated'
