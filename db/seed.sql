USE employees_db;

INSERT INTO Department (name)
VALUES ('Project Management'),
       ('Engineering'),
       ('Finance'),
       ('Legal');

INSERT INTO Role 
    (title, salary,department_id)
VALUES 
    ('PMO Manager', 110000, 1),
    ('Technical Planner II', 75000, 1),

    ('Mechanical Engineer', 120000, 2),
    ('Software Engineer', 130000, 2),

    ('Finance Manager', 150000, 3),
    ('Financial Analyst I', 115000,3),

    ('Legal and Contracts Lead', 180000,4),
    ('Ethics Representative', 165000, 4);

INSERT INTO Employee 
    (first_name,last_name,role_id, manager_id)
VALUES 
    ('Happy', 'Gilmore', 1, NULL),
    ('Donald', 'Duck', 2, 1),
    ('Jim', 'Bo', 3, NULL),
    ('Derek', 'Jeter', 4, 3),
    ('Cooper', 'Kupp', 5, NULL),
    ('Jennifer', 'Teal', 6, 5),
    ('Pat', 'Hall', 7, NULL),
    ('Jakob', 'Marley', 8, 7);