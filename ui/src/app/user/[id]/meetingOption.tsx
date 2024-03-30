"use client";

import styles from "./meetingOption.module.scss"

import MeetingPoint from "@/common/MeetingPoint";


export default function MeetingOption({meeting, tag}: {meeting: MeetingPoint, tag: number}) {
    
    const tagLookup = [
        null, // 0
        <div className={styles.tag_own}>own</div>, // 1
        <div className={styles.tag_participating}>participating</div>, // 2
    ]
    
    function convertToTime(timeMinutes: number) {
        var minutes: any = timeMinutes % 60;
        if (minutes < 10) {
            minutes = minutes + "0"
        }
        const hours = Math.floor(timeMinutes / 60)
        return hours + ":" + minutes 
    }
    
    
    return (
      <div className={styles.meeting_option}>
        <div className={styles.name}>
            <span>{meeting.name}</span>
        </div>
        <div className={styles.length}>
            {convertToTime(meeting.length)}
        </div>
        <div className={styles.tags}>
            {tagLookup[tag]}
        </div>
      </div>
    );
  }