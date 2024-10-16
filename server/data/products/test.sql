SELECT p.*,
    GROUP_CONCAT(DISTINCT c.name SEPARATOR ',') AS color_name,
    GROUP_CONCAT(DISTINCT t.name SEPARATOR ',') AS tag_name,
    GROUP_CONCAT(DISTINCT s.name SEPARATOR ',') AS size_name
FROM product AS p
    INNER JOIN product_color AS pc ON pc.pid = p.id
    INNER JOIN color AS c ON c.id = pc.cid
    INNER JOIN product_tag AS pt ON pt.pid = p.id
    INNER JOIN tag AS t ON t.id = pt.tid
    INNER JOIN product_size AS ps ON ps.pid = p.id
    INNER JOIN size AS s ON s.id = ps.sid
WHERE p.name LIKE '%e%'
    AND p.brand_id IN (1, 2, 4)
    AND p.cat_id IN (4, 5, 6, 10, 11, 12)
    AND c.id IN (1, 2)
    AND s.id IN (2, 3)
    AND t.id IN (1, 2, 4)
    AND p.price >= 1500
    AND p.price <= 10000
GROUP BY p.id
ORDER BY p.price ASC;
-- LIMIT 10 OFFSET 0;
-- 
-- 
-- 
SELECT *
FROM product
WHERE (name LIKE '%e%')
    AND (brand_id IN (1, 2, 4))
    AND (cat_id IN (4, 5, 6, 10, 11, 12))
    AND CONCAT(",", color, ",") REGEXP ",(1|2),"
    AND CONCAT(",", size, ",") REGEXP ",(2|3),"
    AND CONCAT(",", tag, ",") REGEXP ",(1|2|4),"
    AND price >= 1500
    AND price <= 10000
ORDER BY price ASC;
-- LIMIT 10 OFFSET 0;
-- find_in_set
SELECT *
FROM product
WHERE (name LIKE '%e%')
    AND (brand_id IN (1, 2, 4))
    AND (cat_id IN (4, 5, 6, 10, 11, 12))
    AND (
        FIND_IN_SET(1, color)
        OR FIND_IN_SET(2, color)
    )
    AND (
        FIND_IN_SET(2, size)
        OR FIND_IN_SET(3, size)
    )
    AND (
        FIND_IN_SET(1, tag)
        OR FIND_IN_SET(2, tag)
        OR FIND_IN_SET(4, tag)
    )
    AND price >= 1500
    AND price <= 10000
ORDER BY price ASC;
-- LIMIT 10 OFFSET 0;