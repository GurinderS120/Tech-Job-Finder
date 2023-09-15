const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const queryFile = require("./queries");
const aesEcb = require("aes-ecb");
require("dotenv").config();

const mysqlPort = require("./connectionPool");

// Multer helps to parse incoming mulipart-form request and
// attach file to the request object
const multer = require("multer");

// Function to send an email
const sendEmail = require("./sendEmail");

// cors allow us to communicate back with our frontend.
const cors = require("cors");
// If you have installed MYSQL 8.0 you need to use mysql2 package
// instead of old mysql because of secure authentication process
// which is not provided by mysql package.
const mySql = require("mysql2");

// Express session helps us store session data
const session = require("express-session");

app.use(cors());
// We need to use express.json() middleware, since it
// allows us to extract information from the request
// sent from our frontend.
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3000;

// Used in encryption
let key = "xcdade22kao^mdq&";

// Provide details about our mysql database.
const db = mySql.createPool({
  host: "localhost",
  user: "headless",
  password: "648headless",
  database: "prod",
  port: mysqlPort,
});

// const sessionStore = new MySQLStore({}, db);

// Configure the session middleware
app.use(
  session({
    secret: aesEcb.encrypt(key, "X%^sbwj!90dn178gctdhnj"),
    resave: false,
    saveUninitialized: true,
    // store: sessionStore,
    cookies: {
      maxAge: 1000 * 60 * 24 * 60,
    },
  })
);

// We can configure the multer to store files as we want
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../resumes");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Helper functions
const isValidLen = (input, length) => {
  return input.length > 0 && input.length <= length ? true : false;
};

const isEmail = (email) => {
  const validEmail =
    /^(?=.{1,45}$)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$/;
  return validEmail.test(email);
};

const isValidTechArea = (techArea) => {
  return techArea.length <= 0 ||
    techArea === "Select Your Passion" ||
    techArea === "Select Tech Area"
    ? false
    : true;
};

const isValidPassword = (password) => {
  const validPassword = /^(?=.{8,13}$)[0-9a-zA-Z]+$/;

  if (validPassword.test(password)) {
    const encrypt = aesEcb.encrypt(key, password);

    if (encrypt.length <= 44) {
      return true;
    }
  }

  return false;
};

const validate = (data) => {
  const errors = [];

  if (data.isRec) {
    if (!isValidLen(data.companyName, 45)) {
      errors.push("cName");
    }
  } else {
    if (!isValidLen(data.candName, 45)) {
      errors.push("candNR");
    }
    if (!isValidTechArea(data.userPassion)) {
      errors.push("passionR");
    }
  }

  if (!isValidPassword(data.password)) {
    errors.push("passR");
    errors.push("cpass");
  } else {
    if (!(data.password === data.confirmPassword)) {
      errors.push("cpass");
    }
  }

  if (!isEmail(data.email)) {
    errors.push("emailR");
  }

  return errors;
};

const loginValidate = (data) => {
  const errors = [];

  if (!isValidPassword(data.password)) {
    errors.push("passR");
  }

  if (!isEmail(data.email)) {
    errors.push("emailR");
  }

  return errors;
};

const validateNewJob = (data) => {
  const errors = [];

  if (!isValidTechArea(data.techArea)) {
    errors.push("techAreaR");
  }

  if (!isValidLen(data.jobTitle, 45)) {
    errors.push("jobTitleR");
  }

  if (!isValidLen(data.jobType, 45)) {
    errors.push("jobTypeR");
  }

  if (!isValidLen(data.descript, 175)) {
    errors.push("descriptR");
  }

  if (!isEmail(data.email)) {
    errors.push("emailR");
  }

  return errors;
};

// Have Node serve the files for our built React app
// Only use this middleware when you want to deploy.
// On localhost comment it out.
app.use(express.static(path.resolve(__dirname, "../frontend/build")));

