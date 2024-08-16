CREATE TABLE public."Directors"
(
    "DirectorID" serial,
    "Name" character varying(50) NOT NULL,
    "Bio" character varying(1000) NOT NULL,
    "Birth Column" date,
    "Death Year" date,
    PRIMARY KEY ("DirectorID")
);

ALTER TABLE IF EXISTS public."Directors"
    OWNER to postgres;

CREATE TABLE public."Genres"
(
    "GenreID" serial,
    "Name" character varying(50) NOT NULL,
    "Description" character varying(1000),
    PRIMARY KEY ("GenreID")
);

ALTER TABLE IF EXISTS public."Genres"
    OWNER to postgres;

CREATE TABLE public."Movies"
(
    "MovieID" serial,
    "Title" character varying(50) NOT NULL,
    "Description" character varying(1000),
    "DirectorID" integer NOT NULL,
    "GenreID" integer NOT NULL,
    "Image URL" character varying(300),
    "Featured" boolean,
    PRIMARY KEY ("MovieID"),
    CONSTRAINT "DirectorKey" FOREIGN KEY ("DirectorID")
        REFERENCES public."Directors" ("DirectorID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "GenreKey" FOREIGN KEY ("GenreID")
        REFERENCES public."Genres" ("GenreID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE TABLE public."Users"
(
    "UserID" serial,
    "Username" character varying(50) NOT NULL,
    "Password" character varying(50) NOT NULL,
    "Email" character varying(50) NOT NULL,
    "Birthday" date,
    PRIMARY KEY ("UserID")
);

ALTER TABLE IF EXISTS public."Users"
    OWNER to postgres;


CREATE TABLE public."Users-Movies"
(
    "UserMovieID" serial,
    "UserID" integer,
    "MovieID" integer,
    PRIMARY KEY ("UserMovieID"),
    CONSTRAINT "UserKey" FOREIGN KEY ("UserID")
        REFERENCES public."Users" ("UserID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "MovieKey" FOREIGN KEY ("MovieID")
        REFERENCES public."Movies" ("MovieID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE IF EXISTS public."Users-Movies"
    OWNER to postgres;


-- Reset (truncate) whole tables
TRUNCATE TABLE public."Directors" RESTART IDENTITY CASCADE;
TRUNCATE TABLE public."Genres" RESTART IDENTITY CASCADE;
TRUNCATE TABLE public."Users" RESTART IDENTITY CASCADE;
TRUNCATE TABLE public."Movies" RESTART IDENTITY CASCADE;
TRUNCATE TABLE public."Users-Movies" RESTART IDENTITY CASCADE;


-- Insert into Directors table
INSERT INTO public."Directors" ("Name", "Bio", "Birth Column", "Death Year")
VALUES
('Christopher Nolan', 'English-American film director, producer, and screenwriter', '1970-07-30', NULL),
('Quentin Tarantino', 'American film director, writer, and actor', '1963-03-27', NULL),
('Steven Spielberg', 'American film director, producer, and screenwriter', '1946-12-18', NULL);

-- Insert into Genres table
INSERT INTO public."Genres" ("Name", "Description")
VALUES
('Action', 'Genre featuring intense physical activity, stunts, and chases'),
('Drama', 'Genre focused on character-driven stories and emotional themes'),
('Science Fiction', 'Genre dealing with futuristic concepts and advanced technology');

-- Insert into Movies table
INSERT INTO public."Movies" ("Title", "Description", "DirectorID", "GenreID", "Image URL", "Featured")
VALUES
('Inception', 'A mind-bending thriller about dreams within dreams', 1, 3, 'https://example.com/inception.jpg', TRUE),
('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival', 1, 3, 'https://example.com/interstellar.jpg', FALSE),
('Pulp Fiction', 'A crime drama with interweaving stories', 2, 2, 'https://example.com/pulpfiction.jpg', TRUE),
('Django Unchained', 'A freed slave sets out to rescue his wife from a brutal plantation owner', 2, 1, 'https://example.com/django.jpg', FALSE),
('Jurassic Park', 'A science fiction adventure about a theme park with cloned dinosaurs', 3, 3, 'https://example.com/jurassicpark.jpg', TRUE),
('Schindler''s List', 'A historical drama about a man who saved thousands during the Holocaust', 3, 2, 'https://example.com/schindlerslist.jpg', FALSE),
('The Dark Knight', 'A crime thriller where Batman faces off against the Joker', 1, 1, 'https://example.com/darkknight.jpg', TRUE),
('Kill Bill: Vol. 1', 'A woman seeks revenge on her former assassins', 2, 1, 'https://example.com/killbill1.jpg', TRUE),
('Minority Report', 'In a future where crimes are predicted, a cop is accused of a future murder', 3, 3, 'https://example.com/minorityreport.jpg', FALSE),
('E.T. the Extra-Terrestrial', 'A young boy befriends a gentle alien stranded on Earth', 3, 2, 'https://example.com/et.jpg', TRUE);

-- Insert into Users table
INSERT INTO public."Users" ("Username", "Password", "Email", "Birthday")
VALUES
('john_doe', 'password123', 'john@example.com', '1990-05-15'),
('jane_smith', 'mysecurepassword', 'jane@example.com', '1985-11-20'),
('michael_brown', 'password456', 'michael@example.com', '1992-02-10');

-- Insert into Users-Movies table
INSERT INTO public."Users-Movies" ("UserID", "MovieID")
VALUES
(1, 1),
(2, 3),
(3, 5),
(1, 2),
(2, 6),
(3, 4);


-- Select genre
SELECT "GenreID"
FROM public."Genres"
WHERE "Name" = 'Science Fiction';

-- select movie based on genre
SELECT *
FROM public."Movies"
WHERE "GenreID" = (
    SELECT "GenreID"
    FROM public."Genres"
    WHERE "Name" = 'Science Fiction'
);

--- update the email address of a single user, by name
UPDATE public."Users"
SET "Email" = 'johndoe@gmail.com'
WHERE "Username" = 'john_doe';

-- delete a certain movie
DELETE FROM public."Movies"
WHERE "Title" = 'Kill Bill: Vol. 1';







