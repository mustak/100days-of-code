SELECT 
    restaurants.name,
    addresses.city,
    types.name AS type,
    reviews.rating
FROM
    restaurants
        INNER JOIN
    addresses ON restaurants.address_id = addresses.id
        INNER JOIN
    types ON restaurants.type_id = types.id
        INNER JOIN
    reviews ON reviews.restaurant_id = restaurants.id
WHERE
    reviews.rating > 3
ORDER BY reviews.rating DESC