app.get("/api/get", (request, response) => {
  let searchParam = request.query.searchTerm;
  let dropdown = request.query.category;

  //Here search field input validation is done to
  //only allow upto 40 alphanumeric characters
  var letterNumber = /^[0-9a-zA-Z]+$/;
  if (searchParam.length <= 40) {
    if (searchParam.match(/^[0-9a-zA-Z]+$/)) {
      // console.log(
      //   "Search term length is less than or equal to 40 and all characters are alphanumeric"
      // );
    } else {
      // console.log("Entered search term is not alphanumeric");
    }
  } else {
    // console.log("Search term length is greater than 40 characters");
  }

  let queryName;

  //Here we finalize what query should be used based on the user input provided by frontend
  if (!request.query.searchTerm) {
    queryName = queryFile.finalQuery.emptySearch;
  } else if (request.query.searchTerm && request.query.category === "all") {
    // console.log(
    //   "User entered search parameter and have selected the dropdown as ALL"
    // );
    queryName = queryFile.finalQuery.searchString;
  } else if (request.query.category === "jobType") {
    // console.log("User selected Job type");
    queryName = queryFile.finalQuery.type_of_job;
  } else if (request.query.category === "city") {
    // console.log("User selected City");
    queryName = queryFile.finalQuery.job_city;
  } else if (request.query.category === "tech_area") {
    // console.log("User selected techArea");
    queryName = queryFile.finalQuery.tech;
  }

  // console.log("Query used:" + queryName);

  //query function to get the results from DB and send it to frontend
  db.query(queryName, [searchParam], (err, result) => {
    console.log(err);
    response.send(result);
  });
});

// The following method will be used to handle a request for getting
// techAreas stored in the database
app.get("/api/search/content", (request, response) => {
  let query =
    "SELECT COLUMN_TYPE AS allTechAreas FROM INFORMATION_SCHEMA.COLUMNS\
                WHERE TABLE_SCHEMA = 'basicDev' AND TABLE_NAME = 'job' AND COLUMN_NAME = 'techArea';";

  let getTechAreas = new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  query = "Select distinct(type) from job;";

  let getJobTypes = new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  // query =
  //   "Select j.title, j.type, j.techArea, j.contactEmail, r.name AS role, c.name as company ,s.name as desiredSkill FROM job as j INNER JOIN role as r ON r.id = j.role_id\
  //   INNER JOIN company as c ON c.id = j.company_id\
  //   INNER JOIN desiredSkill as ds ON ds.job_id = j.id\
  //   INNER JOIN skill as s ON s.id = ds.skill_id\
  //   WHERE j.id = 1;";

  query = queryFile.finalQuery.get_all_jobs;

  let getAllJobs = new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        // console.log(result);
        resolve(result);
      }
    });
  });

  // query =
  //   "Select s.name as Desired_Skills FROM job as j INNER JOIN desiredSkill\
  // as ds ON ds.job_id = j.id INNER JOIN skill as s ON s.id = ds.skill_id;";

  // let getAllDesSkills = new Promise((resolve, reject) => {
  //   db.query(query, (err, result) => {
  //     if (err) {
  //       reject(err);
  //     } else {
  //       // console.log(result);
  //       resolve(result);
  //     }
  //   });
  // });

  // Run three queries at the same time and handle their resolve results or first reject
  Promise.all([getTechAreas, getJobTypes, getAllJobs])
    .then((results) => {
      response.send({
        techAreas: results[0],
        jobTypes: results[1],
        allJobs: results[2],
      });
    })
    .catch((err) => {
      console.log(err);
      response.send();
    });
});

app.get("/api/passions", (request, response) => {
  // Query the results and return them to our frontend
  db.query(queryFile.finalQuery.get_all_tech_areas, (err, result) => {
    if (err) {
      console.log(err);
      response.send();
    } else {
      response.send(result);
    }
  });
});

