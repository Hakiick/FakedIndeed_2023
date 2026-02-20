-- FakedIndeed Seed Data
-- Fake data for demonstration purposes

-- Users (passwords are bcrypt hashes of "password123")
INSERT INTO users (email, password, userType, name, lastname, phone, website) VALUES
('admin@fakedindeed.com', '$2a$12$LJ3m4ys3Lk0TSwHiPjVL4OtM6v3pyNnzYGMa1HhHGKxsMEQpHPgpO', 'admin', 'Admin', 'System', '+33 1 00 00 00 00', 'https://fakedindeed.com'),
('john.doe@gmail.com', '$2a$12$LJ3m4ys3Lk0TSwHiPjVL4OtM6v3pyNnzYGMa1HhHGKxsMEQpHPgpO', 'individual', 'John', 'Doe', '+33 6 12 34 56 78', 'https://johndoe.dev'),
('jane.smith@gmail.com', '$2a$12$LJ3m4ys3Lk0TSwHiPjVL4OtM6v3pyNnzYGMa1HhHGKxsMEQpHPgpO', 'individual', 'Jane', 'Smith', '+33 6 98 76 54 32', 'https://janesmith.io'),
('recruiter@techcorp.com', '$2a$12$LJ3m4ys3Lk0TSwHiPjVL4OtM6v3pyNnzYGMa1HhHGKxsMEQpHPgpO', 'company', 'Marie', 'Dupont', '+33 1 45 67 89 10', 'https://techcorp.com'),
('hr@startupflow.io', '$2a$12$LJ3m4ys3Lk0TSwHiPjVL4OtM6v3pyNnzYGMa1HhHGKxsMEQpHPgpO', 'company', 'Lucas', 'Martin', '+33 1 23 45 67 89', 'https://startupflow.io'),
('contact@datawise.fr', '$2a$12$LJ3m4ys3Lk0TSwHiPjVL4OtM6v3pyNnzYGMa1HhHGKxsMEQpHPgpO', 'company', 'Sophie', 'Bernard', '+33 1 11 22 33 44', 'https://datawise.fr');

-- Companies
INSERT INTO company (name, emails) VALUES
('TechCorp', '["recruiter@techcorp.com","hr@techcorp.com"]'),
('StartupFlow', '["hr@startupflow.io","jobs@startupflow.io"]'),
('DataWise', '["contact@datawise.fr","recrutement@datawise.fr"]'),
('CloudNine Solutions', '["careers@cloudnine.com"]'),
('GreenTech Innovations', '["rh@greentech-innov.fr"]');

-- Job Ads
INSERT INTO ads (title, description, jobTypes, minSalary, maxSalary, advantages, company, location, positionLocation) VALUES
('Developpeur Full-Stack Senior', 'Nous recherchons un developpeur full-stack senior pour rejoindre notre equipe produit. Vous travaillerez sur notre plateforme SaaS B2B en Next.js et Node.js. Experience requise en React, TypeScript et PostgreSQL.', '["CDI"]', 55000, 70000, 'Tickets restaurant, Mutuelle premium, RTT, Teletravail 3j/semaine, Budget formation', 'TechCorp', 'Paris, France', 'Semi-Remote'),
('Frontend Developer React', 'Rejoignez notre equipe frontend pour construire des interfaces utilisateur modernes et performantes. Stack: React 18, TypeScript, Tailwind CSS, Storybook.', '["CDI","CDD"]', 40000, 55000, 'Mutuelle, Tickets restaurant, Teletravail flexible', 'StartupFlow', 'Lyon, France', 'Full-Remote'),
('Data Engineer', 'Mission: concevoir et maintenir nos pipelines de donnees. Technologies: Python, Apache Spark, Airflow, BigQuery. Environnement data-driven avec equipe de 5 data engineers.', '["CDI"]', 50000, 65000, 'Interessement, PEE, Teletravail 2j/semaine, Conferences sponsorisees', 'DataWise', 'Bordeaux, France', 'Semi-Remote'),
('DevOps Engineer', 'Automatisez notre infrastructure cloud. Kubernetes, Terraform, GitHub Actions, AWS/Azure. Vous serez responsable du CI/CD et du monitoring de nos services en production.', '["CDI"]', 48000, 62000, 'Full remote, Materiel au choix, Budget formation 2000 euros/an', 'CloudNine Solutions', 'Remote, France', 'Full-Remote'),
('Stagiaire Developpeur Backend', 'Stage de 6 mois en developpement backend Node.js/Express. Vous participerez au developpement de nos APIs REST et a la mise en place de tests automatises.', '["Stage"]', 800, 1200, 'Tickets restaurant, Accompagnement mentor senior', 'TechCorp', 'Paris, France', 'On-Site'),
('Product Designer UX/UI', 'Concevez des experiences utilisateur exceptionnelles pour notre application mobile et web. Figma, Design System, User Research, A/B Testing.', '["CDI"]', 42000, 58000, 'Mutuelle famille, Teletravail 4j/semaine, Semaine de 4 jours', 'StartupFlow', 'Nantes, France', 'Full-Remote'),
('Ingenieur Machine Learning', 'Developpez des modeles ML pour notre plateforme d analyse predictive. Python, TensorFlow, scikit-learn, MLflow. Publications encouragees.', '["CDI"]', 55000, 75000, 'Budget recherche, Conferences, Horaires flexibles, Salle de sport', 'DataWise', 'Paris, France', 'Semi-Remote'),
('Chef de Projet Technique', 'Pilotez nos projets de transformation digitale. Management d equipe de 8 developpeurs, methodologie Agile/Scrum, relation client.', '["CDI"]', 50000, 65000, 'Vehicule de fonction, Mutuelle premium, Interessement', 'GreenTech Innovations', 'Strasbourg, France', 'On-Site');

-- Applications
INSERT INTO apply (ad_id, company_name, name, lastname, email, phone, motivations, website, cv) VALUES
(1, 'TechCorp', 'John', 'Doe', 'john.doe@gmail.com', '+33 6 12 34 56 78', 'Passionne par le developpement full-stack, je souhaite rejoindre une equipe dynamique et contribuer a des projets innovants. Mon experience de 5 ans en Next.js correspond parfaitement au poste.', 'https://johndoe.dev', 'cv_john_doe.pdf'),
(2, 'StartupFlow', 'Jane', 'Smith', 'jane.smith@gmail.com', '+33 6 98 76 54 32', 'Specialisee en React et TypeScript, je suis motivee par l opportunite de travailler sur des interfaces modernes dans un environnement startup agile.', 'https://janesmith.io', 'cv_jane_smith.pdf'),
(1, 'TechCorp', 'Pierre', 'Leroy', 'pierre.leroy@outlook.com', '+33 6 55 44 33 22', 'Developpeur senior avec 7 ans d experience, je cherche un nouveau defi technique. Votre stack me correspond parfaitement.', 'https://pierreleroy.fr', 'cv_pierre_leroy.pdf'),
(3, 'DataWise', 'Emma', 'Garcia', 'emma.garcia@gmail.com', '+33 6 77 88 99 00', 'Data engineer certifiee GCP, je souhaite evoluer vers un environnement BigQuery et contribuer a vos pipelines de donnees.', '', 'cv_emma_garcia.pdf'),
(4, 'CloudNine Solutions', 'Thomas', 'Petit', 'thomas.petit@proton.me', '+33 6 11 22 33 44', 'Passionne de DevOps et d infrastructure as code. Certifie AWS et Azure, j automatise tout ce qui peut l etre.', 'https://thomaspetit.dev', 'cv_thomas_petit.pdf');
