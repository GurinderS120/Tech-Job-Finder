from os import getcwd
from os.path import join
from random import randint, choice, sample
from timeit import default_timer as timer
from faker import Faker
from faker.providers import DynamicProvider

from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

# TODO: if we use larger data values I should include batch processing
# TODO: populate the rest of the tables

SQL_FILE_NAME = "schemaDeployment.sql"
DB_NAME_FLAG = "db_name"
EMAIL_SUFIX = "@mail.sfsu.edu"

faker = Faker()

SKILLS_FILE = 'skills.txt'
DEBUG = False
JUST_VALUES = False

config = {
    # "basicDev": {
    #     "cities": 20
    #     , "jobs": 400
    #     , "roles": 60
    #     , "companies": 200
    #     , "students": 345
    #     , "numDesiredRoles": 15
    #     , "desiredRolesDeviation": 4},
    "normalDev": {},
    "prod": {
        "cities": 4,
        "jobs": 25,
        "roles": 5,
        "companies": 5,
    },
}

# NOTE: desired roles is set per student

key = 'ABCDEFGHABCDEFGH'  # Must Be 16 char for AES128

defaultUrl = 'google.com'

defaultVals = {
    "cities": [3, 5]
    , "jobs": [5, 50]
    , "roles": [5, 15]
    , "companies": [10, 20]
    , "students": [20, 30]
    , "numDesiredRoles": [1, 3]
    , "desiredRolesDeviation": [1, 2]
    , "skills": [25, 40]
    , "numDesiredJobs": [5, 15]
    , "desiredJobsDeviation": [2, 5]
    , "avgSkillsPerStud": [8, 12]
    , "skillsPerStudDeviation": [3, 5]
}

TECH_AREA_FIELDS = [["job", "techArea"], ["student", "passion"]]

ROLE_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Indentured Servitude"]
EXP_LEVELS = ["Senior Level", "Junior Level", "Entry Level", "Executive", "Tier 1", "Tier 2", "Tier 3", "Chief"]

USR = "headless"
PWD = "648headless"
SV = "localhost"

# Pulled at run time
TECH_AREAS = None
# TECH_AREAS = ["VirtualReality", "QuantumComputing", 'InternetOfThings', 'Blockchain', 'FiveG', 'CyberSecurity',
#               'EdgeComputing', 'AugmentedReality', 'AiAndMl', 'RoboticProcessAutomation']

CITIES = []


def getSkillList():
    with open(rf"{join(getcwd(), SKILLS_FILE)}", 'r') as file:
        line = 1
        elements = []
        while line:
            try:
                line = file.readline()
                elements.append(line[:-1])
            except:
                pass
        skill_provider = DynamicProvider(
            provider_name="skill",
            elements=elements,
        )
        faker.add_provider(skill_provider)
        faker.skill()


def dprint(text="", *args):
    FRONT = "VALUES "
    BACK = ";"
    if JUST_VALUES and FRONT in text and BACK in text:
        text = text[text.index(FRONT) + len(FRONT):text.index(BACK)]
    if DEBUG:
        print(text, *args)


def ensureDb(engine, workingDb):
    engine.execute(f"Drop Database IF EXISTS {workingDb};")
    engine.execute(f"Create Database {workingDb};")
    print(f"{workingDb}: wiped/created")
    engine.execute(f"use {workingDb};")
    genSchema(engine, workingDb)
    print(f"{workingDb}: Created tables")


def getJob(max_len=45):
    out = f"Technical " + faker.job().lower().replace('\'', "\\\'")
    while len(out) > max_len:
        out = f"Technical " + faker.job().lower().replace('\'', "\\\'")
    return out


def getDateTime():
    return faker.date_time()


def getSkill():
    skill = faker.skill()
    while len(skill) > 44:
        skill = faker.skill()
    return skill


def getName():
    return faker.name()


def genEmail(name):
    name = name.split(" ")
    return name[0][0].lower() + name[1] + EMAIL_SUFIX


def getText():
    return faker.text()


def encrypt(raw):
    raw = pad(raw.encode(), 16)
    cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
    return base64.b64encode(cipher.encrypt(raw)).decode("utf-8", "ignore")


def decrypt(enc):
    enc = base64.b64decode(enc)
    cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
    return unpad(cipher.decrypt(enc), 16).decode("utf-8", "ignore")


def getPass(s):
    return "p5sDx8hTIiwExBFy4nvGmg=="
    return encrypt(s)


def getCity():
    return faker.city()


def getCompanyName():
    return faker.company()


def getCompanyDesc():
    return faker.catch_phrase()


def createRandomCities(numCities):
    global CITIES
    for x in range(numCities):
        CITIES.append(getCity())