// The following method will be used to handle advanced search related
// requests
app.get("/api/search/advance", (request, response) => {
  // Get the search query sent by the frontend
  const data = request.query;

  let query = queryFile.finalQuery.get_all_jobs;

  if (data.jobTitle) {
    query += `AND j.title LIKE '%${data.jobTitle}%'`;
  }

  if (data.jobType) {
    query += `AND j.type IN ('${data.jobType}')`;
  }

  if (data.techArea) {
    query += `AND j.techArea IN ('${data.techArea}')`;
  }

  if (data.jobRole) {
    query += `AND r.name LIKE '%${data.jobRole}%'`;
  }

  if (data.skills) {
    query += `INNER JOIN desiredSkill as ds ON ds.job_id = j.id\
    INNER JOIN skill as s ON s.id = ds.skill_id AND s.name LIKE '%${data.skills}%'`;
  }

  if (data.company) {
    query += `AND c.name LIKE '%${data.company}%'`;
  }

  // Query the results and return them to our frontend
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      response.send();
    } else {
      response.send(result);
    }
  });
});

// The following method will be used to get details about a job listing
app.get("/api/listing/", (request, response) => {
  // console.log(request.query.jobId);
  let query =
    "SELECT j.title AS Title, j.contactEmail AS Contact_Email, j.type AS Type, j.techArea AS Tech_Area, r.name AS Role, c.name as Company, j.description AS Description FROM job j INNER JOIN role r ON r.id = j.role_id INNER JOIN company c ON c.id = j.company_id WHERE j.id = ?;";

  let getJobInfo = new Promise((resolve, reject) => {
    db.query(query, [request.query.jobId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        // console.log(result);
        resolve(result);
      }
    });
  });

  query =
    "Select s.name as Desired_Skills FROM job as j INNER JOIN desiredSkill\
  as ds ON ds.job_id = j.id INNER JOIN skill as s ON s.id = ds.skill_id\
  WHERE j.id = ?;";

  let getDesSkills = new Promise((resolve, reject) => {
    db.query(query, [request.query.jobId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        // console.log(result);
        resolve(result);
      }
    });
  });

  // Run both queries at the same time and handle their resolve results or first reject
  Promise.all([getJobInfo, getDesSkills])
    .then((results) => {
      response.send({
        jobInfo: results[0],
        desSkills: results[1],
      });
    })
    .catch((err) => {
      console.log(err);
      response.send();
    });
});

// The following method will be used to handle requests made by users
// after they click the confirmation email
app.get("/api/users/confirmation/:email(*)", (request, response) => {
  let decrypt = aesEcb.decrypt(key, request.params.email);
  // console.log(decrypt);
  let urlComp = decrypt.match(/'(.*?)'/g);

  let id = urlComp[0].slice(1, -1);
  let isRec = urlComp[1].slice(1, -1);

  if (isRec === "false") {
    isRec = false;
  } else {
    isRec = true;
  }

  let query;
  // Set the user as confirmed
  if (isRec) {
    query = "UPDATE company SET confirmed = 1 WHERE id = ?;";
  } else {
    query = "UPDATE student SET confirmed = 1 WHERE id = ?;";
  }

  db.query(query, [id], (err, result) => {
    if (err) {
      console.log(err);
      response.send();
    } else {
      // console.log(result);
      response.send("<p>Congratulations, Your email has been verified<p>");
    }
  });
});

