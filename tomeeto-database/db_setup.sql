DROP TABLE IF EXISTS url_code;
DROP TABLE IF EXISTS user_event_availability;
DROP TABLE IF EXISTS user_event;
DROP TABLE IF EXISTS account_user;

CREATE TABLE IF NOT EXISTS account_user (
    account_user_id UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- How are we hashing the passwords?
    internal BOOL NOT NULL DEFAULT FALSE, -- How are we going to set this flag?
    is_guest BOOL NOT NULL DEFAULT TRUE, -- What are the logistics behind this? (COOKIES?), maybe the user could be deleted if all their events are gone
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) COMMENT 'Accounts for users';

CREATE TABLE IF NOT EXISTS user_event (
    user_event_id UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    account_user_id UNSIGNED NOT NULL, -- What to do if user has no account?
    password_hash VARCHAR(255) NOT NULL, -- Once again how are we hashing?
    url_code VARCHAR(255) NOT NULL, -- Do we want to keep the data, but retire the url ids? There should probably be a grace period after a url id is retired before it can be used again.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Do we need this field or should we just use updated_at?
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Is this going to be how we keep track of event visitation?
) COMMENT 'User-created events';

CREATE TABLE IF NOT EXISTS user_event_availability ( -- This table feels excessive...
    user_event_id UNSIGNED NOT NULL,
    account_user_id UNSIGNED NOT NULL,
    day_column UNSIGNED NOT NULL,
    time_row UNSIGNED NOT NULL,
    PRIMARY KEY (user_event_id, account_user_id, row_id, column_id)
) COMMENT 'The grid cells a user painted as available for an event';

CREATE TABLE IF NOT EXISTS url_code (
    url_code VARCHAR(255) PRIMARY KEY,
    unlocked_at TIMESTAMP NOT NULL
) COMMENT 'URL codes for events';