def createRandomRoleEntries(engine, workingDB, numRoles):
    for x in range(0, numRoles):
        insertString = f"INSERT INTO `{workingDB}`.`role` (`name`) VALUES ('{getJob()}');"
        dprint(insertString)
        engine.execute(insertString)
    print(f"{workingDB}: Created {numRoles} roles")
    return numRoles


def createRandomCompanyEntries(engine, workingDB, numCompanies):
    for x in range(0, numCompanies):
        name = getCompanyName()
        password = getPass(name)
        while 40 < len(name) or 40 < len(password):
            name = getCompanyName()
            password = getPass(name)
        insertString = f"INSERT INTO `{workingDB}`.`company` (`name`, `passwordHash`, `description`)" \
                       f" VALUES ('{name}', '{password}', '{getCompanyDesc()}'); "
        dprint(insertString)
        dprint(f"Actual password: {name}")
        engine.execute(insertString)
    print(f"{workingDB}: Created {numCompanies} companies")
    return numCompanies


def createRandomJobEntries(engine, workingDB, numJobs, numCompanies, numRoles):
    for x in range(0, numJobs):
        insertString = f"INSERT INTO `{workingDB}`.`job` (`title`, `type`, `techArea`, `description`, `role_id`," \
                       f" `company_id`,`salary`, `requestedHours`, `experienceLevel`, `city`, `minQualifications`," \
                       f"`preferredQualifications`, `postTimeUTC`, `contactEmail`) VALUES ('{getJob()}', '{choice(ROLE_TYPES)}'," \
                       f" '{choice(TECH_AREAS)}', '{getText()}',{randint(1, numRoles)}," \
                       f" {randint(1, numCompanies)}, {randint(0, 200000)}, {randint(0, 50)}, '{choice(EXP_LEVELS)}'," \
                       f" '{choice(CITIES)}', '{getText()}', '{getText()}', '{getDateTime()}', '{defaultUrl}');"
        dprint(insertString)
        engine.execute(insertString)
    print(f"{workingDB}: Created {numJobs} jobs")
    return numJobs


def createRandomStudents(engine, workingDB, numStudents):
    for x in range(0, numStudents):
        name = getName()
        insertString = f"INSERT INTO `{workingDB}`.`student` (`name`, `passwordHash`, `email`, `city`, `passion`) VALUES" \
                       f" ('{name}', '{getPass(name)}', '{genEmail(name)}', '{choice(CITIES)}', '{choice(TECH_AREAS)}');"
        dprint(insertString)
        engine.execute(insertString)
    print(f"{workingDB}: Created {numStudents} students")
    return numStudents


def createDesiredRoles(engine, workingDB, numStudents, numRoles, numDesiredRoles, desiredRolesDeviation):
    createdDesiredRoles = 0
    # Offsetting by1 because sql autoincrement starts with 1
    for studId in range(1, numStudents + 1):
        trueNumDesiredRoles = randint(numDesiredRoles - desiredRolesDeviation,
                                      numDesiredRoles + desiredRolesDeviation)
        if (trueNumDesiredRoles > numRoles) or (trueNumDesiredRoles < 0):
            trueNumDesiredRoles = numRoles
        selectRoles = []
        for x in range(0, trueNumDesiredRoles):
            roleId = randint(1, numRoles)
            while roleId in selectRoles:
                roleId = randint(1, numRoles)
            selectRoles.append(roleId)
            insertString = f"INSERT INTO `{workingDB}`.`desiredRole` (`student_id`, `role_id`) VALUES ('{studId}', '{roleId}');"
            dprint(insertString)
            engine.execute(insertString)
            createdDesiredRoles += 1
    print(f"{workingDB}: Created {createdDesiredRoles} desiredRoles")
    return createdDesiredRoles


def createDesiredSkills(engine, workingDB, numSkills, numJobs, numDesiredSkills, desiredSkillsDeviation):
    createdDesiredRoles = 0
    # Offsetting by1 because sql autoincrement starts with 1
    for skillId in range(1, numSkills + 1):
        trueNumDesiredRoles = randint(numDesiredSkills - desiredSkillsDeviation,
                                      numDesiredSkills + desiredSkillsDeviation)
        if (trueNumDesiredRoles > numJobs) or (trueNumDesiredRoles < 0):
            trueNumDesiredRoles = numJobs
        selectRoles = []
        for x in range(0, trueNumDesiredRoles):
            roleId = randint(1, numJobs)
            while roleId in selectRoles:
                roleId = randint(1, numJobs)
            selectRoles.append(roleId)
            insertString = f"INSERT INTO `{workingDB}`.`desiredSkill` (`skill_id`, `job_id`) VALUES ('{skillId}', '{roleId}');"
            dprint(insertString)
            engine.execute(insertString)
            createdDesiredRoles += 1
    print(f"{workingDB}: Created {createdDesiredRoles} desiredSkills")
    return createdDesiredRoles