// We use the following method to handle users' registeration requests
app.post("/api/users/register", (request, response) => {
  // Extract data from request's body

  // Do some input validation
  const errors = validate(request.body);

  if (errors.length > 0) {
    response.send(errors);
  } else {
    request.body.password = aesEcb.encrypt(key, request.body.password);

    let query;
    let queryData = {};

    if (request.body.isRec) {
      queryData.name = request.body.companyName;
      queryData.passwordHash = request.body.password;
      queryData.email = request.body.email;
      queryData.description = request.body.candDescription;

      query =
        "INSERT INTO company (name, passwordHash, email, description)\
               VALUES (?, ?, ?, ?);";
    } else {
      queryData.name = request.body.candName;
      queryData.passwordHash = request.body.password;
      queryData.email = request.body.email;
      queryData.description = request.body.userPassion;

      query =
        "INSERT INTO student (name, passwordHash, email, passion)\
               VALUES (?, ?, ?, ?);";
    }

    // Insert new user into our database
    db.query(
      query,
      [
        queryData.name,
        queryData.passwordHash,
        queryData.email,
        queryData.description,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          response.send();
        } else {
          let insertId = result.insertId;
          // Send the user a verification email with a link, which when they click
          // we will store them as verified user
          // console.log(request.body.email);
          // console.log(request.body.isRec);

          // Encrypt the last part of the url that will contain the id of the record
          // and whether the user is candidate or recruiter
          let input = "'";
          input += insertId.toString();
          input += "'";

          input += "'";
          input += request.body.isRec.toString();
          input += "'";

          // console.log("Before encryption: %s", input);

          let encEmail = aesEcb.encrypt(key, input);

          let emailCont = {};
          const url = `${process.env.HOST}/api/users/confirmation/${encEmail}`;
          emailCont.email = request.body.email;
          emailCont.subject = "Confirmation email";
          emailCont.html = `<p>Please click this link to confirm your email: <a href="${url}">here</a></p>`;

          // console.log(emailCont.html);
          sendEmail(emailCont);

          response.send();
        }
      }
    );
  }
});

// We use the following method to handle the requests to post new job
app.post("/api/jobs/newJob", async (request, response) => {
  // Extract data from request's body

  if (!request.session.userId || !request.session.isRec) {
    response.send({ errors: [], isSuccess: false });
    return;
  }

  // Do some input validation
  const errors = validateNewJob(request.body);

  if (errors.length > 0) {
    response.send({ errors: errors, isSuccess: false });
    return;
  }

  // Select the role that matches the role specified by the company
  // and if no such role exists, create that role and put it's id into the
  // job table
  let query;

  // Check if the role already exists in the role table
  getRole = () => {
    return new Promise((resolve, reject) => {
      query = `Select id From role Where name LIKE '%${request.body.role}%';`;
      db.query(query, (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      });
    });
  };

  // Create new role and insert it into the role table, do this if the
  // previous query returns nothing
  insertNewRole = () => {
    return new Promise((resolve, reject) => {
      query = `INSERT INTO role (name) VALUES ('${request.body.role}');`;
      db.query(query, (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      });
    });
  };

  // Get the newly created role from the role table
  getNewRole = () => {
    return new Promise((resolve, reject) => {
      query = `Select id From role Where name LIKE '%${request.body.role}%';`;
      db.query(query, (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      });
    });
  };

  // Select the skill that matches the desired skill specified by the company
  // and if no such skill exists, create that skill and put it's id into the
  // desiredSkill table
  // Check if the desired skill already exists in the skill table
  getDesiredSkill = () => {
    return new Promise((resolve, reject) => {
      query = `Select id From skill Where name LIKE '%${request.body.desSkill}%';`;
      db.query(query, (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      });
    });
  };

  // Create new skill and insert it into the skill table, do this if the
  // previous query returns nothing
  insertNewSkill = () => {
    return new Promise((resolve, reject) => {
      query = "INSERT INTO skill (name) VALUES (?);";
      db.query(query, [request.body.desSkill], (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      });
    });
  };

  // Get the newly created skill from the skill table
  getNewSkill = () => {
    return new Promise((resolve, reject) => {
      query = `Select id From skill Where name LIKE '%${request.body.desSkill}%';`;
      db.query(query, (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      });
    });
  };

  // Put the skill's id along with job's id in the desiredSkill table
  insertDesSkill = (jobId, skillId) => {
    return new Promise((resolve, reject) => {
      query = "INSERT INTO desiredSkill (job_id, skill_id) VALUES (?, ?);";
      db.query(query, [jobId, skillId], (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      });
    });
  };

  // Next we will create a new job
  insertIntoJob = (roleId) => {
    return new Promise((resolve, reject) => {
      query =
        "INSERT INTO job (title, type, techArea, role_id, company_id, description, contactEmail, postTimeUTC) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
      db.query(
        query,
        [
          request.body.jobTitle,
          request.body.jobType,
          request.body.techArea,
          roleId,
          request.session.userId,
          request.body.descript,
          request.body.email,
          request.body.date,
        ],
        (err, result) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(result);
          }
        }
      );
    });
  };

  // Select the id of the new job
  getNewJob = () => {
    return new Promise((resolve, reject) => {
      query = `Select id From job Where title = (?) AND company_id = (?);`;
      db.query(
        query,
        [request.body.jobTitle, request.session.userId],
        (err, result) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(result);
          }
        }
      );
    });
  };

  try {
    let roleId = await getRole();
    if (!roleId.length) {
      await insertNewRole();
      roleId = await getNewRole();
    }

    let skill = await getDesiredSkill();
    if (!skill.length) {
      await insertNewSkill();
      skill = await getNewSkill();
    }

    await insertIntoJob(roleId[0].id);
    let newJob = await getNewJob();
    await insertDesSkill(newJob[0].id, skill[0].id);
    sendEmailNotifications(newJob[0].id);
  } catch (err) {
    console.log(err);
    response.send({ errors: errors, isSuccess: false });
    return;
  }

  response.send({ errors: errors, isSuccess: true });
});

