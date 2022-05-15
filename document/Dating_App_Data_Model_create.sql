-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2022-04-03 02:14:42.844

Create DATABASE tinder;
use tinder;
-- tables
-- Table: block_user
CREATE TABLE block_user (
    id int  NOT NULL,
    user_account_id int  NOT NULL,
    user_account_id_blocked int  NOT NULL,
    CONSTRAINT block_user_ak_1 UNIQUE (user_account_id, user_account_id_blocked) ,
    CONSTRAINT block_user_pk PRIMARY KEY (id)
);

-- Table: conversation
CREATE TABLE conversation (
    id int  NOT NULL,
    user_account_id int  NOT NULL,
    time_started timestamp  NOT NULL,
    time_closed timestamp  NULL,
    CONSTRAINT conversation_pk PRIMARY KEY (id)
);

-- Table: gender
CREATE TABLE gender (
    id int  NOT NULL,
    name varchar(32)  NOT NULL,
    CONSTRAINT gender_ak_1 UNIQUE (name) ,
    CONSTRAINT gender_pk PRIMARY KEY (id)
);

-- Table: grade
CREATE TABLE grade (
    id int  NOT NULL,
    user_account_id_given int  NOT NULL,
    user_account_id_received int  NOT NULL,
    grade int  NOT NULL,
    CONSTRAINT grade_ak_1 UNIQUE (user_account_id_given, user_account_id_received) ,
    CONSTRAINT grade_pk PRIMARY KEY (id)
);

-- Table: interested_in_gender
CREATE TABLE interested_in_gender (
    id int  NOT NULL,
    user_account_id int  NOT NULL,
    gender_id int  NOT NULL,
    CONSTRAINT interested_in_ak_1 UNIQUE (user_account_id, gender_id) ,
    CONSTRAINT interested_in_gender_pk PRIMARY KEY (id)
);

-- Table: interested_in_relation
CREATE TABLE interested_in_relation (
    id int  NOT NULL,
    user_account_id int  NOT NULL,
    relationship_type_id int  NOT NULL,
    CONSTRAINT interested_in_relation_ak_1 UNIQUE (user_account_id, relationship_type_id) ,
    CONSTRAINT interested_in_relation_pk PRIMARY KEY (id)
);

-- Table: message
CREATE TABLE message (
    id int  NOT NULL,
    participant_id int  NOT NULL,
    message_text text  NOT NULL,
    ts timestamp  NOT NULL,
    CONSTRAINT message_pk PRIMARY KEY (id)
);

-- Table: participant
CREATE TABLE participant (
    id int  NOT NULL,
    conversation_id int  NOT NULL,
    user_account_id int  NOT NULL,
    time_joined timestamp  NOT NULL,
    time_left timestamp  NULL,
    CONSTRAINT participant_ak_1 UNIQUE (conversation_id, user_account_id) ,
    CONSTRAINT participant_pk PRIMARY KEY (id)
);

-- Table: relationship_type
CREATE TABLE relationship_type (
    id int  NOT NULL,
    name varchar(32)  NOT NULL,
    CONSTRAINT relationship_type_ak_1 UNIQUE (name) ,
    CONSTRAINT relationship_type_pk PRIMARY KEY (id)
);

-- Table: user_account
CREATE TABLE user_account (
    id int  NOT NULL,
    first_name varchar(64)  NOT NULL,
    last_name varchar(64)  NOT NULL,
    gender_id int  NOT NULL,
    details text  NOT NULL,
    nickname varchar(64)  NOT NULL,
    email varchar(128)  NOT NULL,
    confirmation_code text  NOT NULL,
    confirmation_time timestamp  NULL,
    popularity decimal(5,2)  NOT NULL,
    CONSTRAINT user_account_ak_1 UNIQUE (email) ,
    CONSTRAINT user_account_pk PRIMARY KEY (id)
);

-- Table: user_photo
CREATE TABLE user_photo (
    id int  NOT NULL,
    user_account_id int  NOT NULL,
    link text  NOT NULL,
    details text  NULL,
    time_added timestamp  NOT NULL,
    active bool  NOT NULL,
    CONSTRAINT user_photo_pk PRIMARY KEY (id)
);

-- foreign keys
-- Reference: block_user_user_account (table: block_user)
ALTER TABLE block_user ADD CONSTRAINT block_user_user_account
    FOREIGN KEY (user_account_id)
    REFERENCES user_account (id)  
    
;

-- Reference: block_user_user_account_blocked (table: block_user)
ALTER TABLE block_user ADD CONSTRAINT block_user_user_account_blocked
    FOREIGN KEY (user_account_id_blocked)
    REFERENCES user_account (id)  
    
;

-- Reference: grade_given_user_account (table: grade)
ALTER TABLE grade ADD CONSTRAINT grade_given_user_account
    FOREIGN KEY (user_account_id_given)
    REFERENCES user_account (id)  

;

-- Reference: grade_recieved_user_account (table: grade)
ALTER TABLE grade ADD CONSTRAINT grade_recieved_user_account
    FOREIGN KEY (user_account_id_received)
    REFERENCES user_account (id)  
 
;

-- Reference: interested_in_relation_relationship_type (table: interested_in_relation)
ALTER TABLE interested_in_relation ADD CONSTRAINT interested_in_relation_relationship_type
    FOREIGN KEY (relationship_type_id)
    REFERENCES relationship_type (id)  
   
;

-- Reference: interested_in_relation_user_account (table: interested_in_relation)
ALTER TABLE interested_in_relation ADD CONSTRAINT interested_in_relation_user_account
    FOREIGN KEY (user_account_id)
    REFERENCES user_account (id)  
    
;

-- Reference: interested_in_sex (table: interested_in_gender)
ALTER TABLE interested_in_gender ADD CONSTRAINT interested_in_sex
    FOREIGN KEY (gender_id)
    REFERENCES gender (id)  

;

-- Reference: interested_in_user_account (table: interested_in_gender)
ALTER TABLE interested_in_gender ADD CONSTRAINT interested_in_user_account
    FOREIGN KEY (user_account_id)
    REFERENCES user_account (id)  

;

-- Reference: message_participant (table: message)
ALTER TABLE message ADD CONSTRAINT message_participant
    FOREIGN KEY (participant_id)
    REFERENCES participant (id)  

;

-- Reference: participant_conversation (table: participant)
ALTER TABLE participant ADD CONSTRAINT participant_conversation
    FOREIGN KEY (conversation_id)
    REFERENCES conversation (id)  

;

-- Reference: participant_user_account (table: participant)
ALTER TABLE participant ADD CONSTRAINT participant_user_account
    FOREIGN KEY (user_account_id)
    REFERENCES user_account (id)  

;

-- Reference: thread_user_account (table: conversation)
ALTER TABLE conversation ADD CONSTRAINT thread_user_account
    FOREIGN KEY (user_account_id)
    REFERENCES user_account (id)  

;

-- Reference: user_account_sex (table: user_account)
ALTER TABLE user_account ADD CONSTRAINT user_account_sex
    FOREIGN KEY (gender_id)
    REFERENCES gender (id)  

;

-- Reference: user_photo_user_account (table: user_photo)
ALTER TABLE user_photo ADD CONSTRAINT user_photo_user_account
    FOREIGN KEY (user_account_id)
    REFERENCES user_account (id)  

;

-- End of file.

