CREATE TABLE product_qs AS (
    SELECT p.*,
        GROUP_CONCAT(
            DISTINCT c.id
            ORDER BY c.id ASC SEPARATOR ','
        ) AS color_id,
        GROUP_CONCAT(
            DISTINCT t.id
            ORDER BY t.id ASC SEPARATOR ','
        ) AS tag_id,
        GROUP_CONCAT(
            DISTINCT s.id
            ORDER BY s.id ASC SEPARATOR ','
        ) AS size_id,
        GROUP_CONCAT(
            DISTINCT c.name
            ORDER BY c.id ASC SEPARATOR ','
        ) AS color_name,
        GROUP_CONCAT(
            DISTINCT t.name
            ORDER BY t.id ASC SEPARATOR ','
        ) AS tag_name,
        GROUP_CONCAT(
            DISTINCT s.name
            ORDER BY s.id ASC SEPARATOR ','
        ) AS size_name
    FROM product AS p
        INNER JOIN product_color AS pc ON pc.pid = p.id
        INNER JOIN color c ON c.id = pc.cid
        INNER JOIN product_size AS ps ON ps.pid = p.id
        INNER JOIN size AS s ON s.id = ps.sid
        INNER JOIN product_tag AS pt ON pt.pid = p.id
        INNER JOIN tag t ON t.id = pt.tid
    GROUP BY p.id
    ORDER BY p.id
);
ALTER TABLE product_qs
ADD PRIMARY KEY(id);