def createStudentSkills(engine, workingDB, numStudents, numSkills, avgSkillsPerStud, skillsPerStudDeviation):
    createdStudSkills = 0
    for stud_id in range(1, numStudents+1):
        studSkills = randint(avgSkillsPerStud - skillsPerStudDeviation, avgSkillsPerStud + skillsPerStudDeviation)
        studSkills = sample(range(1, numSkills+1), studSkills)
        for skill_id in studSkills:
            insertString = f"INSERT INTO `{workingDB}`.`studSkill` (`skill_id`, `student_id`)" \
                           f" VALUES ('{skill_id}', '{stud_id}');"
            dprint(insertString)
            engine.execute(insertString)
            createdStudSkills += 1
    print(f"{workingDB}: Created {createdStudSkills} student skills")
    return createdStudSkills


def fixConfig(currConfig):
    passedKeys = currConfig.keys()
    for key in defaultVals:
        if key not in passedKeys or currConfig[key] is None:
            currConfig[key] = defaultVals[key]
        # not elif because its value can be replaced and accounted for in the previous if
        if type(currConfig[key]) is list:
            currConfig[key] = randint(currConfig[key][0], currConfig[key][1])
    return currConfig


def genSchema(engine, db_name):
    directory_path = getcwd()
    directory_path = join(directory_path, SQL_FILE_NAME)
    text_file = open(directory_path)
    data = text_file.read().replace(DB_NAME_FLAG, db_name)
    text_file.close()
    data = data.split(';')[:-1]
    session = Session(engine)
    for command in data:
        line = f"{command};"
        session.execute(line)
        session.commit()
    session.close()

    return data


def getAndValidateEnums(engine, workingDB):
    global TECH_AREAS
    enumVals = None
    for enumPair in TECH_AREA_FIELDS:
        enum_table, enum_col = enumPair
        query = f"""SELECT COLUMN_TYPE as AllPossibleEnumValues
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = '{workingDB}'
        AND
        TABLE_NAME = '{enum_table}'
        AND
        COLUMN_NAME = '{enum_col}';"""
        out = engine.execute(query)
        for row in out:
            for part in row:
                currEnums = bytes(part).decode().split("'")[1::2]
                if enumVals is None:
                    enumVals = currEnums
                elif enumVals != currEnums:
                    print(f"Enum Error: \nFrom:{enum_table}\n\t{currEnums}\nPRIOR:\n\t{enumVals}")
                    exit(1)
    TECH_AREAS = sorted(enumVals)
    dprint(f"tech areas: {TECH_AREAS}")
    print("Validated enums")
    return TECH_AREAS


def createRandomSkills(engine, workingDB, numSkills):
    for x in range(0, numSkills):
        insertString = f"INSERT INTO `{workingDB}`.`skill` (`name`) VALUES ('{getSkill()}');"
        dprint(insertString)
        engine.execute(insertString)
    print(f"{workingDB}: Created {numSkills} skills")
    return numSkills


def run():
    databaseUri = f'mysql+mysqlconnector://{USR}:{PWD}@{SV}'
    engine = create_engine(databaseUri)
    getSkillList()
    total = 0
    start = timer()
    for currDb in config:
        currConfig = config[currDb]
        currConfig = fixConfig(currConfig)
        ensureDb(engine, currDb)
        getAndValidateEnums(engine, currDb)
        createRandomCities(currConfig['cities'])
        numSkills = createRandomSkills(engine, currDb, currConfig['skills'])
        numRoles = createRandomRoleEntries(engine, currDb, currConfig['roles'])
        numCompanies = createRandomCompanyEntries(engine, currDb, currConfig['companies'])
        numJobs = createRandomJobEntries(engine, currDb, currConfig['jobs'], numCompanies, numRoles)
        numDesiredSkills = createDesiredSkills(engine, currDb, numSkills, numJobs, currConfig['numDesiredJobs'],
                                               currConfig['desiredJobsDeviation'])
        numStudents = createRandomStudents(engine, currDb, currConfig['students'])
        numDesiredRoles = createDesiredRoles(engine, currDb, numStudents, numRoles, currConfig['numDesiredRoles'],
                                             currConfig['desiredRolesDeviation'])
        studSkills = createStudentSkills(engine, currDb, numStudents, numSkills, currConfig["avgSkillsPerStud"],
                                         currConfig["skillsPerStudDeviation"])

        print(f"Created {currDb} with {numRoles} roles, {numCompanies} companies"
              f", {numJobs} jobs, {numStudents} students, {numDesiredRoles} total desired roles, {numSkills} skills, "
              f"{numDesiredSkills} skills for jobs, {studSkills} student skills")
        total += numRoles + numCompanies + numJobs + numStudents + numDesiredRoles + numSkills + numDesiredSkills + studSkills
    end = timer()
    print(f"Created {total} records for you to play with in {end - start:.2f} seconds : )")


if __name__ == "__main__":
    run()
