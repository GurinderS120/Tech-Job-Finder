//Saving the SELECT queries into the variables to use them as parameter for query function
let finalQuery = {
  emptySearch:
    "SELECT c.name AS COMPANY_NAME, j.title AS JOB_TITLE, j.type AS JOB_TYPE, r.name AS JOB_ROLE, j.techArea AS TECH_AREA, j.description AS JOB_DESCRIPTION, j.salary AS SALARY, j.requestedHours AS REQUESTED_HOURS, j.city AS JOB_LOCATION, j.minQualifications AS MIMIMUM_QUALIFICATIONS, j.preferredQualifications AS PREFERRED_QUALIFICATIONS\
                   FROM company c\
                   INNER JOIN job j ON c.id = j.company_id\
                   INNER JOIN role r ON j.role_id = r.id;",

  searchString:
    "SELECT c.name AS COMPANY_NAME, j.title AS JOB_TITLE, j.type AS JOB_TYPE, r.name AS JOB_ROLE, j.techArea AS TECH_AREA, j.description AS JOB_DESCRIPTION, j.salary AS SALARY, j.requestedHours AS REQUESTED_HOURS, j.city AS JOB_LOCATION, j.minQualifications AS MIMIMUM_QUALIFICATIONS, j.preferredQualifications AS PREFERRED_QUALIFICATIONS\
                    FROM company c\
                    INNER JOIN job j ON c.id = j.company_id\
                    INNER JOIN role r ON j.role_id = r.id WHERE j.title LIKE ?;",

  tech: "SELECT c.name AS COMPANY_NAME, j.title AS JOB_TITLE, j.type AS JOB_TYPE, r.name AS JOB_ROLE, j.techArea AS TECH_AREA, j.description AS JOB_DESCRIPTION, j.salary AS SALARY, j.requestedHours AS REQUESTED_HOURS, j.city AS JOB_LOCATION, j.minQualifications AS MIMIMUM_QUALIFICATIONS, j.preferredQualifications AS PREFERRED_QUALIFICATIONS\
            FROM company c\
            INNER JOIN job j ON c.id = j.company_id\
            INNER JOIN role r ON j.role_id = r.id WHERE j.techArea = ?;",

  job_city:
    "SELECT c.name AS COMPANY_NAME, j.title AS JOB_TITLE, j.type AS JOB_TYPE, r.name AS JOB_ROLE, j.techArea AS TECH_AREA, j.description AS JOB_DESCRIPTION, j.salary AS SALARY, j.requestedHours AS REQUESTED_HOURS, j.city AS JOB_LOCATION, j.minQualifications AS MIMIMUM_QUALIFICATIONS, j.preferredQualifications AS PREFERRED_QUALIFICATIONS\
                FROM company c\
                INNER JOIN job j ON c.id = j.company_id\
                INNER JOIN role r ON j.role_id = r.id WHERE j.city LIKE ?;",

  type_of_job:
    "SELECT c.name AS COMPANY_NAME, j.title AS JOB_TITLE, j.type AS JOB_TYPE, r.name AS JOB_ROLE, j.techArea AS TECH_AREA, j.description AS JOB_DESCRIPTION, j.salary AS SALARY, j.requestedHours AS REQUESTED_HOURS, j.city AS JOB_LOCATION, j.minQualifications AS MIMIMUM_QUALIFICATIONS, j.preferredQualifications AS PREFERRED_QUALIFICATIONS\
                   FROM company c \
                   INNER JOIN job j ON c.id = j.company_id\
                   INNER JOIN role r ON j.role_id = r.id WHERE j.type LIKE ?;",

  get_all_tech_areas:
    "SELECT COLUMN_TYPE AS allTechAreas FROM INFORMATION_SCHEMA.COLUMNS\
                WHERE TABLE_SCHEMA = 'basicDev' AND TABLE_NAME = 'job' AND COLUMN_NAME = 'techArea';",

  get_all_jobs:
    "SELECT j.id, j.title AS Title, j.type AS Type, j.techArea AS Tech_Area, r.name AS Role, c.name as Company FROM job j INNER JOIN role r ON r.id = j.role_id INNER JOIN company c ON c.id = j.company_id AND j.active = 1 ",
};

module.exports = { finalQuery };