// We use the following method to handle the requests to get jobs
// posted by a specific company
app.get("/api/jobs/postedJobs", (request, response) => {
  if (!request.session.userId) {
    response.send();
    return;
  }

  let query =
    "SELECT j.active AS Active, j.id, j.title AS Title, j.contactEmail AS Contact_Email, j.type AS Type, j.techArea AS Tech_Area, r.name AS Role, c.name as Company, j.description AS Description FROM job j INNER JOIN role r ON r.id = j.role_id INNER JOIN company c ON c.id = j.company_id WHERE c.id = ?;";

  db.query(query, [request.session.userId], (err, result) => {
    if (err) {
      console.log(err);
      response.send();
    } else {
      response.send(result);
    }
  });
});

// We use the following method to handle the requests to change jobs'
// active/inactive statuses
app.get("/api/jobs/changeStatus", (request, response) => {
  if (!request.session.userId) {
    response.send();
    return;
  }

  const query = "UPDATE job SET active = ? WHERE job.id = ?;";

  if (!request.query.activeJobsIds) {
    for (jobId of request.query.originalJobsIds) {
      db.query(query, [0, jobId], (err, result) => {});
    }
  } else {
    for (jobId of request.query.originalJobsIds) {
      if (!request.query.activeJobsIds.includes(jobId)) {
        db.query(query, [0, jobId], (err, result) => {});
      } else {
        db.query(query, [1, jobId], (err, result) => {});
      }
    }
  }

  response.send();
});

// We use the following method to handle requests to send email notifications
// to students about a job that matches their
const sendEmailNotifications = (jobId) => {
  const query =
    "SELECT s.email FROM student s INNER JOIN job j on j.id = ? AND j.techArea = s.passion;";

  let emailCont = {};
  const url = `${process.env.HOST}/advanceSearchPage`;
  emailCont.subject = "New Job Notification";
  emailCont.html = `<p>Please click this link to check the new job that might
  interest you: <a href="${url}">here</a></p>`;

  db.query(query, [jobId], (err, result) => {
    if (!err) {
      for (const email of result) {
        emailCont.email = email.email;
        sendEmail(emailCont);
      }
      return;
      // response.send();
    }
  });
};
// app.get("/api/users/notifications/:jobId", (request, response) => {

// });

