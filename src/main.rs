use std::vec;

use mysql::*;
use mysql::prelude::*;
use rocket::http::Status;
use rocket::serde::{Deserialize, Serialize, json::Json};

mod tables;

#[macro_use] extern crate rocket;

fn db_connect() -> PooledConn {
    let username = env!("DB_USERNAME", "failed to fetch username");
    let password = env!("DB_PASSWORD", "failed to fetch password");
    let db_name = env!("DB_NAME", "failed to fetch database name");
    let opts = OptsBuilder::new()
        .user(Some(username))
        .pass(Some(password))
        .db_name(Some(db_name));
    let pool = Pool::new(opts).unwrap();
    pool.get_conn().unwrap()
}
#[derive(Debug, PartialEq, Eq, Serialize, Clone)]
#[serde(crate = "rocket::serde")]
struct JsonResponse {
    status: String,
}


#[get("/")]
fn index() -> &'static str {
    "ranked scheduler API"
}

// participants
#[get("/participant/<id>")]
fn get_participant(id: i32) -> Json<tables::Participants> {
    let response = db_connect().query_map(
        format!("SELECT * FROM participants WHERE id = {} LIMIT 1;", id),
        |(id, name)| {
            tables::Participants{ id, name }
        }
    ).unwrap();
    Json(response[0].clone())
}

#[post("/participant/<name>")]
fn new_participant(name: String) -> Status {
    match db_connect().query_drop(format!("INSERT INTO participants(name) VALUES ('{}');", name)) {
        Ok(()) => Status::Ok,
        Err(_) => Status::InternalServerError,
    }
}

// availability
#[derive(Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
struct AvailabilityJson {
    p: i32,
    s: i32,
    e: i32
}
#[post("/availability/<participant_id>", data="<details>")]
fn new_availibility(participant_id: i32, details: Json<Vec<Vec<AvailabilityJson>>>) -> Json<JsonResponse> {
    let mut conn = db_connect();
    let _ = conn.query_drop(format!("DELETE FROM availability WHERE participant_id = {};", participant_id));
    let mut values: String = String::new();
    for (day_index, day) in details.iter().enumerate() {
        for point in day.iter() {
            let tmp = format!("({}, {}, {}, {}, {})", participant_id, day_index, point.p, point.s, point.e);
            if values == "" {
                values = format!("{}", tmp);
            } else {
                values = format!("{}, {}", values, tmp);
            }
        }
    }
    match conn.query_drop(format!("INSERT INTO availability (participant_id, day, priority, start, end) VALUES {};", values)) {
        Ok(()) => Json(JsonResponse {status: String::from("Ok")}),
        Err(_) => Json(JsonResponse {status: String::from("Err")}),
    }
}

#[get("/availability/<participant_id>")]
fn get_availability(participant_id: i32) -> Json<Vec<Vec<AvailabilityJson>>> {
    let response = db_connect().query_map(
        format!("SELECT * FROM availability WHERE participant_id = {};", participant_id),
        |(id, participant_id, priority, start, end, day)| {
            tables::Availability { id, participant_id, priority, start, end, day }
        }
    ).unwrap();
    let mut useable_response: Vec<Vec<AvailabilityJson>> = vec![vec![],vec![],vec![],vec![],vec![],vec![],vec![]];
    response.iter().for_each(|entry| {
        useable_response[entry.day].append(& mut vec![AvailabilityJson {p: entry.priority, s: entry.start, e: entry.end}]);
    });
    Json(useable_response)
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct MeetingsJson {
    g: Vec<tables::Meeting>,
    o: Vec<tables::Meeting>,
    p: Vec<tables::Meeting>,
}
#[get("/meeting/<participant_id>")]
fn get_meetings(participant_id: i32) -> Json<MeetingsJson> {
    let general = db_connect().query_map(
        format!("
        SELECT * FROM meeting as m
            WHERE m.ID NOT IN (
            SELECT o.meeting_id FROM ownership AS o
            WHERE o.participant_id = {}
            GROUP BY meeting_id
        ) AND m.ID NOT IN (
            SELECT p.meeting_id FROM participation AS p
            WHERE p.participant_id = {}
            GROUP BY meeting_id
        );", participant_id, participant_id),
        |(id, name, length)| {
            tables::Meeting { id, name, length }
        }
    ).unwrap();
    let owner = db_connect().query_map(
        format!("
        SELECT * FROM meeting as m
            WHERE m.ID IN (
            SELECT o.meeting_id FROM ownership AS o
            WHERE o.participant_id = {}
            GROUP BY meeting_id
        ) AND m.ID NOT IN (
            SELECT p.meeting_id FROM participation AS p
            WHERE p.participant_id = {}
            GROUP BY meeting_id
        );", participant_id, participant_id),
        |(id, name, length)| {
            tables::Meeting { id, name, length }
        }
    ).unwrap();
    let participating = db_connect().query_map(
        format!("
        SELECT * FROM meeting as m
            WHERE m.ID NOT IN (
            SELECT o.meeting_id FROM ownership AS o
            WHERE o.participant_id = {}
            GROUP BY meeting_id
        ) AND m.ID IN (
            SELECT p.meeting_id FROM participation AS p
            WHERE p.participant_id = {}
            GROUP BY meeting_id
        );", participant_id, participant_id),
        |(id, name, length)| {
            tables::Meeting { id, name, length }
        }
    ).unwrap();
    Json(MeetingsJson { g: general, o: owner, p: participating })
}

#[derive(Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
struct NewMeetingJson {
    name: String,
    length: i32
}
#[post("/meeting/<participant_id>", data="<details>")]
    fn new_meeting(participant_id: i32, details: Json<NewMeetingJson>) -> Json<JsonResponse> {
        let mut conn = db_connect();
        let _ = conn.query_drop(format!("INSERT INTO meeting (name, length) VALUES ('{}', {});", details.name, details.length)).unwrap();
        let meeting_id: i32 = conn.query_first(format!("SELECT ID FROM meeting WHERE name = '{}'", details.name)).unwrap().unwrap();
        match conn.query_drop(format!("INSERT INTO ownership (meeting_id, participant_id) VALUES ({}, {});", meeting_id, participant_id)) {
            Ok(()) => Json(JsonResponse {status: String::from("Ok")}),
            Err(_) => Json(JsonResponse {status: String::from("Err")}),
        }
    }


// login
#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
struct LoginJson {
    name: String,
}
#[post("/login", data="<details>")]
fn login(details: Json<LoginJson>) -> Json<tables::Participants> {
    // check if user is in database
    let response = match db_connect().query_map(
        format!("SELECT * FROM participants WHERE name = '{}' LIMIT 1;", details.name),
        |( id, name )| {
            tables::Participants { id, name }
        }
    ) {
        Ok(mut r) =>
            // if user is in databse return their data
            if r.len() != 0 {
                r.remove(0)
            // otherwise create user
            } else {
                let mut conn = db_connect();
                // create user
                match conn.query_drop(format!("INSERT INTO participants(name) VALUES ('{}');", details.name)) {
                    Ok(()) => {}
                    Err(_) => {panic!("Could not create user in database")}
                }
                // select user just created
                conn.query_map(
                    format!("SELECT * FROM participants WHERE name = '{}';", details.name),
                    |( id, name )| {
                        tables::Participants { id, name }
                    }
                ).unwrap().remove(0)
            }
        Err(_) => {
            panic!("Could not contact database")
        }
    };
    Json(response.clone())
}


#[launch]
fn rocket() -> _ {
    
    rocket::build().mount("/", routes![index, new_participant, get_participant, new_availibility, get_availability, login, new_meeting, get_meetings])
}
