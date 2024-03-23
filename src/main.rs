use mysql::*;
use mysql::prelude::*;

fn main() {
    
    #[derive(Debug, PartialEq, Eq)]
    struct TestRow {
        id: i32,
        data: String,
        datatwo: i32,
    }
    
    let username = env!("DB_USERNAME", "failed to fetch username");
    let password = env!("DB_PASSWORD", "failed to fetch password");
    let db_name = env!("DB_NAME", "failed to fetch database name");
    let opts = OptsBuilder::new()
        .user(Some(username))
        .pass(Some(password))
        .db_name(Some(db_name));
    
    let pool = Pool::new(opts).unwrap();
    let mut conn = pool.get_conn().unwrap();


    let select = conn
    .query_map(
        "SELECT * FROM testing_schema.testtable;",
        |(id, data, datatwo)| {
            TestRow { id, data, datatwo }
        },
    ).unwrap();
    
    println!("{}, {}, {}", select[0].id, select[0].data, select[0].datatwo);
    
    
}
