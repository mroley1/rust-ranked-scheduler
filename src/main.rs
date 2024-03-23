use mysql::*;
use mysql::prelude::*;
use rocket::response::status;

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
    
    status::Accepted(format!("{}, {}", select[1].id, select[1].name))
}

#[launch]
fn rocket() -> _ {
    
    rocket::build().mount("/", routes![index])
}
