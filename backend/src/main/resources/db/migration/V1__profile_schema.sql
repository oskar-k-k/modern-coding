CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    display_name VARCHAR(60),
    bio VARCHAR(500),
    avatar_object_key VARCHAR(255),
    account_type VARCHAR(20) NOT NULL DEFAULT 'STANDARD',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','SUSPENDED','DELETED'))
);
CREATE TABLE content_categories (id BIGINT PRIMARY KEY, key VARCHAR(60) NOT NULL UNIQUE);
CREATE TABLE contents (
    id BIGINT PRIMARY KEY,
    author_id BIGINT NOT NULL REFERENCES users(id),
    category_id BIGINT NOT NULL REFERENCES content_categories(id),
    title VARCHAR(200),
    description VARCHAR(2000),
    content_type VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('DRAFT','PUBLISHED','DELETED')),
    visibility VARCHAR(20) NOT NULL CHECK (visibility IN ('PUBLIC','PRIVATE')),
    like_count BIGINT NOT NULL DEFAULT 0 CHECK (like_count >= 0),
    comment_count BIGINT NOT NULL DEFAULT 0 CHECK (comment_count >= 0),
    published_at TIMESTAMP WITH TIME ZONE,
    CHECK (status <> 'PUBLISHED' OR published_at IS NOT NULL)
);
CREATE INDEX contents_author_cursor ON contents(author_id,id);
CREATE TABLE user_interactions (
    source_user_id BIGINT NOT NULL REFERENCES users(id),
    target_user_id BIGINT NOT NULL REFERENCES users(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('FOLLOW','BLOCK','RESTRICT','MUTE')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (source_user_id,target_user_id,type),
    CHECK (source_user_id <> target_user_id)
);
CREATE INDEX interactions_target ON user_interactions(target_user_id,type);
CREATE TABLE content_interactions (
    content_id BIGINT NOT NULL REFERENCES contents(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('LIKE','SAVE')),
    PRIMARY KEY (content_id,user_id,type)
);
CREATE TABLE content_media (
    id BIGINT PRIMARY KEY,
    content_id BIGINT NOT NULL REFERENCES contents(id),
    type VARCHAR(20) NOT NULL CHECK (type = 'IMAGE'),
    sort_order INTEGER NOT NULL DEFAULT 0,
    storage_bucket VARCHAR(63) NOT NULL,
    storage_object_key VARCHAR(255) NOT NULL
);
