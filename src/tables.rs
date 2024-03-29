use rocket::serde::Serialize;

#[derive(Debug, PartialEq, Eq, Serialize, Clone)]
#[serde(crate = "rocket::serde")]
pub struct Availability {
    pub id: i32,
    pub participant_id: i32,
    pub priority: i32,
    pub start: i32,
    pub end: i32,
    pub day: usize,
}

#[derive(Debug, PartialEq, Eq, Serialize, Clone)]
#[serde(crate = "rocket::serde")]
pub struct Columns {
    pub id: i32,
    pub name: String,
    pub length: i32,
}

#[derive(Debug, PartialEq, Eq, Serialize, Clone)]
#[serde(crate = "rocket::serde")]
pub struct Ownership {
    pub meeting_id: i32,
    pub participant_id: i32,
}

#[derive(Debug, PartialEq, Eq, Serialize, Clone)]
#[serde(crate = "rocket::serde")]
pub struct Participants {
    pub id: i32,
    pub name: String,
}

#[derive(Debug, PartialEq, Eq, Serialize, Clone)]
#[serde(crate = "rocket::serde")]
pub struct Participation {
    pub meeting_id: i32,
    pub participant_id: i32,
}