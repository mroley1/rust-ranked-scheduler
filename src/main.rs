use std::vec;

use mysql::*;
use mysql::prelude::*;
use rocket::http::Status;
use rocket::serde::{Deserialize, json::Json};

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
#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
struct AvailabilityJson {
    priority: i32,
    start: i32,
    end: i32,
}
#[post("/availability/<participant_id>", data="<details>")]
fn new_availibility(participant_id: i32, details: Json<AvailabilityJson>) -> Status {
    println!("{}", details.priority);
    match db_connect().query_drop(format!("INSERT INTO availability(participant_id, priority, start, end) VALUES ({}, {}, {}, {});", participant_id, details.priority, details.start, details.end)) {
        Ok(()) => Status::Ok,
        Err(_) => Status::InternalServerError,
    }
}

#[get("/availability/<id>")]
    fn get_availability(id: i32) -> Json<Vec<tables::Availability>> {
        let response = db_connect().query_map(
            format!("SELECT * FROM availability WHERE participant_id = {};", id),
            |(id, participant_id, priority, start, end)| {
                tables::Availability { id, participant_id, priority, start, end }
            }
        ).unwrap();
        Json(response.clone())
    }


#[launch]
fn rocket() -> _ {
    
    rocket::build().mount("/", routes![index, new_participant, get_participant, new_availibility, get_availability])
}
