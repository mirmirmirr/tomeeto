DROP TABLE IF EXISTS url_code;

DROP TABLE IF EXISTS user_event_availability;

DROP TABLE IF EXISTS user_event_participant;

DROP TABLE IF EXISTS user_event;

DROP TABLE IF EXISTS user_account;

CREATE TABLE IF NOT EXISTS user_account (
    user_account_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    is_internal BOOL NOT NULL DEFAULT FALSE,
    is_guest BOOL NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) COMMENT 'Accounts for users';

CREATE TABLE IF NOT EXISTS user_event (
    user_event_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    is_active BOOL NOT NULL DEFAULT TRUE,
    user_account_id INT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    date_type ENUM('Generic', 'Specific') NOT NULL,
    start_date DATE NOT NULL
        COMMENT 'If event is generic, will be between 0000-01-01 and 0000-01-07',
    end_date DATE NOT NULL
        COMMENT 'If event is generic, will be between 0000-01-01 and 0000-01-07',
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_account_id) REFERENCES user_account (user_account_id)
) COMMENT 'User-created events';

CREATE TABLE IF NOT EXISTS user_event_participant (
    user_event_id INT UNSIGNED NOT NULL,
    user_account_id INT UNSIGNED NOT NULL,
    nickname VARCHAR(255) NOT NULL,
    PRIMARY KEY (
        user_event_id,
        user_account_id
    ),
    FOREIGN KEY (user_event_id) REFERENCES user_event (user_event_id),
    FOREIGN KEY (user_account_id) REFERENCES user_account (user_account_id)
) COMMENT 'Participants in an event, with the name they submitted';

CREATE TABLE IF NOT EXISTS user_event_availability (
    user_event_id INT UNSIGNED NOT NULL,
    user_account_id INT UNSIGNED NOT NULL,
    date_column DATE NOT NULL,
    time_row TIME NOT NULL,
    is_available BOOL NOT NULL,
    PRIMARY KEY (
        user_event_id,
        user_account_id,
        date_column,
        time_row
    ),
    FOREIGN KEY (user_event_id) REFERENCES user_event (user_event_id),
    FOREIGN KEY (user_account_id) REFERENCES user_account (user_account_id)
) COMMENT 'The grid cells a user painted as available for an event';

CREATE TABLE IF NOT EXISTS url_code (
    url_code VARCHAR(255) PRIMARY KEY,
    user_event_id INT UNSIGNED,
    unlocked_at TIMESTAMP,
    FOREIGN KEY (user_event_id) REFERENCES user_event (user_event_id)
) COMMENT 'URL codes for events';