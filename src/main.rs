use mysql::*;
use mysql::prelude::*;
use rocket::http::Status;
use rocket::response::status;
use rocket::serde::json::Json;

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
fn index() -> status::Accepted<String> {
    
    let select = db_connect()
    .query_map(
        "SELECT * FROM participants;",
        |(id, name)| {
            tables::Participants{ id, name }
        },
    ).unwrap();
    
    status::Accepted(format!("{}, {}", select[3].id, select[3].name))
}

#[get("/participant/<id>")]
    fn get_participant(id: i32) -> Json<tables::Participants> {
        let response = db_connect().query_map(
            format!("SELECT * FROM participants WHERE id = {} LIMIT 1;", id),
            |(id, name)| {
                tables::Participants{ id, name}
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


#[launch]
fn rocket() -> _ {
    
    rocket::build().mount("/", routes![index, new_participant, get_participant])
}
