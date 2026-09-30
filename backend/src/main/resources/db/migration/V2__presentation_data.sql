INSERT INTO users(id,username,display_name,bio) VALUES
    (1,'alex','Alex Morgan','Software, photography and small side projects.'),
    (2,'sam','Sam Taylor','Building useful things together.'),
    (3,'jordan','Jordan Lee','Design and architecture.');
INSERT INTO content_categories(id,key) VALUES (1,'photography'),(2,'articles');
INSERT INTO contents(id,author_id,category_id,title,description,content_type,status,visibility,like_count,comment_count,published_at)
    SELECT x,1,1,'Photo study ' || x,'A public example for the profile grid.','POST','PUBLISHED','PUBLIC',x,0,CURRENT_TIMESTAMP
    FROM SYSTEM_RANGE(1,14);
INSERT INTO contents(id,author_id,category_id,title,description,content_type,status,visibility,published_at) VALUES
    (15,1,2,'Private notes','Only the author sees this entry.','ARTICLE','PUBLISHED','PRIVATE',CURRENT_TIMESTAMP),
    (16,2,2,'Readable architecture','A saved article by another author.','ARTICLE','PUBLISHED','PUBLIC',CURRENT_TIMESTAMP),
    (17,1,2,'Work in progress','Drafts are excluded from published profile contents.','ARTICLE','DRAFT','PRIVATE',NULL);
INSERT INTO user_interactions(source_user_id,target_user_id,type) VALUES (2,1,'FOLLOW'),(3,1,'FOLLOW'),(1,2,'FOLLOW');
INSERT INTO content_interactions(content_id,user_id,type) VALUES (16,1,'SAVE');
UPDATE users SET avatar_object_key='alex.png' WHERE id=1;
INSERT INTO content_media(id,content_id,type,storage_bucket,storage_object_key) VALUES
    (1,14,'IMAGE','content','sample.png'),
    (2,15,'IMAGE','content','sample.png');