// We use the following method to get all the the skills a student has and
// the skills desired by companies
app.get("/api/users/skills", (request, response) => {
  if (!request.session.userId || request.session.isRec) {
    response.send({ isSuccess: false });
    return;
  }

  let query =
    "SELECT s.name FROM skill s INNER JOIN studSkill ss ON ss.skill_id = s.id WHERE ss.student_id = ?;";

  let getStudSkills = new Promise((resolve, reject) => {
    db.query(query, [request.session.userId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  // Run both queries at the same time and handle their resolve results or first reject
  Promise.all([getStudSkills])
    .then((results) => {
      response.send({
        studSkills: results[0],
      });
    })
    .catch((err) => {
      console.log(err);
      response.send();
    });
});

// We use the following method to handle users' login requests
app.post("/api/users/login", (request, response) => {
  // Do some input validation
  const errors = loginValidate(request.body);

  // If we find some errors in the inputs we return back the errors to the
  // frontend, else we proceed with authorizing the user
  if (errors.length > 0) {
    response.send({ errors: errors });
  } else {
    request.body.password = aesEcb.encrypt(key, request.body.password);

    let query;
    let queryData = {};

    if (request.body.isRec) {
      queryData.email = request.body.email;
      queryData.password = request.body.password;
      query =
        "SELECT id from company WHERE email = ? and passwordHash = ? and confirmed = 1;";
    } else {
      queryData.email = request.body.email;
      queryData.password = request.body.password;
      query =
        "SELECT id from student WHERE email = ? and passwordHash = ? and confirmed = 1;";
    }

    // If the user exists and is confirmed then in the else block
    // the result's length will not be 0, which will indicate that the
    // user does exist and is confirmed
    db.query(query, [queryData.email, queryData.password], (err, result) => {
      if (err) {
        console.log(err);
        response.send({ errors: errors, serverErr: true, user: [] });
      } else {
        // If result's length is not zero then we know that the user exists
        if (result.length != 0) {
          request.session.userId = result[0].id;
          request.session.isRec = request.body.isRec;
        }
        // request.session.userId =
        response.send({ errors: errors, serverErr: false, user: result });
      }
    });
  }
});

// We use the following method to handle users' request to logout
app.get("/api/users/logout", (request, response) => {
  if (request.session) {
    request.session.destroy();
  }
  response.send();
});

// We use the following method to handle frontend's request to check
// whether a user is logged in or not
app.get("/api/users/authStatus", (request, response) => {
  if (request.session.userId) {
    if (request.session.isRec) {
      response.send({ isLoggedIn: true, isRecruiter: true });
      return;
    } else {
      response.send({ isLoggedIn: true, isRecruiter: false });
      return;
    }
  }

  response.send({ isLoggedIn: false });
});

// We use the following method to handle users' requests to upload a file
app.post(
  "/api/users/fileUpload",
  upload.single("file"),
  (request, response) => {
    // Store file on the file system

    // Store the path to that file in db, if that user is logged in
    // so we will use sessions for this functionality
    if (!request.session.userId) {
      response.send({ isSuccess: false });
      return;
    }

    const id = request.session.userId;

    let query = "UPDATE student SET resumePath = ? WHERE id = ?";

    db.query(query, [request.file.path, id], (err, result) => {
      if (err) {
        console.log(err);
        response.send({ isSuccess: false });
      } else {
        response.send({ isSuccess: true });
      }
    });
  }
);

// We use the following method to handle users' requests to fetch a file
app.get("/api/users/file", (request, response) => {
  const id = request.session.userId;

  let query =
    "SELECT resumePath FROM student WHERE id = ? AND resumePath IS NOT NULL";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.log(err);
      response.send();
    } else {
      if (result.length < 1) {
        response.send();
      } else {
        response.sendFile(path.resolve(__dirname, result[0].resumePath));
      }
    }
  });
});

// All other GET requests not handled before will return our React app.
// On localhost comment it out, because in development version create
// react app gets served by webpack dev server
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} \n`);
});
